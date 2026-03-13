import base64
import io
import numpy as np
import cv2
from PIL import Image
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

editor = APIRouter()


class GenerateStrokesRequest(BaseModel):
    image_base64: str
    n: int = 10
    canvas_size: int = 800
    center: int = 400
    circle_radius: int = 350


class Point(BaseModel):
    x: float
    y: float
    type: str = "L"


class StrokeResponse(BaseModel):
    id: int
    points: List[Point]
    color: str
    width: float


STROKE_COLORS = [
    '#06b6d4', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
    '#e11d48', '#0ea5e9', '#d946ef', '#22d3ee', '#facc15',
]


@editor.get("/status")
def get_editor_status():
    return {"status": "ok", "message": "Editor API is running"}


def skeletonize(binary_img):
    """Thin a binary image down to 1-pixel-wide lines using morphological skeleton."""
    skeleton = np.zeros_like(binary_img)
    element = cv2.getStructuringElement(cv2.MORPH_CROSS, (3, 3))
    temp = binary_img.copy()
    while True:
        eroded = cv2.erode(temp, element)
        opened = cv2.dilate(eroded, element)
        diff = cv2.subtract(temp, opened)
        skeleton = cv2.bitwise_or(skeleton, diff)
        temp = eroded.copy()
        if cv2.countNonZero(temp) == 0:
            break
    return skeleton


def trace_path_from(skeleton, start_y, start_x, visited):
    """Trace a connected path through the skeleton starting from a given point."""
    path = []
    cy, cx = start_y, start_x
    h, w = skeleton.shape

    while True:
        if visited[cy, cx]:
            break
        visited[cy, cx] = True
        path.append((cx, cy))  # (x, y) format

        # Look at 8-connected neighbors for the next unvisited skeleton pixel
        found = False
        for dy in [-1, 0, 1]:
            for dx in [-1, 0, 1]:
                if dy == 0 and dx == 0:
                    continue
                ny, nx = cy + dy, cx + dx
                if 0 <= ny < h and 0 <= nx < w and skeleton[ny, nx] > 0 and not visited[ny, nx]:
                    cy, cx = ny, nx
                    found = True
                    break
            if found:
                break

        if not found:
            break

    return path


def simplify_path(path, tolerance=1.5):
    """Simplify a path using Douglas-Peucker algorithm via OpenCV."""
    if len(path) < 3:
        return path
    pts = np.array(path, dtype=np.float32).reshape(-1, 1, 2)
    approx = cv2.approxPolyDP(pts, tolerance, False)
    return [(float(p[0][0]), float(p[0][1])) for p in approx]


@editor.post("/generate-strokes")
def generate_strokes(req: GenerateStrokesRequest):
    try:
        # 1. Decode base64 image
        img_data = req.image_base64
        if ',' in img_data:
            img_data = img_data.split(',')[1]

        img_bytes = base64.b64decode(img_data)
        pil_img = Image.open(io.BytesIO(img_bytes)).convert('RGBA')
        img_array = np.array(pil_img)

        # 2. Create circle mask
        h, w = img_array.shape[:2]
        mask = np.zeros((h, w), dtype=np.uint8)
        cv2.circle(mask, (req.center, req.center), req.circle_radius, 255, -1)

        # 3. Convert to grayscale
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGBA2GRAY)

        # 4. Invert threshold: dark lines become white foreground
        _, binary = cv2.threshold(gray, 180, 255, cv2.THRESH_BINARY_INV)

        # 5. Apply circle mask
        binary = cv2.bitwise_and(binary, binary, mask=mask)

        # 6. Clean up noise
        kernel = np.ones((2, 2), np.uint8)
        binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)

        # 7. Skeletonize
        skeleton = skeletonize(binary)

        # 8. Trace all connected components
        visited = np.zeros_like(skeleton, dtype=bool)
        all_paths = []

        # Find endpoints first to trace from endpoints (better continuity)
        def count_neighbors(y, x):
            count = 0
            for dy in [-1, 0, 1]:
                for dx in [-1, 0, 1]:
                    if dy == 0 and dx == 0: continue
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and skeleton[ny, nx] > 0:
                        count += 1
            return count

        ys, xs = np.where(skeleton > 0)
        
        endpoints = []
        for i in range(len(ys)):
            y, x = ys[i], xs[i]
            if count_neighbors(y, x) == 1:
                endpoints.append((y, x))
                
        # First pass: endpoints
        for (y, x) in endpoints:
            if not visited[y, x]:
                path = trace_path_from(skeleton, y, x, visited)
                if len(path) >= 2:
                    all_paths.append(path)
                    
        # Second pass: remaining loops or isolated pieces
        ys, xs = np.where((skeleton > 0) & (~visited))
        for i in range(len(ys)):
            y, x = ys[i], xs[i]
            if not visited[y, x]:
                path = trace_path_from(skeleton, y, x, visited)
                if len(path) >= 2:
                    all_paths.append(path)

        if not all_paths:
            return {"strokes": [], "message": "No traceable lines found"}

        n_req = min(req.n, 50)

        # 9. Distribute paths into n_req groups prioritizing continuity
        final_groups = [[] for _ in range(n_req)]
        
        if len(all_paths) < n_req:
            # We have fewer lines than requested strokes, we MUST split the longest ones
            while len(all_paths) < n_req:
                all_paths.sort(key=len, reverse=True)
                longest = all_paths.pop(0)
                if len(longest) < 4:
                    all_paths.append(longest)
                    break # Cannot split further cleanly
                mid = len(longest) // 2
                all_paths.append(longest[:mid+1])
                all_paths.append(longest[mid:])
                
            for i, p in enumerate(all_paths):
                final_groups[i % n_req].append(p)
                
        else:
            # We have more lines than requested strokes, we must group them.
            # Keep the n_req longest lines as the base for each group.
            all_paths.sort(key=len, reverse=True)
            for i in range(n_req):
                final_groups[i].append(all_paths[i])
                
            # Distribute the remaining smaller paths
            remaining_paths = all_paths[n_req:]
            
            for p in remaining_paths:
                if not p: continue
                p_start = p[0]
                p_end = p[-1]
                
                best_group_idx = 0
                min_dist = float('inf')
                
                # Find the group whose last endpoint is closest to this path
                for i in range(n_req):
                    group = final_groups[i]
                    if not group: continue
                    last_path = group[-1]
                    if not last_path: continue
                    
                    g_end = last_path[-1]
                    
                    # Distance from group end to path start
                    dist = (g_end[0] - p_start[0])**2 + (g_end[1] - p_start[1])**2
                    
                    if dist < min_dist:
                        min_dist = dist
                        best_group_idx = i
                        
                final_groups[best_group_idx].append(p)

        # 10. Simplify and build response
        strokes = []
        for i, group in enumerate(final_groups):
            if not group: continue
            
            stroke_points = []
            for p in group:
                simplified = simplify_path(p, tolerance=1.5)
                if len(simplified) < 2: continue
                
                # Filter points within circle radius
                valid_simplified = []
                for x, y in simplified:
                    dx = x - req.center
                    dy = y - req.center
                    if np.sqrt(dx*dx + dy*dy) <= req.circle_radius:
                        valid_simplified.append((x, y))
                        
                if len(valid_simplified) < 2: continue
                
                # Add sub-path to this stroke
                for j, (x, y) in enumerate(valid_simplified):
                    pt_type = "M" if j == 0 else "L"
                    stroke_points.append(Point(x=x, y=y, type=pt_type))
                    
            if not stroke_points:
                continue
                
            color = STROKE_COLORS[i % len(STROKE_COLORS)]
            strokes.append(StrokeResponse(
                id=i + 1,
                points=stroke_points,
                color=color,
                width=3.0,
            ))

        return {"strokes": [s.dict() for s in strokes], "count": len(strokes)}

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"strokes": [], "error": str(e)}

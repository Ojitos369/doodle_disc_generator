import base64
import io
import numpy as np
import cv2
import asyncio
from PIL import Image
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Optional, Dict

editor = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]

    async def send_message(self, message: str, client_id: str):
        if client_id in self.active_connections:
            try:
                await self.active_connections[client_id].send_text(message)
            except Exception:
                pass

manager = ConnectionManager()

@editor.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(client_id)



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


def simplify_path(path, tolerance=1.5):
    """Simplify a path using Douglas-Peucker algorithm via OpenCV."""
    if len(path) < 3:
        return path
    pts = np.array(path, dtype=np.float32).reshape(-1, 1, 2)
    approx = cv2.approxPolyDP(pts, tolerance, False)
    return [(float(p[0][0]), float(p[0][1])) for p in approx]

@editor.post("/preview-groups")
async def preview_groups(req: GenerateStrokesRequest):
    try:
        img_data = req.image_base64
        if ',' in img_data:
            img_data = img_data.split(',')[1]

        img_bytes = base64.b64decode(img_data)
        pil_img = Image.open(io.BytesIO(img_bytes)).convert('RGBA')
        img_array = np.array(pil_img)

        h, w = img_array.shape[:2]
        mask = np.zeros((h, w), dtype=np.uint8)
        cv2.circle(mask, (req.center, req.center), req.circle_radius, 255, -1)

        gray = cv2.cvtColor(img_array, cv2.COLOR_RGBA2GRAY)
        _, binary = cv2.threshold(gray, 180, 255, cv2.THRESH_BINARY_INV)
        binary = cv2.bitwise_and(binary, binary, mask=mask)
        
        # Enfoque Vectorial SVG directo
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        groups_data = []
        for idx, cnt in enumerate(contours):
            # Simplificar para aproximar curvas de Bézier SVG (True porque es loop cerrado)
            approx = cv2.approxPolyDP(cnt, 1.5, True)
            path = [(float(p[0][0]), float(p[0][1])) for p in approx]
            if len(path) >= 2:
                path.append(path[0]) # Cerrar el loop visualmente
                groups_data.append({
                    "id": idx,
                    "paths": [path]
                })
                
        # Limitar en caso de ultra-ruido en la preview
        if len(groups_data) > 300:
            groups_data.sort(key=lambda g: sum(len(p) for p in g["paths"]), reverse=True)
            groups_data = groups_data[:300]
            
        return {"groups": groups_data}
    except Exception as e:
        print(f"Error previewing groups: {e}")
        return {"groups": []}




@editor.post("/generate-strokes")
async def generate_strokes(req: GenerateStrokesRequest, client_id: str = "default"):
    import json
    
    async def log_msg(msg: str):
        print(msg)
        await manager.send_message(json.dumps({"type": "log", "msg": msg}), client_id)
        await asyncio.sleep(0.01)

    async def send_preview(paths: list):
        # paths is a list of {'group', 'path'} dicts
        raw = [p["path"] for p in paths]
        # Only send top 100 paths to avoid massive websocket payloads
        raw = raw[:100]
        # Convert to flat list of lists of xy coords for JSON
        preview_data = [ [[float(x), float(y)] for y, x in path] for path in raw ]
        await manager.send_message(json.dumps({"type": "preview", "paths": preview_data}), client_id)
        await asyncio.sleep(0.05)
        
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

        # 3. Convert to grayscale & binary threshold
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGBA2GRAY)
        _, binary = cv2.threshold(gray, 180, 255, cv2.THRESH_BINARY_INV)
        binary = cv2.bitwise_and(binary, binary, mask=mask)
        
        # 4. Skeletonize directly (no tolerance bridging)
        skeleton = skeletonize(binary)

        # 4. Skeletonize directly (no tolerance bridging)
        skeleton = skeletonize(binary)

        # 5. Extract components using OpenCV's optimized native vectorizer
        # RETR_LIST extracts everything (inner and outer).
        # Since it's a 1-pixel skeleton, the contour natively "walks" the bone back and forth,
        # perfectly producing a single continuous path without double-edge artifacts!
        contours, _ = cv2.findContours(skeleton, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
        
        all_small_paths = []
        for idx, cnt in enumerate(contours):
            # Smooth the contour slightly
            approx = cv2.approxPolyDP(cnt, 1.5, False)
            # Remove the tiny single-pixel dots
            if len(approx) < 3: continue
            
            p = [(float(pt[0][0]), float(pt[0][1])) for pt in approx]
            
            # Sub-divide into chunks of 30 if ridiculously long to give the merger some flexibility
            MAX_LEN = 30
            if len(p) <= MAX_LEN:
                all_small_paths.append({"group": idx, "path": p})
            else:
                for i in range(0, len(p) - 1, MAX_LEN - 1):
                    chunk = p[i:min(i + MAX_LEN, len(p))]
                    if len(chunk) > 1:
                        all_small_paths.append({"group": idx, "path": chunk})

        await log_msg(f"Paso 1: Esqueleto vectorizado, extrajo {len(all_small_paths)} curvas puras y naturales.")
        
        if not all_small_paths:
            return {"strokes": [], "message": "No traceable lines found"}

        n_req = min(req.n, 50)
        
        # 5. Si hay menos formas que N, partir los trazos largos por la mitad
        while len(all_small_paths) < n_req:
            all_small_paths.sort(key=lambda x: len(x["path"]), reverse=True)
            longest = all_small_paths.pop(0)
            p = longest["path"]
            if len(p) < 4:
                all_small_paths.append(longest)
                break
            mid = len(p) // 2
            # Split con 1 de traslape
            all_small_paths.append({"group": longest["group"], "path": p[:mid+1]})
            all_small_paths.append({"group": longest["group"], "path": p[mid:]})
            
        await log_msg(f"Paso 2: Ajustando conteo a {n_req} trazos requeridos.")
            
        # 6. Si hay más formas que N, unir naivamente de extremo a extremo
        if len(all_small_paths) > n_req:
            # Limpiar ultra-ruido antes de O(N^2) si N es enorme
            max_paths = max(400, n_req * 3)
            if len(all_small_paths) > max_paths:
                all_small_paths.sort(key=lambda x: len(x["path"]), reverse=True)
                all_small_paths = all_small_paths[:max_paths]
                await log_msg(f"Fase 2: Limpieza de ultra-ruido. Quedan {len(all_small_paths)} segmentos críticos.")
                await send_preview(all_small_paths)

            while len(all_small_paths) > n_req:
                best_i, best_j = -1, -1
                min_dist = float('inf')
                
                n_paths = len(all_small_paths)
                search_limit = min(n_paths, 300)
                
                for i in range(search_limit):
                    p1 = all_small_paths[i]["path"]
                    e1_e = p1[-1]
                    for j in range(i + 1, search_limit):
                        p2 = all_small_paths[j]["path"]
                        e2_s = p2[0]
                        
                        dist = (e1_e[0]-e2_s[0])**2 + (e1_e[1]-e2_s[1])**2
                        if dist < min_dist:
                            min_dist = dist
                            best_i, best_j = i, j
                            
                if best_i == -1 or min_dist > 900: # 30^2 pixels of max distance allowed
                    # If the closest lines are too far apart, DON'T MERGE THEM!
                    # Otherwise we get long straight lines shooting across the canvas drawing garbage.
                    break
                
                p1 = all_small_paths[best_i]["path"]
                p2 = all_small_paths[best_j]["path"]
                merged_path = p1 + p2
                
                grp = all_small_paths[best_i]["group"]
                all_small_paths.pop(best_j)
                all_small_paths.pop(best_i)
                all_small_paths.append({"group": grp, "path": merged_path})
                
                if len(all_small_paths) % 15 == 0 or len(all_small_paths) == n_req:
                    await log_msg(f"Fase 2: Uniendo líneas únicas... Quedan {len(all_small_paths)} divisiones (Objetivo: {n_req}).")
                    await send_preview(all_small_paths)
            
        await log_msg(f"Final: Generación SVG terminada con {len(all_small_paths)} trazos.")
        final_strokes_data = [[info["path"]] for info in all_small_paths]

        # 8. Simplify paths and generate final response
        strokes = []
        for i, stroke_paths in enumerate(final_strokes_data):
            if not stroke_paths: continue
            
            stroke_points = []
            
            for path in stroke_paths:
                simplified = simplify_path(path, tolerance=1.5)
                
                if len(simplified) < 2: continue
                
                valid_pts = []
                for x, y in simplified:
                    dx = x - req.center
                    dy = y - req.center
                    if np.sqrt(dx*dx + dy*dy) <= req.circle_radius:
                        valid_pts.append((x, y))
                        
                if len(valid_pts) < 2: continue
                
                # ALL points are connected continuously (L) except the very first point of the stroke
                # No 'M' commands inserted mid-stroke, guaranteeing zero pen lifts
                for idx, pt in enumerate(valid_pts):
                    pt_type = "M" if idx == 0 and len(stroke_points) == 0 else "L"
                    stroke_points.append(Point(x=pt[0], y=pt[1], type=pt_type))
                    
            if not stroke_points: continue
                
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

from fastapi import APIRouter

editor = APIRouter()

@editor.get("/status")
def get_editor_status():
    return {"status": "ok", "message": "Editor API is running"}

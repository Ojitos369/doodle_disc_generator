from fastapi import APIRouter, WebSocket

from .api import ChatSocketApi
from core.websockets.manager import manager

router = APIRouter()

@router.websocket("/{chat_id}")
async def chat_socket_endpoint(websocket: WebSocket, chat_id: str):
    handler = ChatSocketApi(
        websocket=websocket, 
        manager=manager, 
        chat_id=chat_id
    )
    await handler.handle_connection()


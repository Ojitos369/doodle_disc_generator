from fastapi import APIRouter
from .base.urls import router as base_router
from .auth.urls import router as auth_router
from .sockets.urls import router as socket_router
from .get_media.urls import router as get_media_router

apis = APIRouter()
media = APIRouter()

media.include_router(get_media_router, prefix="")
apis.include_router(base_router, prefix="/base")
apis.include_router(base_router, prefix="/base")
apis.include_router(auth_router, prefix="/auth")
apis.include_router(socket_router, prefix="/ws")

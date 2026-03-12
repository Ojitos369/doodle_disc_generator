from fastapi import APIRouter, Request
from .api import (
    HelloWorld, GetModes
)

router = APIRouter()

@router.get("/hh")
async def hh(request: Request):
    r = await HelloWorld(request=request).run()
    return r

@router.get("/get_modes")
async def get_modes(request: Request):
    r = await GetModes(request=request).run()
    return r

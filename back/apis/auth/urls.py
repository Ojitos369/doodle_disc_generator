from fastapi import APIRouter, Request
from .api import (
    Login, ValidateLogin
)

router = APIRouter()

@router.post("/login")
async def login(request: Request):
    r = await Login(request=request).run()
    return r

@router.get("/validate_login")
async def validate_login(request: Request):
    r = await ValidateLogin(request=request).run()
    return r

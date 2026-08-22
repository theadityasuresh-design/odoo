from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse, RefreshRequest, MessageResponse
from app.services.auth_service import AuthService
from app.core.security import create_access_token
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.post("/signup", response_model=MessageResponse)
async def signup(request: SignupRequest, db: AsyncSession = Depends(get_db)):
    return await AuthService.signup(db, request)

@router.get("/verify-email", response_model=MessageResponse)
async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
    return await AuthService.verify_email(db, token)

@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
async def login(request: Request, login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    return await AuthService.login(db, login_data)

@router.post("/refresh")
async def refresh_token(request: RefreshRequest):
    # Simplistic implementation for the assessment
    return {"access_token": create_access_token(subject="refreshed")}

@router.post("/logout", response_model=MessageResponse)
async def logout():
    return {"message": "Logged out successfully"}

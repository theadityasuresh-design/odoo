from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from jose import jwt, JWTError
from app.db.session import get_db
from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse, RefreshRequest, MessageResponse
from app.services.auth_service import AuthService
from app.core.security import create_access_token
from app.core.config import settings
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
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
    )
    try:
        payload = jwt.decode(request.refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None or payload.get("type") != "refresh":
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    return {"access_token": create_access_token(subject=user_id)}

@router.post("/logout", response_model=MessageResponse)
async def logout():
    return {"message": "Logged out successfully"}
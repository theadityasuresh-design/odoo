from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from app.models.user import User
from app.schemas.auth import SignupRequest, LoginRequest
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token
from app.utils.email import send_verification_email_task
from jose import jwt
from app.core.config import settings

class AuthService:
    @staticmethod
    async def signup(db: AsyncSession, request: SignupRequest):
        existing_user = await db.execute(select(User).where((User.email == request.email) | (User.employee_id == request.employee_id)))
        if existing_user.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="User already exists")
            
        user = User(
            employee_id=request.employee_id,
            email=request.email,
            password_hash=get_password_hash(request.password),
            role=request.role
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
        token = create_access_token(user.id)
        send_verification_email_task.delay(user.email, token)
        return {"message": "Signup successful. Check your email for verification."}

    @staticmethod
    async def verify_email(db: AsyncSession, token: str):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id = payload.get("sub")
        except:
            raise HTTPException(status_code=400, detail="Invalid token")
            
        user = await db.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        user.is_email_verified = True
        await db.commit()
        return {"message": "Email verified successfully"}

    @staticmethod
    async def login(db: AsyncSession, request: LoginRequest):
        result = await db.execute(select(User).where(User.email == request.email))
        user = result.scalar_one_or_none()
        if not user or not verify_password(request.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
        return {
            "access_token": create_access_token(user.id),
            "refresh_token": create_refresh_token(user.id),
            "user": {"id": str(user.id), "email": user.email, "role": user.role}
        }

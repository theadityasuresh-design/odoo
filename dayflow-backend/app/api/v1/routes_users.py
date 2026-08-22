from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.db.session import get_db
from app.models.user import User
from app.models.employee_profile import EmployeeProfile
from app.schemas.user import UserResponse, PaginatedUsersResponse, EmployeeProfileUpdate
from app.core.dependencies import get_current_user, require_role
from app.utils.pagination import paginate

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserResponse)
async def update_me(update_data: EmployeeProfileUpdate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not current_user.profile:
        current_user.profile = EmployeeProfile(user_id=current_user.id)
        db.add(current_user.profile)
    
    for key, value in update_data.model_dump(exclude_unset=True).items():
        setattr(current_user.profile, key, value)
        
    await db.commit()
    await db.refresh(current_user, attribute_names=["profile"])
    return current_user

@router.get("", response_model=PaginatedUsersResponse, dependencies=[Depends(require_role("admin"))])
async def list_users(page: int = 1, page_size: int = 10, db: AsyncSession = Depends(get_db)):
    offset = (page - 1) * page_size
    query = select(User).options(selectinload(User.profile)).limit(page_size).offset(offset)
    result = await db.execute(query)
    users = result.scalars().all()
    
    count_query = select(func.count()).select_from(User)
    total = await db.scalar(count_query)
    
    return paginate(users, total, page, page_size)

@router.get("/{id}", response_model=UserResponse, dependencies=[Depends(require_role("admin"))])
async def get_user(id: str, db: AsyncSession = Depends(get_db)):
    user = await db.get(User, id, options=[selectinload(User.profile)])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/{id}", response_model=UserResponse, dependencies=[Depends(require_role("admin"))])
async def update_user(id: str, update_data: EmployeeProfileUpdate, db: AsyncSession = Depends(get_db)):
    user = await db.get(User, id, options=[selectinload(User.profile)])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.profile:
        user.profile = EmployeeProfile(user_id=user.id)
        db.add(user.profile)
    for key, value in update_data.model_dump(exclude_unset=True).items():
        setattr(user.profile, key, value)
    await db.commit()
    await db.refresh(user, attribute_names=["profile"])
    return user
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from app.db.session import get_db
from app.models.user import User
from app.models.leave_request import LeaveRequest
from app.schemas.leave import LeaveCreate, LeaveResponse, LeaveListResponse, LeaveDecision
from app.core.dependencies import get_current_user, require_role
from app.services.leave_service import LeaveService

router = APIRouter()

@router.post("", response_model=LeaveResponse)
async def request_leave(request: LeaveCreate, current_user: User = Depends(require_role("employee", "admin")), db: AsyncSession = Depends(get_db)):
    return await LeaveService.create_request(db, current_user, request)

@router.get("/me", response_model=LeaveListResponse)
async def my_leaves(current_user: User = Depends(require_role("employee", "admin")), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(LeaveRequest).where(LeaveRequest.user_id == current_user.id))
    return {"requests": result.scalars().all()}

@router.get("", response_model=LeaveListResponse, dependencies=[Depends(require_role("admin"))])
async def get_leaves(status: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    query = select(LeaveRequest)
    if status:
        query = query.where(LeaveRequest.status == status)
    result = await db.execute(query)
    return {"requests": result.scalars().all()}

@router.patch("/{id}/decision", response_model=LeaveResponse)
async def update_leave_decision(id: str, decision: LeaveDecision, current_user: User = Depends(require_role("admin")), db: AsyncSession = Depends(get_db)):
    return await LeaveService.update_status(db, id, current_user, decision.status, decision.reviewer_comments)

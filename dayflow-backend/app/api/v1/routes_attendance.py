from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from app.db.session import get_db
from app.models.user import User
from app.models.attendance import Attendance
from app.schemas.attendance import CheckInOutRequest, AttendanceResponse, AttendanceListResponse
from app.core.dependencies import get_current_user, require_role
from app.services.attendance_service import AttendanceService

router = APIRouter()

@router.post("/check-in", response_model=AttendanceResponse)
async def check_in(request: CheckInOutRequest, current_user: User = Depends(require_role("employee")), db: AsyncSession = Depends(get_db)):
    return await AttendanceService.check_in(db, current_user, request.timestamp)

@router.post("/check-out", response_model=AttendanceResponse)
async def check_out(request: CheckInOutRequest, current_user: User = Depends(require_role("employee")), db: AsyncSession = Depends(get_db)):
    return await AttendanceService.check_out(db, current_user, request.timestamp)

@router.get("/me", response_model=AttendanceListResponse)
async def get_my_attendance(view: str = "daily", current_user: User = Depends(require_role("employee")), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Attendance).where(Attendance.user_id == current_user.id))
    return {"records": result.scalars().all()}

@router.get("", response_model=AttendanceListResponse, dependencies=[Depends(require_role("admin"))])
async def get_all_attendance(user_id: Optional[str] = None, from_date: Optional[str] = None, to_date: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    query = select(Attendance)
    if user_id:
        query = query.where(Attendance.user_id == user_id)
    result = await db.execute(query)
    return {"records": result.scalars().all()}

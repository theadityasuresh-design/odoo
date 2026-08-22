from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import require_role
from app.db.session import get_db
from app.models.attendance import Attendance
from app.models.leave_request import LeaveRequest
from app.models.user import User

router = APIRouter()


@router.get("/attendance-summary")
async def attendance_summary(
    from_date: Optional[date] = Query(None, alias="from", description="Start date (YYYY-MM-DD)"),
    to_date: Optional[date] = Query(None, alias="to", description="End date (YYYY-MM-DD)"),
    _: User = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db),
):
    """
    Aggregate attendance records across all employees grouped by status.
    Optionally filter by date range (from / to query params).
    """
    query = select(
        Attendance.status,
        func.count(Attendance.id).label("count"),
    ).group_by(Attendance.status)

    if from_date:
        query = query.where(Attendance.att_date >= from_date)
    if to_date:
        query = query.where(Attendance.att_date <= to_date)

    result = await db.execute(query)
    rows = result.all()

    breakdown = {row.status: row.count for row in rows}
    total = sum(breakdown.values())

    return {
        "total_records": total,
        "from_date": from_date,
        "to_date": to_date,
        "breakdown": {
            "present": breakdown.get("present", 0),
            "absent": breakdown.get("absent", 0),
            "half_day": breakdown.get("half_day", 0),
            "leave": breakdown.get("leave", 0),
        },
    }


@router.get("/leave-summary")
async def leave_summary(
    from_date: Optional[date] = Query(None, alias="from", description="Start date (YYYY-MM-DD)"),
    to_date: Optional[date] = Query(None, alias="to", description="End date (YYYY-MM-DD)"),
    _: User = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db),
):
    """
    Aggregate leave requests grouped by status and leave_type.
    Optionally filter by date range (from / to query params).
    """
    # Count by status
    status_query = (
        select(
            LeaveRequest.status,
            func.count(LeaveRequest.id).label("count"),
        )
        .group_by(LeaveRequest.status)
    )
    if from_date:
        status_query = status_query.where(LeaveRequest.start_date >= from_date)
    if to_date:
        status_query = status_query.where(LeaveRequest.end_date <= to_date)

    # Count by leave_type
    type_query = (
        select(
            LeaveRequest.leave_type,
            func.count(LeaveRequest.id).label("count"),
        )
        .group_by(LeaveRequest.leave_type)
    )
    if from_date:
        type_query = type_query.where(LeaveRequest.start_date >= from_date)
    if to_date:
        type_query = type_query.where(LeaveRequest.end_date <= to_date)

    status_result = await db.execute(status_query)
    type_result = await db.execute(type_query)

    by_status = {row.status: row.count for row in status_result.all()}
    by_type = {row.leave_type: row.count for row in type_result.all()}
    total = sum(by_status.values())

    return {
        "total_requests": total,
        "from_date": from_date,
        "to_date": to_date,
        "by_status": {
            "pending": by_status.get("pending", 0),
            "approved": by_status.get("approved", 0),
            "rejected": by_status.get("rejected", 0),
        },
        "by_type": {
            "paid": by_type.get("paid", 0),
            "sick": by_type.get("sick", 0),
            "unpaid": by_type.get("unpaid", 0),
        },
    }

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.attendance import Attendance
from app.models.user import User
from datetime import datetime, timedelta, timezone
class AttendanceService:
    @staticmethod
    async def check_in(db: AsyncSession, user: User, timestamp: datetime):
        if timestamp.tzinfo is not None:
             timestamp = timestamp.astimezone(timezone.utc).replace(tzinfo=None)
        att = Attendance(
            user_id=user.id,
            att_date=timestamp.date(),
            check_in=timestamp,
            status="present"
        )
        db.add(att)
        await db.commit()
        await db.refresh(att)
        return att

    @staticmethod
    async def check_out(db: AsyncSession, user: User, timestamp: datetime):
        if timestamp.tzinfo is not None:
            timestamp = timestamp.astimezone(timezone.utc).replace(tzinfo=None)
        result = await db.execute(
            select(Attendance)
            .where(Attendance.user_id == user.id, Attendance.att_date == timestamp.date())
        )
        att = result.scalar_one_or_none()
        if not att:
            raise ValueError("No check-in found for today")
        att.check_out = timestamp
        await db.commit()
        await db.refresh(att)
        return att

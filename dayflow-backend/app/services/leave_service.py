from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.leave_request import LeaveRequest
from app.schemas.leave import LeaveCreate
from app.models.user import User

class LeaveService:
    @staticmethod
    async def create_request(db: AsyncSession, user: User, leave_in: LeaveCreate):
        req = LeaveRequest(
            user_id=user.id,
            **leave_in.model_dump()
        )
        db.add(req)
        await db.commit()
        await db.refresh(req)
        return req

    @staticmethod
    async def update_status(db: AsyncSession, req_id: str, admin: User, status: str, comments: str = None):
        req = await db.get(LeaveRequest, req_id)
        if not req:
            raise ValueError("Leave request not found")
        req.status = status
        req.reviewed_by = admin.id
        req.reviewer_comments = comments
        await db.commit()
        await db.refresh(req)
        return req

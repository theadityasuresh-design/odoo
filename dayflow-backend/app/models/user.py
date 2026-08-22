import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    employee_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String)
    role: Mapped[str] = mapped_column(String)
    is_email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    profile = relationship("EmployeeProfile", back_populates="user", uselist=False)
    attendances = relationship("Attendance", back_populates="user")
    leave_requests = relationship("LeaveRequest", back_populates="user", foreign_keys="[LeaveRequest.user_id]")
    payroll = relationship("Payroll", back_populates="user", uselist=False)
    documents = relationship("Document", back_populates="user")

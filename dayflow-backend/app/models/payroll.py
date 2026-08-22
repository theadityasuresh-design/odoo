import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import Numeric, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class Payroll(Base):
    __tablename__ = "payrolls"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    base_salary: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=0)
    allowances: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=0)
    deductions: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=0)
    net_salary: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=0)
    pay_cycle: Mapped[str] = mapped_column(String, default="monthly")
    last_updated: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="payroll")

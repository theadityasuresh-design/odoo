from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.user import User
from app.models.payroll import Payroll
from app.schemas.payroll import PayrollResponse, PayrollUpdate
from app.core.dependencies import get_current_user, require_role
from app.services.payroll_service import PayrollService

router = APIRouter()

@router.get("/me", response_model=PayrollResponse)
async def my_payroll(current_user: User = Depends(require_role("employee")), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Payroll).where(Payroll.user_id == current_user.id))
    payroll = result.scalar_one_or_none()
    if not payroll:
        raise HTTPException(status_code=404, detail="Payroll not found")
    return payroll

@router.get("/{user_id}", response_model=PayrollResponse, dependencies=[Depends(require_role("admin"))])
async def get_payroll(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Payroll).where(Payroll.user_id == user_id))
    payroll = result.scalar_one_or_none()
    if not payroll:
        raise HTTPException(status_code=404, detail="Payroll not found")
    return payroll

@router.patch("/{user_id}", response_model=PayrollResponse, dependencies=[Depends(require_role("admin"))])
async def update_payroll(user_id: str, update_data: PayrollUpdate, db: AsyncSession = Depends(get_db)):
    return await PayrollService.update_payroll(db, user_id, update_data)

@router.get("/reports/salary-slip/{user_id}")
async def generate_salary_slip(user_id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin" and str(current_user.id) != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    result = await db.execute(select(Payroll).where(Payroll.user_id == user_id))
    payroll = result.scalar_one_or_none()
    if not payroll:
        raise HTTPException(status_code=404, detail="Payroll not found")
    return {
        "user_id": user_id,
        "base_salary": payroll.base_salary,
        "allowances": payroll.allowances,
        "deductions": payroll.deductions,
        "net_salary": payroll.net_salary,
        "pay_cycle": payroll.pay_cycle
    }

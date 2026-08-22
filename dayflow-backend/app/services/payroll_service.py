from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.payroll import Payroll
from app.schemas.payroll import PayrollUpdate

class PayrollService:
    @staticmethod
    async def update_payroll(db: AsyncSession, user_id: str, update_data: PayrollUpdate):
        result = await db.execute(select(Payroll).where(Payroll.user_id == user_id))
        payroll = result.scalar_one_or_none()
        if not payroll:
            payroll = Payroll(user_id=user_id)
            db.add(payroll)
            
        if update_data.base_salary is not None:
            payroll.base_salary = update_data.base_salary
        if update_data.allowances is not None:
            payroll.allowances = update_data.allowances
        if update_data.deductions is not None:
            payroll.deductions = update_data.deductions
            
        payroll.net_salary = payroll.base_salary + payroll.allowances - payroll.deductions
        await db.commit()
        await db.refresh(payroll)
        return payroll

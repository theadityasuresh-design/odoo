from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import Optional

class PayrollUpdate(BaseModel):
    base_salary: Optional[Decimal] = None
    allowances: Optional[Decimal] = None
    deductions: Optional[Decimal] = None

class PayrollResponse(BaseModel):
    id: UUID
    user_id: UUID
    base_salary: Decimal
    allowances: Decimal
    deductions: Decimal
    net_salary: Decimal
    pay_cycle: str
    last_updated: datetime
    model_config = ConfigDict(from_attributes=True)

from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import date, datetime
from typing import Optional, List

class CheckInOutRequest(BaseModel):
    timestamp: datetime

class AttendanceResponse(BaseModel):
    id: UUID
    user_id: UUID
    att_date: date
    check_in: Optional[datetime]
    check_out: Optional[datetime]
    status: str
    model_config = ConfigDict(from_attributes=True)

class AttendanceListResponse(BaseModel):
    records: List[AttendanceResponse]

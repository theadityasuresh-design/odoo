from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import date, datetime
from typing import Optional, List

class LeaveCreate(BaseModel):
    leave_type: str
    start_date: date
    end_date: date
    remarks: Optional[str] = None

class LeaveDecision(BaseModel):
    status: str
    reviewer_comments: Optional[str] = None

class LeaveResponse(BaseModel):
    id: UUID
    user_id: UUID
    leave_type: str
    start_date: date
    end_date: date
    remarks: Optional[str]
    status: str
    reviewed_by: Optional[UUID]
    reviewer_comments: Optional[str]
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class LeaveListResponse(BaseModel):
    requests: List[LeaveResponse]

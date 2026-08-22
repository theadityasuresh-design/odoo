from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import date, datetime
from typing import Optional, List

class EmployeeProfileBase(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    job_title: Optional[str] = None
    department: Optional[str] = None
    date_of_joining: Optional[date] = None
    profile_picture_url: Optional[str] = None

class EmployeeProfileUpdate(EmployeeProfileBase):
    pass

class EmployeeProfileResponse(EmployeeProfileBase):
    id: UUID
    user_id: UUID
    model_config = ConfigDict(from_attributes=True)

class UserBase(BaseModel):
    employee_id: str
    email: str
    role: str

class UserResponse(UserBase):
    id: UUID
    is_email_verified: bool
    created_at: datetime
    profile: Optional[EmployeeProfileResponse] = None
    model_config = ConfigDict(from_attributes=True)

class PaginatedUsersResponse(BaseModel):
    items: List[UserResponse]
    total: int
    page: int
    page_size: int

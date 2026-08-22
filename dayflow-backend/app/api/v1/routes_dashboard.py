from fastapi import APIRouter, Depends
from app.models.user import User
from app.core.dependencies import require_role

router = APIRouter()

@router.get("/employee")
async def employee_dashboard(current_user: User = Depends(require_role("employee"))):
    return {
        "profile_summary": {"name": "Example", "department": "IT"},
        "attendance_today": {"status": "present"},
        "pending_leaves": [],
        "alerts": []
    }

@router.get("/admin")
async def admin_dashboard(current_user: User = Depends(require_role("admin"))):
    return {
        "employee_count": 10,
        "pending_approvals": 2,
        "today_attendance_summary": {"present": 8, "absent": 2}
    }

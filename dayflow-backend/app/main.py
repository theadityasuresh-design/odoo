from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.api.v1 import (
    routes_auth,
    routes_users,
    routes_attendance,
    routes_leave,
    routes_payroll,
    routes_dashboard,
    routes_reports,
)
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    yield
    # Shutdown


app = FastAPI(title="Dayflow HRMS API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SlowAPI rate-limit handler
from app.api.v1.routes_auth import limiter  # noqa: E402

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.include_router(routes_auth.router,       prefix="/api/v1/auth",       tags=["Auth"])
app.include_router(routes_users.router,      prefix="/api/v1/users",      tags=["Users"])
app.include_router(routes_attendance.router, prefix="/api/v1/attendance", tags=["Attendance"])
app.include_router(routes_leave.router,      prefix="/api/v1/leave",      tags=["Leave"])
app.include_router(routes_payroll.router,    prefix="/api/v1/payroll",    tags=["Payroll"])
app.include_router(routes_dashboard.router,  prefix="/api/v1/dashboard",  tags=["Dashboard"])
app.include_router(routes_reports.router,    prefix="/api/v1/reports",    tags=["Reports"])

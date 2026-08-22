from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import get_password_hash
from app.models.user import User

async def init_db(db: AsyncSession) -> None:
    pass

"""
MongoDB Service Layer
Provides async database access via Motor (async PyMongo driver).
"""
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from ..config import get_settings

_client: AsyncIOMotorClient = None  # type: ignore[assignment]


async def get_database() -> AsyncIOMotorDatabase:
    """Return the conversaiq database, creating the client on first call."""
    global _client
    settings = get_settings()
    if _client is None:
        _client = AsyncIOMotorClient(settings.MONGODB_URI)
    return _client[settings.DB_NAME]


async def close_database() -> None:
    """Close the MongoDB client connection."""
    global _client
    if _client is not None:
        _client.close()
        _client = None  # type: ignore[assignment]

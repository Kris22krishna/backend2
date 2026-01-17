from fastapi import APIRouter
from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
def login():
    # TEMP: replace with DB check
    return {
        "access_token": create_access_token(
            user_id="user_123",
            tenant_id="tenant_abc"
        )
    }

from datetime import datetime, timedelta
import jwt
from app.core.config import settings

def create_access_token(user_id: str, tenant_id: str):
    payload = {
        "sub": user_id,
        "tenant_id": tenant_id,
        "exp": datetime.utcnow() + timedelta(minutes=15),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def decode_token(token: str):
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except jwt.PyJWTError:
        return None

from datetime import datetime, timedelta
import jwt
from app.core.config import settings

def create_access_token(user_id: str, tenant_id: str):
    payload = {
        "sub": user_id,
        "tenant_id": tenant_id,
        "exp": datetime.utcnow() + timedelta(minutes=60),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def decode_token(token: str):
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except jwt.PyJWTError:
        return None

from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.modules.auth.models import User, Credential
from uuid import UUID
from typing import Optional

# CRITICAL: This tokenUrl must match the actual login endpoint
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login", auto_error=False)

def get_current_user(
    request: Request,
    token: Optional[str] = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Prioritize Cookie, fall back to Header
    token = request.cookies.get("access_token") or token
    
    if not token:
        raise credentials_exception

    payload = decode_token(token)
    if payload is None:
        raise credentials_exception
    user_id_str: str = payload.get("sub")
    if user_id_str is None:
        raise credentials_exception
    
    # Try V2 (Integer ID)
    if user_id_str.isdigit():
        from app.modules.auth.models import V2User
        user = db.query(V2User).filter(V2User.user_id == int(user_id_str)).first()
        if user:
            # Add compatibility property dynamically or assume caller handles it
            # For now, let's just return the user.
            return user

    # Try V1 (UUID)
    try:
        user_id = UUID(user_id_str)
        user = db.query(User).filter(User.user_id == user_id).first()
        if user:
            return user
    except (ValueError, AttributeError):
        pass
        
    raise credentials_exception

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

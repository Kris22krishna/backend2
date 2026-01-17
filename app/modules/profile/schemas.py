from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class UserCreate(BaseModel):
    user_type: str
    first_name: str
    last_name: Optional[str] = None
    email: EmailStr
    phone_number: Optional[str] = None
    password: str
    
    @validator('user_type')
    def validate_user_type(cls, v):
        allowed_roles = ["student", "teacher", "parent", "math_mentor", "guest", "admin"]
        if v.lower() not in allowed_roles:
            raise ValueError(f"Invalid user_type. Must be one of: {', '.join(allowed_roles)}")
        return v.lower()

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    display_name: Optional[str] = None
    phone_number: Optional[str] = None

class UserDetail(BaseModel):
    user_id: UUID
    tenant_id: Optional[UUID]
    school_id: Optional[UUID]
    user_type: str
    first_name: Optional[str]
    last_name: Optional[str]
    display_name: Optional[str]
    email: Optional[str]
    phone_number: Optional[str]
    status: Optional[str]
    last_login_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        orm_mode = True

class RoleAssignment(BaseModel):
    role_ids: List[UUID]

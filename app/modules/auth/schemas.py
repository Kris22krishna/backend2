from pydantic import ConfigDict, BaseModel, EmailStr, validator
from typing import Optional
from uuid import UUID
from datetime import datetime

class UserRegister(BaseModel):
    user_type: str
    first_name: str
    last_name: Optional[str] = None
    email: EmailStr
    phone_number: Optional[str] = None
    password: str
    grade: Optional[str] = None # Added for student registration
    
    @validator('user_type')
    def validate_user_type(cls, v):
        allowed_roles = ["student", "teacher", "parent", "math_mentor", "guest", "admin"]
        if v.lower() not in allowed_roles:
            raise ValueError(f"Invalid user_type. Must be one of: {', '.join(allowed_roles)}")
        return v.lower()

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    user_id: UUID
    email: Optional[str]
    user_type: str
    first_name: Optional[str]
    last_name: Optional[str]
    status: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class UploaderCreate(BaseModel):
    name: str

class UploaderLogin(BaseModel):
    username: str
    access_code: str

class UploaderResponse(BaseModel):
    username: str
    access_code: str

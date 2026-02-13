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

class GoogleLogin(BaseModel):
    email: EmailStr
    first_name: str
    last_name: Optional[str] = None
    google_id: str
    photo_url: Optional[str] = None


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

class AssessmentUploaderCreate(BaseModel):
    email: EmailStr

class AssessmentUploaderLogin(BaseModel):
    email: EmailStr
    access_code: str

class AssessmentUploaderResponse(BaseModel):
    email: str
    access_code: str


class V2UserRegister(BaseModel):
    name: str 
    role: str
    email: Optional[EmailStr] = None
    password: str
    phone_number: Optional[str] = None 
    class_name: Optional[str] = None
    parent_user_id: Optional[int] = None  # For auto-linking student to parent 

    @validator('role')
    def validate_role(cls, v):
        if v.lower() not in ["student", "parent", "mentor", "guest"]:
            raise ValueError("Role must be 'student', 'parent', 'mentor', or 'guest'")
        return v.lower()

class V2UserLogin(BaseModel):
    identifier: str # Email or Username
    password: str

class V2UserResponse(BaseModel):
    user_id: int
    name: str
    role: str
    email: Optional[str] = None
    token: Optional[str] = None
    access_token: Optional[str] = None
    username: Optional[str] = None
    class_name: Optional[str] = None
    phone_number: Optional[str] = None
    token_type: Optional[str] = None

class EmailCheck(BaseModel):
    email: EmailStr

class PredictUsernameRequest(BaseModel):
    name: str
    role: str

class UserMe(BaseModel):
    user_id: str 
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: str
    username: Optional[str] = None


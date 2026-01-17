from pydantic import ConfigDict, BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class ParentProfile(BaseModel):
    user_id: UUID
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]
    phone_number: Optional[str]
    parent_id: Optional[UUID]
    occupation: Optional[str]
    
    model_config = ConfigDict(from_attributes=True)

class ChildDetail(BaseModel):
    student_id: UUID
    name: str
    grade: Optional[str]
    school_name: Optional[str]
    role_number: Optional[str]

class ReportSummary(BaseModel):
    report_id: UUID
    student_name: str
    report_type: Optional[str]
    status: Optional[str]
    generated_at: Optional[datetime]
    file_url: Optional[str]

class LogoutResponse(BaseModel):
    message: str

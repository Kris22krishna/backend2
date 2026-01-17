from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from uuid import UUID

class StudentProfile(BaseModel):
    user_id: UUID
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]
    student_id: Optional[UUID]
    grade: Optional[str]
    section: Optional[str]
    roll_number: Optional[str]
    tenant_name: Optional[str]
    school_name: Optional[str]
    
    class Config:
        orm_mode = True

class AssessmentStartRequest(BaseModel):
    test_id: Optional[str] = None # Placeholder for when we have real tests
    subject: Optional[str] = None

class AssessmentSessionResponse(BaseModel):
    invigilation_id: UUID
    start_time: Optional[datetime]
    status: str

class ReportResponse(BaseModel):
    report_id: UUID
    report_type: Optional[str]
    file_url: Optional[str]
    generated_at: Optional[datetime]
    status: Optional[str]
    
    class Config:
        orm_mode = True

class LogoutResponse(BaseModel):
    message: str

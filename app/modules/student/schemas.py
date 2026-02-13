from pydantic import ConfigDict, BaseModel
from typing import Optional, List, Union
from datetime import datetime, date
from uuid import UUID

class StudentProfile(BaseModel):
    user_id: Union[int, UUID, str]
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    student_id: Optional[Union[int, UUID, str]] = None
    grade: Optional[str] = None
    section: Optional[str] = None
    roll_number: Optional[str] = None
    tenant_name: Optional[str] = None
    school_name: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

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
    
    model_config = ConfigDict(from_attributes=True)

class LogoutResponse(BaseModel):
    message: str

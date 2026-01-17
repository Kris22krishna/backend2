from pydantic import ConfigDict, BaseModel
from typing import Optional, List, Any, Dict
from datetime import datetime, date
from uuid import UUID

class TeacherProfile(BaseModel):
    user_id: UUID
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]
    phone_number: Optional[str]
    # Teacher specific
    teacher_id: Optional[UUID]
    employee_id: Optional[str]
    qualification: Optional[str]
    department: Optional[str]
    designation: Optional[str]
    subjects: Optional[List[str]] = []
    
    tenant_name: Optional[str]
    school_name: Optional[str]
    
    model_config = ConfigDict(from_attributes=True)

class StudentSummary(BaseModel):
    user_id: UUID
    student_id: Optional[UUID]
    name: str
    email: Optional[str]
    grade: Optional[str]
    section: Optional[str]
    roll_number: Optional[str]

class ReportSummary(BaseModel):
    report_id: UUID
    report_type: Optional[str]
    student_name: Optional[str]
    status: Optional[str]
    generated_at: Optional[datetime]
    file_url: Optional[str]

class FileUploadResponse(BaseModel):
    filename: str
    file_url: str
    message: str

class LogoutResponse(BaseModel):
    message: str

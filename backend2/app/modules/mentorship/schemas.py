from pydantic import ConfigDict, BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class SessionCreate(BaseModel):
    student_user_id: UUID
    mentor_code_used: str

class SessionUpdate(BaseModel):
    session_summary: Optional[str] = None
    student_rating: Optional[int] = None
    student_feedback: Optional[str] = None
    ended_at: Optional[datetime] = None

class SessionResponse(BaseModel):
    session_id: UUID
    mentor_user_id: Optional[UUID]
    student_user_id: Optional[UUID]
    started_at: Optional[datetime]
    ended_at: Optional[datetime]
    status: str = "active"

    model_config = ConfigDict(from_attributes=True)

class AssignmentCreate(BaseModel):
    session_id: UUID
    content_type: str
    content_id: UUID
    notes: Optional[str] = None

class AssignmentResponse(BaseModel):
    assignment_id: UUID
    content_type: str
    assigned_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)

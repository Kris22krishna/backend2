from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import datetime
from uuid import UUID

class AssessmentStudentSchema(BaseModel):
    id: UUID
    serial_number: str
    name: str
    grade: str
    school_name: str
    phone_number: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

from typing import Optional, List, Any

class AssessmentAccessLogin(BaseModel):
    serial_number: str

class AssessmentQuestionResponse(BaseModel):
    id: UUID
    question_html: str
    question_type: str
    options: Optional[Any] = None # JSON or List or Dict
    topic: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class AssessmentSessionResponse(BaseModel):
    session_id: UUID
    questions: List[AssessmentQuestionResponse]
    duration_minutes: int = 30

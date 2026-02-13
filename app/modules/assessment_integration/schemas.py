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

class AssessmentReport(BaseModel):
    id: UUID
    student_id: UUID
    student_name: str
    grade: str
    completed_at: datetime
    total_questions: int
    correct_answers: int
    accuracy: float
    
    model_config = ConfigDict(from_attributes=True)

class AssessmentSubmission(BaseModel):
    session_id: UUID
    answers: dict[str, str] # question_id (UUID string) -> answer string (or JSON string)

class AssessmentQuestionDetail(BaseModel):
    id: UUID
    question_html: str
    student_answer: Optional[str] = None
    correct_answer: str
    is_correct: bool
    status: str # 'correct', 'wrong', 'skipped'
    
    model_config = ConfigDict(from_attributes=True)

class AssessmentSessionDetail(BaseModel):
    session_id: UUID
    student_name: str
    grade: str
    started_at: datetime
    completed_at: Optional[datetime]
    duration_minutes: Optional[float]
    score: int
    total_questions: int
    accuracy: float
    questions: List[AssessmentQuestionDetail]
    
    model_config = ConfigDict(from_attributes=True)

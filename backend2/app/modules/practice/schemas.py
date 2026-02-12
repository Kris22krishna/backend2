from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime

class QuestionAttemptBase(BaseModel):
    user_id: int
    session_id: Optional[int] = None
    skill_id: int
    template_id: Optional[int] = None
    difficulty_level: Literal['Easy', 'Medium', 'Hard']
    
    question_text: str
    correct_answer: str
    student_answer: Optional[str] = None
    is_correct: bool
    solution_text: Optional[str] = None
    
    time_spent_seconds: int

class QuestionAttemptCreate(QuestionAttemptBase):
    pass

class QuestionAttemptResponse(QuestionAttemptBase):
    attempt_id: int
    attempted_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class ProgressBase(BaseModel):
    user_id: int
    skill_id: int
    total_questions_attempted: int
    total_correct: int
    total_time_spent_seconds: int
    current_difficulty: str
    correct_streak: int
    wrong_streak: int
    updated_at: datetime

class ProgressResponse(ProgressBase):
    skill_name: Optional[str] = None
    class Config:
        from_attributes = True

class SessionCreate(BaseModel):
    user_id: int
    skill_id: int

class SessionResponse(SessionCreate):
    session_id: int
    skill_name: Optional[str] = None
    started_at: datetime
    ended_at: Optional[datetime] = None
    total_time_seconds: int
    total_questions: int
    total_correct: int
    
    class Config:
        from_attributes = True

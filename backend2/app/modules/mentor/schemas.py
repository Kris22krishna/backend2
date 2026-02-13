from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- Student Summary ---
class MentorStudentSummary(BaseModel):
    user_id: int
    student_id: int
    name: str
    email: Optional[str]
    grade: Optional[str]
    section: Optional[str]
    roll_number: Optional[str]

    class Config:
        from_attributes = True

# --- Mentor Profile ---
class MentorProfile(BaseModel):
    user_id: int
    name: str
    email: Optional[str]
    phone_number: Optional[str]
    role: str

    class Config:
        from_attributes = True

# --- Response Models ---
class MentorStudentsResponse(BaseModel):
    students: List[MentorStudentSummary]

class DailyStat(BaseModel):
    date: str
    total_time_seconds: int
    avg_time_seconds: int

class MentorStatsResponse(BaseModel):
    total_students: int
    total_time_seconds: int
    avg_time_seconds: int
    today_questions_solved: int
    daily_stats: List[DailyStat]

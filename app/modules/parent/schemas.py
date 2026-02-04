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

class LinkChildRequest(BaseModel):
    student_username: str

class LinkChildResponse(BaseModel):
    message: str
    student_name: str
    student_id: UUID

class SkillStat(BaseModel):
    name: str
    score: int
    trend: Optional[str] = None

class ChildStatsResponse(BaseModel):
    accuracy: int
    streak: int
    weekly_activity: List[dict]
    strengths: List[SkillStat]
    mastered_skills: List[SkillStat]
    growing_skills: List[SkillStat]

# --- New Schemas for Dynamic Sub-pages ---

class WeekStat(BaseModel):
    week: str
    accuracy: int

class Milestone(BaseModel):
    emoji: str
    title: str
    date: str
    color: str

class ChildProgressResponse(BaseModel):
    improvement_pct: int
    streak: int
    current_accuracy: int
    total_points: int
    weekly_progress: List[WeekStat]
    milestones: List[Milestone]

class QuizResult(BaseModel):
    id: str
    name: str
    score: int
    date: str
    badge: Optional[str] = None
    color: Optional[str] = None

class DailyActivity(BaseModel):
    day: str
    active: bool
    count: int

class ChildQuizzesResponse(BaseModel):
    total_quizzes: int
    avg_score: int
    streak: int
    avg_time_mins: int
    weekly_activity: List[DailyActivity]
    recent_quizzes: List[QuizResult]

class SkillGroupSummary(BaseModel):
    mastered_count: int
    improving_count: int
    need_practice_count: int

class ChildSkillsResponse(BaseModel):
    summary: SkillGroupSummary
    mastered_skills: List[SkillStat]
    growing_skills: List[SkillStat]
    need_practice_skills: List[SkillStat]

class ChildReportSummaryResponse(BaseModel):
    period: str
    total_quizzes: int
    avg_accuracy: int
    improvement: int
    streak: int
    skills_mastered: int
    top_performances: List[SkillStat]
    areas_to_improve: List[SkillStat]

from pydantic import ConfigDict, BaseModel
from typing import Optional, Any, Dict, List
from datetime import datetime
from uuid import UUID

class AuditLogCreate(BaseModel):
    action: str
    entity_type: str
    entity_id: Optional[UUID]
    old_value: Optional[Dict[str, Any]]
    new_value: Optional[Dict[str, Any]]

class AuditLogResponse(BaseModel):
    audit_id: UUID
    action: str
    performed_at: datetime

    model_config = ConfigDict(from_attributes=True)

class DashboardStatsResponse(BaseModel):
    totalStudents: int
    totalPassed: int
    totalPerfectScores: int
    totalReports: int

class ChartDataPoint(BaseModel):
    label: str
    value: int

class ChartDataResponse(BaseModel):
    marksByGrade: list[ChartDataPoint]
    studentGrowth: list[ChartDataPoint]

class StudentListResponse(BaseModel):
    id: UUID
    name: str
    grade: str
    email: str
    status: str
    joinedDate: datetime

# New schemas for Admin Dashboard Overview
class PlatformHealthStat(BaseModel):
    title: str
    value: int
    delta: str
    deltaType: str  # 'positive', 'negative', 'neutral'

class AlertItem(BaseModel):
    id: int
    message: str
    severity: str  # 'error', 'warning', 'info'

class ActivityMetric(BaseModel):
    metric: str
    count: int
    change: str

class SkillTroubleItem(BaseModel):
    skill: str
    avgAccuracy: str
    attempts: int

class UserActivityItem(BaseModel):
    role: str
    activeToday: int
    inactive7d: int
    inactive30d: int

class ActivityFeedItem(BaseModel):
    id: int
    message: str
    time: str
    iconType: str

class QuestionHealthItem(BaseModel):
    question: str
    accuracy: Optional[str] = None
    attempts: Optional[int] = None
    uses: Optional[int] = None
    addedBy: Optional[str] = None
    date: Optional[str] = None

class AdminDashboardOverview(BaseModel):
    platformHealth: List[PlatformHealthStat]
    todaysActivity: List[ActivityMetric]
    alerts: List[AlertItem]
    skillTroubles: List[SkillTroubleItem]
    userActivity: List[UserActivityItem]
    activityFeed: List[ActivityFeedItem]
    lowAccuracyQuestions: List[QuestionHealthItem]
    mostUsedQuestions: List[QuestionHealthItem]
    recentlyAddedQuestions: List[QuestionHealthItem]

# User list schemas for admin pages
class UserListResponse(BaseModel):
    id: str
    name: str
    email: str
    status: str
    joinedDate: Optional[datetime] = None
    lastActive: Optional[str] = None

class TeacherListResponse(BaseModel):
    id: str
    name: str
    email: str
    status: str
    joinedDate: Optional[datetime] = None
    lastActive: Optional[str] = None
    studentCount: int = 0
    classesCount: int = 0

class ParentListResponse(BaseModel):
    id: str
    name: str
    email: str
    status: str
    joinedDate: Optional[datetime] = None
    lastActive: Optional[str] = None
    childrenCount: int = 0


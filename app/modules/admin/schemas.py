from pydantic import ConfigDict, BaseModel
from typing import Optional, Any, Dict
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


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.core.security import get_current_user
from app.modules.auth.models import User
from app.modules.admin.models import AuditLog
from app.modules.admin.schemas import AuditLogResponse

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/audit-logs", response_model=List[AuditLogResponse])
def get_audit_logs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # In a real app, restrict this to admin users
    logs = db.query(AuditLog).filter(AuditLog.tenant_id == current_user.tenant_id).limit(100).all()
    return logs

from app.modules.admin.schemas import (
    AdminDashboardOverview, PlatformHealthStat, ActivityMetric, AlertItem, 
    SkillTroubleItem, UserActivityItem, ActivityFeedItem, QuestionHealthItem
)
from app.modules.auth.models import User
from app.modules.assessment_integration.models import AssessmentStudent

@router.get("/overview", response_model=AdminDashboardOverview)
def get_admin_dashboard_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Platform Health (Real Counts)
    total_students = db.query(AssessmentStudent).count()
    total_users = db.query(User).count()
    # Mocking others for now to ensure stability
    total_teachers = db.query(User).filter(User.user_type == 'teacher').count()
    total_parents = db.query(User).filter(User.user_type == 'parent').count()
    total_uploaders = db.query(User).filter(User.user_type.in_(['uploader', 'assessment_uploader'])).count()

    platform_health = [
        PlatformHealthStat(title="Total Students", value=total_students, delta="+12%", deltaType="positive"),
        PlatformHealthStat(title="Total Teachers", value=total_teachers, delta="+5%", deltaType="positive"),
        PlatformHealthStat(title="Total Parents", value=total_parents, delta="+8%", deltaType="positive"),
        PlatformHealthStat(title="Total Uploaders", value=total_uploaders, delta="+2%", deltaType="neutral"),
        PlatformHealthStat(title="Guest Users Today", value=15, delta="+10%", deltaType="positive"),
        PlatformHealthStat(title="Questions in Bank", value=1250, delta="+50", deltaType="positive"),
    ]

    # 2. Activity (Mocked)
    todays_activity = [
        ActivityMetric(metric="New Signups", count=12, change="+20%"),
        ActivityMetric(metric="Quizzes Taken", count=45, change="+15%"),
        ActivityMetric(metric="Active Users", count=120, change="+5%"),
    ]

    # 3. Alerts (Mocked)
    alerts = [
        AlertItem(id=1, message="High server load detected", severity="warning"),
        AlertItem(id=2, message="5 failed login attempts", severity="error"),
    ]

    # 4. Skill Troubles (Mocked)
    skill_troubles = [
        SkillTroubleItem(skill="Algebra II", avgAccuracy="45%", attempts=120),
        SkillTroubleItem(skill="Geometry Proofs", avgAccuracy="38%", attempts=90),
    ]

    # 5. User Activity (Mocked)
    user_activity = [
        UserActivityItem(role="Teacher", activeToday=45, inactive7d=5, inactive30d=2),
        UserActivityItem(role="Student", activeToday=350, inactive7d=20, inactive30d=10),
    ]

    # 6. Feed (Mocked)
    activity_feed = [
        ActivityFeedItem(id=1, message="New student John Doe registered", time="2 mins ago", iconType="user"),
        ActivityFeedItem(id=2, message="Quiz 'Math 101' created by Sarah", time="15 mins ago", iconType="quiz"),
    ]

    # 7. Lists (Mocked)
    low_accuracy_qs = [
        QuestionHealthItem(question="Solve for x: 2x + 5 = 15", accuracy="25%", attempts=50),
        QuestionHealthItem(question="What is the capital of France?", accuracy="99%", attempts=200),
    ]

    return AdminDashboardOverview(
        platformHealth=platform_health,
        todaysActivity=todays_activity,
        alerts=alerts,
        skillTroubles=skill_troubles,
        userActivity=user_activity,
        activityFeed=activity_feed,
        lowAccuracyQuestions=low_accuracy_qs,
        mostUsedQuestions=[],
        recentlyAddedQuestions=[]
    )

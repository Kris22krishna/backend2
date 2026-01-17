from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime

from app.db.session import get_db
from app.core.security import get_current_user
from app.modules.auth.models import User
from app.modules.student.models import Student, Report
from app.modules.admin.schemas import DashboardStatsResponse, ChartDataResponse, StudentListResponse, ChartDataPoint

router = APIRouter(prefix="/admin", tags=["admin_dashboard"])

@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_user) # Uncomment to enforce auth
):
    total_students = db.query(Student).count()
    total_reports = db.query(Report).count()
    
    # Calculate average score from report_data if available, else 0
    # Assuming report_data has a 'score' or 'marks' field. If not, we default to 0 to be safe.
    # For now, we'll keep it simple: "Average Score" -> just a placeholder or 0 if no reports.
    # "100% Club" -> Reports with score 100% (hypothetically).
    
    # Safe implementation:
    total_passed = 0 # Placeholder for Average Score
    total_perfect = 0 # Placeholder for 100% Club

    return DashboardStatsResponse(
        totalStudents=total_students,
        totalPassed=total_passed, 
        totalPerfectScores=total_perfect,
        totalReports=total_reports
    )

@router.get("/charts", response_model=ChartDataResponse)
def get_dashboard_charts(
    db: Session = Depends(get_db)
):
    # Dummy data for now to satisfy frontend
    return ChartDataResponse(
        marksByGrade=[
            ChartDataPoint(label="Grade 5", value=85),
            ChartDataPoint(label="Grade 6", value=78),
            ChartDataPoint(label="Grade 7", value=92),
            ChartDataPoint(label="Grade 8", value=88)
        ],
        studentGrowth=[
            ChartDataPoint(label="Jan", value=10),
            ChartDataPoint(label="Feb", value=15),
            ChartDataPoint(label="Mar", value=25),
            ChartDataPoint(label="Apr", value=30)
        ]
    )

@router.get("/students", response_model=List[StudentListResponse])
def get_dashboard_students(
    limit: int = 100,
    db: Session = Depends(get_db)
):
    students = db.query(Student).join(User, Student.user_id == User.user_id).limit(limit).all()
    
    response = []
    for student in students:
        response.append(StudentListResponse(
            id=student.user_id, # Using user_id as main ID for frontend actions
            name=(student.user.display_name if student.user.display_name else f"{student.user.first_name or ''} {student.user.last_name or ''}".strip()) if student.user else "Unknown",
            grade=student.grade if student.grade else "N/A",
            email=student.user.email if student.user else "N/A",
            status=student.enrollment_status if student.enrollment_status else "active",
            joinedDate=student.created_at
        ))
    return response

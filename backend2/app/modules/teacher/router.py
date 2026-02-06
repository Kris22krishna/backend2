from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from typing import List
import uuid
import shutil
import os
import random

from app.db.session import get_db
from app.core.security import get_current_user
from app.modules.auth.models import User, Tenant, School
from app.modules.student.models import Student, Report
from app.modules.teacher.models import Teacher
from app.modules.teacher.schemas import (
    TeacherProfile, 
    StudentSummary, 
    ReportSummary, 
    FileUploadResponse, 
    LogoutResponse,
    DashboardStats,
    StudentPerformanceSummary,
    AtRiskStudent,
    GradeStats
)

router = APIRouter(prefix="/teacher", tags=["teacher"])

@router.get("/dashboard-stats", response_model=DashboardStats)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get dashboard statistics for teacher including student counts, top performers, and at-risk students.
    """
    # Get all students in the school
    students_data = db.query(Student, User).join(User, Student.user_id == User.user_id).filter(
        Student.school_id == current_user.school_id
    ).all()
    
    total_students = len(students_data)
    
    # Group by grade
    grade_counts = {}
    student_list = []
    
    for stud, usr in students_data:
        grade = stud.grade or "Unknown"
        grade_counts[grade] = grade_counts.get(grade, 0) + 1
        
        # Generate mock scores for now (in production, fetch from reports/sessions)
        avg_score = random.randint(50, 98)
        attendance = random.randint(60, 100)
        
        student_list.append({
            "user_id": usr.user_id,
            "student_id": stud.student_id,
            "name": f"{usr.first_name} {usr.last_name or ''}".strip(),
            "email": usr.email,
            "grade": stud.grade,
            "section": stud.section,
            "avg_score": avg_score,
            "attendance_rate": attendance,
            "status": "At Risk" if avg_score < 60 or attendance < 70 else "Active",
            "trend": "down" if avg_score < 60 else "up"
        })
    
    # Sort for top performers and at-risk
    sorted_by_score = sorted(student_list, key=lambda x: x["avg_score"], reverse=True)
    top_performers = sorted_by_score[:5]
    at_risk = [s for s in student_list if s["status"] == "At Risk"][:5]
    
    # Calculate class average
    class_avg = sum(s["avg_score"] for s in student_list) / total_students if total_students > 0 else 0
    
    # Build grade stats
    grade_stats = [{"grade": g, "count": c} for g, c in sorted(grade_counts.items())]
    
    # Format at-risk for response
    at_risk_formatted = [
        {
            "user_id": s["user_id"],
            "name": s["name"],
            "grade": s["grade"],
            "score": s["avg_score"],
            "attendance": f"{s['attendance_rate']}%",
            "issue": "Low Scores" if s["avg_score"] < 60 else "Low Attendance"
        }
        for s in at_risk
    ]
    
    return {
        "total_students": total_students,
        "active_courses": 5,
        "pending_assignments": random.randint(10, 30),
        "avg_engagement": f"{random.randint(1, 3)}h {random.randint(0, 59)}m",
        "students_by_grade": grade_stats,
        "top_performers": top_performers,
        "at_risk_students": at_risk_formatted,
        "class_average": round(class_avg, 1)
    }

@router.get("/profile", response_model=TeacherProfile)
def get_teacher_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current teacher profile.
    """
    teacher_details = db.query(Teacher).filter(Teacher.user_id == current_user.user_id).first()
    
    tenant = db.query(Tenant).filter(Tenant.tenant_id == current_user.tenant_id).first()
    school = db.query(School).filter(School.school_id == current_user.school_id).first()
    
    subjects_list = []
    if teacher_details and teacher_details.subjects:
        # Assuming subjects is stored as json list or similar. 
        # If it's pure JSONB, it returns as python list/dict
        subjects_list = teacher_details.subjects if isinstance(teacher_details.subjects, list) else []

    return {
        "user_id": current_user.user_id,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email": current_user.email,
        "phone_number": current_user.phone_number,
        "teacher_id": teacher_details.teacher_id if teacher_details else None,
        "employee_id": teacher_details.employee_id if teacher_details else None,
        "qualification": teacher_details.qualification if teacher_details else None,
        "department": teacher_details.department if teacher_details else None,
        "designation": teacher_details.designation if teacher_details else None,
        "subjects": subjects_list,
        "tenant_name": tenant.tenant_name if tenant else None,
        "school_name": school.school_name if school else None
    }

@router.post("/upload", response_model=FileUploadResponse)
def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Simulate file upload. Saves to a local 'temp' directory.
    """
    upload_dir = "temp_uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_location = f"{upload_dir}/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
        
    # Return a fake URL
    return {
        "filename": file.filename,
        "file_url": f"/static/{file.filename}", 
        "message": "File uploaded successfully"
    }

@router.get("/students", response_model=List[StudentSummary])
def get_students(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List students in the teacher's school.
    """
    # Find all students in the same school
    students_data = db.query(Student, User).join(User, Student.user_id == User.user_id).filter(
        Student.school_id == current_user.school_id
    ).all()
    
    result = []
    for stud, usr in students_data:
        result.append({
            "user_id": usr.user_id,
            "student_id": stud.student_id,
            "name": f"{usr.first_name} {usr.last_name or ''}".strip(),
            "email": usr.email,
            "grade": stud.grade,
            "section": stud.section,
            "roll_number": stud.roll_number
        })
    return result

@router.get("/reports", response_model=List[ReportSummary])
def get_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List reports for students in the school.
    """
    # Fetch reports for the school
    reports = db.query(Report, User).join(User, Report.target_entity_id == User.user_id).filter(
        Report.school_id == current_user.school_id
    ).all()
    
    result = []
    for report, user_t in reports:
        result.append({
            "report_id": report.report_id,
            "report_type": report.report_type,
            "student_name": f"{user_t.first_name} {user_t.last_name or ''}".strip(),
            "status": report.status,
            "generated_at": report.generated_at,
            "file_url": report.file_url
        })
    return result

@router.post("/logout", response_model=LogoutResponse)
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Successfully logged out"}

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from app.db.session import get_db
from app.core.security import get_current_user
from app.modules.auth.models import User, School
from app.modules.student.models import Student, Report
from app.modules.parent.models import Parent, ParentStudent
from app.modules.parent.schemas import (
    ParentProfile, 
    ChildDetail, 
    ReportSummary, 
    LogoutResponse
)

router = APIRouter(prefix="/parent", tags=["parent"])

@router.get("/profile", response_model=ParentProfile)
def get_parent_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current parent profile.
    """
    parent_details = db.query(Parent).filter(Parent.user_id == current_user.user_id).first()
    
    return {
        "user_id": current_user.user_id,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email": current_user.email,
        "phone_number": current_user.phone_number,
        "parent_id": parent_details.parent_id if parent_details else None,
        "occupation": parent_details.occupation if parent_details else None,
    }

@router.get("/children", response_model=List[ChildDetail])
def get_children(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List linked children.
    """
    parent_details = db.query(Parent).filter(Parent.user_id == current_user.user_id).first()
    if not parent_details:
        return []
        
    links = db.query(ParentStudent).filter(ParentStudent.parent_id == parent_details.parent_id).all()
    
    result = []
    for link in links:
        student = db.query(Student).filter(Student.student_id == link.student_id).first()
        if student:
            user = db.query(User).filter(User.user_id == student.user_id).first()
            school = db.query(School).filter(School.school_id == student.school_id).first()
            if user:
                result.append({
                    "student_id": student.student_id,
                    "name": f"{user.first_name} {user.last_name or ''}".strip(),
                    "grade": student.grade,
                    "school_name": school.school_name if school else None,
                    "role_number": student.roll_number
                })
    return result


@router.get("/reports", response_model=List[ReportSummary])
def get_child_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List reports for all linked children.
    """
    parent_details = db.query(Parent).filter(Parent.user_id == current_user.user_id).first()
    if not parent_details:
        return []

    # Get all student IDs linked to parent
    links = db.query(ParentStudent).filter(ParentStudent.parent_id == parent_details.parent_id).all()
    student_ids = [link.student_id for link in links] # These are Student table IDs
    
    # We need to map Student ID -> User ID because Reports linked to User ID typically
    students = db.query(Student).filter(Student.student_id.in_(student_ids)).all()
    student_user_ids = [s.user_id for s in students]
    
    reports = db.query(Report, User).join(User, Report.target_entity_id == User.user_id).filter(
        Report.target_entity_id.in_(student_user_ids)
    ).order_by(desc(Report.generated_at)).all()
    
    result = []
    for report, user_t in reports:
        result.append({
            "report_id": report.report_id,
            "student_name": f"{user_t.first_name} {user_t.last_name or ''}".strip(),
            "report_type": report.report_type,
            "status": report.status,
            "generated_at": report.generated_at,
            "file_url": report.file_url
        })
    return result

@router.post("/logout", response_model=LogoutResponse)
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Successfully logged out"}

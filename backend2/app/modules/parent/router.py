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
    LogoutResponse,
    LinkChildRequest,
    LinkChildResponse,
    ChildStatsResponse,
    SkillStat,
    ChildProgressResponse,
    ChildQuizzesResponse,
    ChildSkillsResponse,
    ChildReportSummaryResponse,
    WeekStat,
    Milestone,
    QuizResult,
    DailyActivity,
    SkillGroupSummary
)
import random
from datetime import datetime, timedelta

# ... imports ...


from fastapi import HTTPException, status
import uuid

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
    
    reports = db.query(Report, User).join(User, Report.user_id == User.user_id).filter(
        Report.user_id.in_(student_user_ids)
    ).order_by(desc(Report.created_at)).all()
    
    result = []
    for report, user_t in reports:
        result.append({
            "report_id": report.report_id,
            "student_name": f"{user_t.first_name} {user_t.last_name or ''}".strip(),
            "report_type": report.report_type,
            "status": report.status,
            "status": report.status,
            "generated_at": report.created_at,
            "file_url": report.report_data.get("file_url") if report.report_data else None
        })
    return result

@router.post("/logout", response_model=LogoutResponse)
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Successfully logged out"}

@router.post("/link-child", response_model=LinkChildResponse)
def link_child(
    request: LinkChildRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Link a student to the current parent account using student's username.
    """
    # 1. Get Parent Profile
    parent = db.query(Parent).filter(Parent.user_id == current_user.user_id).first()
    if not parent:
        # Create parent profile if not exists (lazy creation)
        parent = Parent(
            user_id=current_user.user_id,
            parent_id=uuid.uuid4(),
            tenant_id=current_user.tenant_id, # Assuming tenant context
            school_id=current_user.school_id, # Include school_id
            occupation="Parent"
        )
        db.add(parent)
        db.commit()
        db.refresh(parent)

    # 2. Find Student User by Username
    # 2. Find Student User by Identifier (Credential)
    # Check Credentials table since User doesn't have username field
    from app.modules.auth.models import Credential
    
    credential = db.query(Credential).filter(Credential.identifier == request.student_username).first()
    
    if not credential:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found with this username/email"
        )
        
    student_user = db.query(User).filter(User.user_id == credential.user_id).first()
    if not student_user:
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )
    
    # 3. Get Student Profile
    student = db.query(Student).filter(Student.user_id == student_user.user_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not registered as a student"
        )

    # 4. Check if already linked
    existing_link = db.query(ParentStudent).filter(
        ParentStudent.parent_id == parent.parent_id,
        ParentStudent.student_id == student.student_id
    ).first()

    if existing_link:
        return {
            "message": "Student already linked",
            "student_name": f"{student_user.first_name} {student_user.last_name}",
            "student_id": student.student_id
        }

    # 5. Create Link
    new_link = ParentStudent(
        parent_student_id=uuid.uuid4(),
        parent_id=parent.parent_id,
        student_id=student.student_id,
        relationship_type="Parent",
        can_view_reports=True,
        can_receive_notifications=True
    )
    db.add(new_link)
    db.commit()

    return {
        "message": "Successfully linked student",
        "student_name": f"{student_user.first_name} {student_user.last_name}",
        "student_id": student.student_id
    }



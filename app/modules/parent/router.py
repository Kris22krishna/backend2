from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from app.db.session import get_db
from app.core.security import get_current_user
from app.modules.student.models import Student, Report
from app.modules.auth.models import (
    User, School, 
    V2User, V2Parent, V2Student, V2StudentParent, V2AuthCredential
)
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
    Get current parent profile (Support for V2).
    """
    # Check if V2 User (integer ID)
    if isinstance(current_user.user_id, int):
        v2_parent = db.query(V2Parent).filter(V2Parent.user_id == current_user.user_id).first()
        v2_creds = db.query(V2AuthCredential).filter(V2AuthCredential.user_id == current_user.user_id).first()
        
        # Split name
        name_parts = current_user.name.split(' ', 1) if hasattr(current_user, 'name') else ["Parent", ""]
        first = name_parts[0]
        last = name_parts[1] if len(name_parts) > 1 else ""

        return {
            "user_id": current_user.user_id,
            "first_name": first,
            "last_name": last,
            "email": v2_creds.email_id if v2_creds else None,
            "phone_number": v2_parent.phone_number if v2_parent else None,
            "parent_id": current_user.user_id,
            "occupation": "Parent"
        }

    # Fallback V1
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
    List linked children (V2).
    """
    from app.modules.auth.models import V2Parent, V2StudentParent, V2Student, V2User
    
    # Check if V2 parent exists
    v2_parent = db.query(V2Parent).filter(V2Parent.user_id == current_user.user_id).first()
    if not v2_parent:
        return []
        
    # Get all linked students
    links = db.query(V2StudentParent).filter(V2StudentParent.parent_id == v2_parent.user_id).all()
    
    result = []
    for link in links:
        v2_student = db.query(V2Student).filter(V2Student.user_id == link.student_id).first()
        if v2_student:
            v2_user = db.query(V2User).filter(V2User.user_id == v2_student.user_id).first()
            if v2_user:
                result.append({
                    "student_id": v2_student.user_id,
                    "name": v2_user.name,
                    "grade": v2_student.class_name,  # 'class' field in v2_students
                    "school_name": None,  # V2 doesn't have school reference yet
                    "role_number": None  # V2 doesn't have roll_number
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
    Link a student to the current parent account using student's username (V2).
    """
    try:
        from app.modules.auth.models import V2AuthCredential, V2User, V2Student, V2Parent, V2StudentParent
        
        # 1. Get or Create V2 Parent Profile
        v2_parent = db.query(V2Parent).filter(V2Parent.user_id == current_user.user_id).first()
        if not v2_parent:
            # Check if v2_user exists
            v2_user = db.query(V2User).filter(V2User.user_id == current_user.user_id).first()
            if not v2_user:
                # Create V2 user entry for parent
                v2_user = V2User(
                    user_id=current_user.user_id,
                    name=f"{current_user.first_name} {current_user.last_name}",
                    role='parent'
                )
                db.add(v2_user)
                db.flush()
            
            # Create V2 parent profile
            v2_parent = V2Parent(
                user_id=current_user.user_id,
                phone_number=getattr(current_user, 'phone', 'N/A')
            )
            db.add(v2_parent)
            db.commit()
            db.refresh(v2_parent)

        # 2. Find Student by Username using V2 Auth Credentials
        v2_credential = db.query(V2AuthCredential).filter(
            V2AuthCredential.username == request.student_username
        ).first()
        
        if not v2_credential:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found with this username"
            )
        
        # 3. Get V2 Student Profile
        v2_student = db.query(V2Student).filter(V2Student.user_id == v2_credential.user_id).first()
        if not v2_student:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is not registered as a student"
            )
        
        # Get student name from V2User
        v2_student_user = db.query(V2User).filter(V2User.user_id == v2_student.user_id).first()
        student_name = v2_student_user.name if v2_student_user else "Student"

        # 4. Check if already linked
        existing_link = db.query(V2StudentParent).filter(
            V2StudentParent.parent_id == v2_parent.user_id,
            V2StudentParent.student_id == v2_student.user_id
        ).first()

        if existing_link:
            return {
                "message": "Student already linked",
                "student_name": student_name,
                "student_id": v2_student.user_id
            }

        # 5. Create V2 Link
        new_link = V2StudentParent(
            parent_id=v2_parent.user_id,
            student_id=v2_student.user_id
        )
        db.add(new_link)
        db.commit()

        return {
            "message": "Successfully linked student",
            "student_name": student_name,
            "student_id": v2_student.user_id
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        import traceback
        error_msg = traceback.format_exc()
        print(f"Link Child Error:\n{error_msg}")
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=500, content={"detail": str(e), "traceback": error_msg})

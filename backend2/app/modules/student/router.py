from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime, timedelta
from typing import List, Optional
import uuid

from app.db.session import get_db
from app.core.security import get_current_user
from app.modules.auth.models import User, Tenant, School
from app.modules.student.models import Student, Report, TestInvigilationSession
from app.modules.student.schemas import (
    StudentProfile, 
    AssessmentStartRequest, 
    AssessmentSessionResponse, 
    ReportResponse, 
    LogoutResponse
)

router = APIRouter(prefix="/student", tags=["student"])

@router.get("/profile", response_model=StudentProfile)
def get_student_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the profile of the currently logged-in student.
    """
    # Check if this is a V2 user (by checking for 'role' attribute or type)
    if hasattr(current_user, 'role'): # V2User has 'role', V1 has 'user_type' (but schema UserRegister has user_type response UserResponse has user_type)
        # Actually V1 User model also has user_type. V2User has role.
        # But 'role' is safer check for V2User specific attribute or just type check?
        # V2User is not imported here.
        # Let's import inside or rely on hasattr.
        from app.modules.auth.models import V2Student, V2AuthCredential
        
        # Get Student Details
        student_details = db.query(V2Student).filter(V2Student.user_id == current_user.user_id).first()
        
        # Get Email from Auth Credential
        cred = db.query(V2AuthCredential).filter(V2AuthCredential.user_id == current_user.user_id).first()
        email = cred.email_id if cred else None
        
        # Split name for first/last
        name_parts = current_user.name.split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""
        
        return {
            "user_id": current_user.user_id,
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "student_id": current_user.user_id, # Use user_id as student_id for V2
            "grade": student_details.class_name if student_details else None,
            "section": None, # Not in V2 Schema
            "roll_number": None, # Not in V2 Schema
            "tenant_name": "Default",
            "school_name": "Default"
        }

    # Fallback to V1 logic
    student_details = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    
    # Fetch tenant and school names
    tenant = db.query(Tenant).filter(Tenant.tenant_id == current_user.tenant_id).first()
    school = db.query(School).filter(School.school_id == current_user.school_id).first()

    return {
        "user_id": current_user.user_id,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email": current_user.email,
        "student_id": student_details.student_id if student_details else None,
        "grade": student_details.grade if student_details else None,
        "section": student_details.section if student_details else None,
        "roll_number": student_details.roll_number if student_details else None,
        "tenant_name": tenant.tenant_name if tenant else None,
        "school_name": school.school_name if school else None
    }


@router.post("/assessment/start", response_model=AssessmentSessionResponse)
def start_assessment(
    request: AssessmentStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Start a new assessment session.
    """
    # Create an invigilation session record
    new_session = TestInvigilationSession(
        tenant_id=current_user.tenant_id,
        school_id=current_user.school_id,
        companion_user_id=current_user.user_id, # Using matching user field for now
        start_time=datetime.utcnow(),
        # test_session_id could be linked to request.test_id
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    
    return {
        "invigilation_id": new_session.invigilation_id,
        "start_time": new_session.start_time,
        "status": "started"
    }

@router.get("/reports", response_model=List[ReportResponse])
def get_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get list of reports for the current student.
    """
    reports = db.query(Report).filter(
        Report.user_id == current_user.user_id
    ).order_by(desc(Report.created_at)).all()
    
    return reports

@router.post("/logout", response_model=LogoutResponse)
def logout(current_user: User = Depends(get_current_user)):
    """
    Logout API. Client should discard the token.
    """
    return {"message": "Successfully logged out"}


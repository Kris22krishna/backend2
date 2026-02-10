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
    # Verify user is a student? Optional, but good practice.
    if current_user.user_type != 'student':
        # Logic: A user might have multiple roles, but if they logged in as student or 
        # we want to strictly enforce role check:
        pass # Allow for now or enforce logic strictly. 

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


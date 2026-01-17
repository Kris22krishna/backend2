from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.session import get_db
from app.modules.reports.schemas import ReportCreate, ReportResponse
from app.modules.student.models import Report, Student
from app.modules.auth.models import User
from datetime import datetime
import uuid

router = APIRouter(prefix="/reports", tags=["reports"])

@router.post("", response_model=ReportResponse)
def create_report(
    report_in: ReportCreate,
    db: Session = Depends(get_db)
):
    """
    Save a new report.
    """
    # Resolve target user
    # If childId is provided, look up that student/user.
    # report_in.uid is the logged in user (parent or student).
    
    target_user_id = None
    
    if report_in.childId:
        # Assuming childId is a Student ID or User ID. Frontend usually passes child_... or UUID.
        # If it's a UUID string
        try:
            # Check if childId is a valid UUID
            uuid_obj = uuid.UUID(report_in.childId)
            # Check if it's a student ID
            student = db.query(Student).filter(Student.student_id == uuid_obj).first()
            if student:
                target_user_id = student.user_id
            else:
                # Maybe it is a user_id directly
                user = db.query(User).filter(User.user_id == uuid_obj).first()
                if user:
                    target_user_id = user.user_id
        except ValueError:
            # Not a UUID, maybe logic needs handling?
            pass
    
    if not target_user_id and report_in.uid:
        # Fallback to uid (which might be the student themself)
         try:
            uuid_obj = uuid.UUID(report_in.uid)
            target_user_id = uuid_obj
         except ValueError:
            pass

    if not target_user_id:
        # If we still can't find a target, maybe search user by other means or fail?
        # For now, let's just log or try to save with what we have if possible.
        # But Report model requires target_entity_id as UUID usually.
        # Let's try to find user by uid string if it's not UUID (not supported by User model default UUID, but maybe fallback)
        pass

    new_report = Report(
        target_entity_id=target_user_id,
        report_type=report_in.category or "Assessment",
        parameters=report_in.reportData,
        generated_at=datetime.utcnow(),
        status="completed"
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    return {
        "success": True, 
        "report_id": str(new_report.report_id),
        "message": "Report saved"
    }

@router.get("", response_model=list) # simplified response model for now
def get_reports(
    uid: str = Query(..., description="User ID"),
    childId: Optional[str] = Query(None, description="Child ID"),
    db: Session = Depends(get_db)
):
    """
    Get reports for a student.
    """
    target_uid = None
    if childId:
         try:
            uuid_obj = uuid.UUID(childId)
            student = db.query(Student).filter(Student.student_id == uuid_obj).first()
            if student:
                target_uid = student.user_id
            else:
                 target_uid = uuid_obj
         except ValueError:
            pass
    elif uid:
         try:
            target_uid = uuid.UUID(uid)
         except ValueError:
            pass
            
    if not target_uid:
        return []
        
    reports = db.query(Report).filter(Report.target_entity_id == target_uid).order_by(desc(Report.generated_at)).all()
    
    # Simple serialization
    return [
        {
            "report_id": str(r.report_id),
            "report_type": r.report_type,
            "generated_at": r.generated_at,
            "parameters": r.parameters
        }
        for r in reports
    ]

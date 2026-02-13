from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.db.session import get_db
from app.core.security import get_current_user
from app.modules.auth.models import User
from app.modules.mentorship.models import MentoringSession, MentorAssignment
from app.modules.mentorship.schemas import SessionCreate, SessionResponse, AssignmentCreate, AssignmentResponse

router = APIRouter(prefix="/mentorship", tags=["mentorship"])

@router.post("/sessions", response_model=SessionResponse)
def create_session(
    session_in: SessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = MentoringSession(
        session_id=uuid.uuid4(),
        mentor_user_id=current_user.user_id, # Assuming creator is mentor for now
        student_user_id=session_in.student_user_id,
        mentor_code_used=session_in.mentor_code_used,
        tenant_id=current_user.tenant_id,
        school_id=current_user.school_id
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.get("/sessions", response_model=List[SessionResponse])
def get_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Determine if user is mentor or student and filter accordingly
    sessions = db.query(MentoringSession).filter(
        (MentoringSession.mentor_user_id == current_user.user_id) | 
        (MentoringSession.student_user_id == current_user.user_id)
    ).all()
    return sessions

@router.post("/assignments", response_model=AssignmentResponse)
def create_assignment(
    assignment_in: AssignmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assignment = MentorAssignment(
        assignment_id=uuid.uuid4(),
        session_id=assignment_in.session_id,
        assigned_by=current_user.user_id,
        content_type=assignment_in.content_type,
        content_id=assignment_in.content_id,
        notes=assignment_in.notes
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment

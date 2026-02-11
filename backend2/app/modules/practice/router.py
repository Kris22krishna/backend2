from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.modules.practice.schemas import SessionCreate, SessionResponse, QuestionAttemptCreate, QuestionAttemptResponse, ProgressResponse
from app.modules.practice.service import PracticeService

router = APIRouter(prefix="/practice", tags=["practice"])

@router.post("/sessions", response_model=SessionResponse)
def create_session(session_data: SessionCreate, db: Session = Depends(get_db)):
    return PracticeService.create_session(db, session_data)

@router.get("/sessions/{session_id}", response_model=SessionResponse)
def get_session(session_id: int, db: Session = Depends(get_db)):
    session = PracticeService.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/attempts", response_model=QuestionAttemptResponse)
def record_attempt(attempt_data: QuestionAttemptCreate, db: Session = Depends(get_db)):
    # Simple direct call
    return PracticeService.record_attempt(db, attempt_data)

@router.get("/progress/{user_id}/{skill_id}", response_model=ProgressResponse)
def get_progress(user_id: int, skill_id: int, db: Session = Depends(get_db)):
    progress = PracticeService.get_progress(db, user_id, skill_id)
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    return progress

@router.get("/user-progress/{user_id}", response_model=List[ProgressResponse])
def get_user_progress(user_id: int, db: Session = Depends(get_db)):
    return PracticeService.get_all_progress(db, user_id)

@router.get("/user-sessions/{user_id}", response_model=List[SessionResponse])
def get_user_sessions(user_id: int, limit: int = 10, db: Session = Depends(get_db)):
    return PracticeService.get_recent_sessions(db, user_id, limit)

@router.post("/sessions/{session_id}/finish", response_model=SessionResponse)
def finish_session(session_id: int, db: Session = Depends(get_db)):
    session = PracticeService.finish_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

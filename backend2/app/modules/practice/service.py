from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.modules.practice.models import PracticeSession, QuestionAttempt, UserSkillProgress
from app.modules.practice.schemas import QuestionAttemptCreate, SessionCreate
from datetime import datetime

class PracticeService:
    
    @staticmethod
    def create_session(db: Session, session_data: SessionCreate):
        new_session = PracticeSession(
            user_id=session_data.user_id,
            skill_id=session_data.skill_id
        )
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        return new_session

    @staticmethod
    def record_attempt(db: Session, attempt_data: QuestionAttemptCreate):
        
        # 1. Insert Attempt
        new_attempt = QuestionAttempt(
            user_id=attempt_data.user_id,
            session_id=attempt_data.session_id,
            skill_id=attempt_data.skill_id,
            template_id=attempt_data.template_id,
            difficulty_level=attempt_data.difficulty_level,
            question_text=attempt_data.question_text,
            correct_answer=attempt_data.correct_answer,
            student_answer=attempt_data.student_answer,
            is_correct=attempt_data.is_correct,
            solution_text=attempt_data.solution_text,
            time_spent_seconds=attempt_data.time_spent_seconds
        )
        db.add(new_attempt)
        
        # 2. Update Progress
        progress = db.query(UserSkillProgress).filter(
            UserSkillProgress.user_id == attempt_data.user_id,
            UserSkillProgress.skill_id == attempt_data.skill_id
        ).first()

        if not progress:
            progress = UserSkillProgress(
                user_id=attempt_data.user_id,
                skill_id=attempt_data.skill_id
            )
            db.add(progress)
        
        # Update stats
        progress.total_questions_attempted += 1
        progress.total_time_spent_seconds += attempt_data.time_spent_seconds
        
        if attempt_data.is_correct:
            progress.total_correct += 1
            progress.correct_streak += 1
            progress.wrong_streak = 0
        else:
            progress.correct_streak = 0
            progress.wrong_streak += 1

        # 3. Update Session
        if attempt_data.session_id:
            session = db.query(PracticeSession).filter(PracticeSession.session_id == attempt_data.session_id).first()
            if session:
                session.total_questions += 1
                session.total_time_seconds += attempt_data.time_spent_seconds
                if attempt_data.is_correct:
                    session.total_correct += 1
        
        db.commit()
        db.refresh(new_attempt)
        return new_attempt

    @staticmethod
    def get_progress(db: Session, user_id: int, skill_id: int):
        return db.query(UserSkillProgress).filter(
            UserSkillProgress.user_id == user_id,
            UserSkillProgress.skill_id == skill_id
        ).first()

    @staticmethod
    def get_session(db: Session, session_id: int):
        return db.query(PracticeSession).filter(PracticeSession.session_id == session_id).first()

    @staticmethod
    def get_all_progress(db: Session, user_id: int):
        return db.query(UserSkillProgress).filter(
            UserSkillProgress.user_id == user_id
        ).all()

    @staticmethod
    def get_recent_sessions(db: Session, user_id: int, limit: int = 10):
        return db.query(PracticeSession).filter(
            PracticeSession.user_id == user_id
        ).order_by(desc(PracticeSession.started_at)).limit(limit).all()

    @staticmethod
    def finish_session(db: Session, session_id: int):
        session = db.query(PracticeSession).filter(PracticeSession.session_id == session_id).first()
        if session:
            session.ended_at = datetime.utcnow()
            db.commit()
            db.refresh(session)
        return session

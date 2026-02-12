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
        import logging
        try:
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
                    skill_id=attempt_data.skill_id,
                    total_questions_attempted=0,
                    total_correct=0,
                    total_time_spent_seconds=0,
                    current_difficulty='Easy', # Default to Easy
                    correct_streak=0,
                    wrong_streak=0
                )
                db.add(progress)
            
            # Update stats - Ensure values are integers
            progress.total_questions_attempted = (progress.total_questions_attempted or 0) + 1
            progress.total_time_spent_seconds = (progress.total_time_spent_seconds or 0) + attempt_data.time_spent_seconds
            
            if attempt_data.is_correct:
                progress.total_correct = (progress.total_correct or 0) + 1
                progress.correct_streak = (progress.correct_streak or 0) + 1
                progress.wrong_streak = 0
            else:
                progress.correct_streak = 0
                progress.wrong_streak = (progress.wrong_streak or 0) + 1

            # 3. Update Session
            if attempt_data.session_id:
                session = db.query(PracticeSession).filter(PracticeSession.session_id == attempt_data.session_id).first()
                if session:
                    session.total_questions = (session.total_questions or 0) + 1
                    session.total_time_seconds = (session.total_time_seconds or 0) + attempt_data.time_spent_seconds
                    if attempt_data.is_correct:
                        session.total_correct = (session.total_correct or 0) + 1
            
            db.commit()
            db.refresh(new_attempt)
            return new_attempt
        except Exception as e:
            db.rollback()
            logging.error(f"Error in record_attempt: {str(e)}")
            raise e

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

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class PracticeSession(Base):
    __tablename__ = "v2_practice_sessions"
    
    session_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("v2_students.user_id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(Integer, nullable=False) 
    started_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    total_time_seconds = Column(Integer, default=0, nullable=False)
    total_questions = Column(Integer, default=0, nullable=False)
    total_correct = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    attempts = relationship("QuestionAttempt", back_populates="session", cascade="all, delete-orphan")

class QuestionAttempt(Base):
    __tablename__ = "v2_question_attempts"

    attempt_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("v2_students.user_id", ondelete="CASCADE"), nullable=False)
    session_id = Column(Integer, ForeignKey("v2_practice_sessions.session_id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(Integer, nullable=False)
    template_id = Column(Integer, nullable=True)
    difficulty_level = Column(String, nullable=False) # Easy, Medium, Hard

    question_text = Column(Text, nullable=False)
    correct_answer = Column(Text, nullable=False)
    student_answer = Column(Text, nullable=True)
    is_correct = Column(Boolean, nullable=False)
    solution_text = Column(Text, nullable=True)

    time_spent_seconds = Column(Integer, nullable=False) 

    attempted_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    session = relationship("PracticeSession", back_populates="attempts")

class UserSkillProgress(Base):
    __tablename__ = "v2_user_skill_progress"

    user_id = Column(Integer, ForeignKey("v2_students.user_id", ondelete="CASCADE"), primary_key=True)
    skill_id = Column(Integer, primary_key=True)

    total_questions_attempted = Column(Integer, default=0, nullable=False)
    total_correct = Column(Integer, default=0, nullable=False)
    total_time_spent_seconds = Column(Integer, default=0, nullable=False)

    current_difficulty = Column(String, default='Easy', nullable=False)
    correct_streak = Column(Integer, default=0, nullable=False)
    wrong_streak = Column(Integer, default=0, nullable=False)

    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

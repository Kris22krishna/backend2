from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, func, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base
import uuid

class MentoringSession(Base):
    __tablename__ = "mentoring_sessions"

    session_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=True)
    school_id = Column(UUID(as_uuid=True), nullable=True)
    mentor_user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    student_user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    mentor_code_used = Column(String, nullable=True)
    student_confirmed = Column(Boolean, default=False)
    started_at = Column(DateTime, nullable=True)
    ended_at = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    session_summary = Column(Text, nullable=True)
    student_rating = Column(Integer, nullable=True)
    student_feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    mentor = relationship("User", foreign_keys=[mentor_user_id], backref="mentored_sessions")
    student = relationship("User", foreign_keys=[student_user_id], backref="student_sessions")

class MentorAssignment(Base):
    __tablename__ = "mentor_assignments"

    assignment_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("mentoring_sessions.session_id"), nullable=True)
    assigned_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    content_type = Column(String, nullable=True)
    content_id = Column(UUID(as_uuid=True), nullable=True)
    notes = Column(Text, nullable=True)
    assigned_at = Column(DateTime, nullable=True)

class MentorQuestion(Base):
    __tablename__ = "mentor_questions"

    question_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("mentoring_sessions.session_id"), nullable=True)
    asked_by_user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    question_text = Column(Text, nullable=True)
    answer_text = Column(Text, nullable=True)
    asked_at = Column(DateTime, nullable=True)
    answered_at = Column(DateTime, nullable=True)

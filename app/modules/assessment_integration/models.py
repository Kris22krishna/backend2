from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base
import uuid
from datetime import datetime

class AssessmentStudent(Base):
    __tablename__ = "assessment_students"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    serial_number = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    grade = Column(String, nullable=False)
    school_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    
    uploaded_by_user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to uploader
    # Relationship to uploader
    uploader = relationship("User", backref="uploaded_students")
    sessions = relationship("AssessmentSession", back_populates="student")

class AssessmentSession(Base):
    __tablename__ = "assessment_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("assessment_students.id"), nullable=False)
    
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String, default="PENDING") # PENDING, IN_PROGRESS, COMPLETED
    
    # Relationship
    student = relationship("AssessmentStudent", back_populates="sessions")
    questions = relationship("AssessmentSessionQuestion", back_populates="session")

class AssessmentSessionQuestion(Base):
    __tablename__ = "assessment_session_questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("assessment_sessions.id"), nullable=False)
    template_id = Column(Integer, nullable=False) # Store the source template ID
    
    question_html = Column(String, nullable=False)
    question_type = Column(String, nullable=False)
    options = Column(String, nullable=True) # JSON string for options if MCQ
    
    correct_answer = Column(String, nullable=False)
    student_answer = Column(String, nullable=True)
    is_correct = Column(String, nullable=True) # True/False stored as string or boolean
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    session = relationship("AssessmentSession", back_populates="questions")

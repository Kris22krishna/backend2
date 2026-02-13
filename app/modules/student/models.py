from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, func, Integer, Date, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.db.base import Base
import uuid

class Student(Base):
    __tablename__ = "students"

    student_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), unique=True, nullable=False)
    tenant_id = Column(UUID(as_uuid=True), nullable=False)
    school_id = Column(UUID(as_uuid=True), nullable=False)
    admission_number = Column(String, nullable=True)
    roll_number = Column(String, nullable=True)
    grade = Column(String, nullable=True)
    section = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String, nullable=True)
    enrollment_status = Column(String, nullable=True)
    enrollment_date = Column(Date, nullable=True)
    exit_date = Column(Date, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", backref="student_profile")

class Report(Base):
    __tablename__ = "reports"

    report_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True) # Assuming user_id maps to user
    report_data = Column(JSONB, nullable=True)
    status = Column(String, nullable=True)
    evaluated_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    # Removed columns not in DB: tenant_id, school_id, requested_by, report_type, report_scope, target_entity_id, parameters, file_url, expires_at


class TestInvigilationSession(Base):
    __tablename__ = "test_invigilation_sessions"

    invigilation_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=True)
    school_id = Column(UUID(as_uuid=True), nullable=True)
    companion_user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    test_session_id = Column(UUID(as_uuid=True), nullable=True) # Assuming connection to a test session
    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)
    issues_reported = Column(Boolean, default=False)
    issue_notes = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

from sqlalchemy import Column, String, DateTime, ForeignKey, func, Integer, Date, JSON, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.db.base import Base
import uuid

class Parent(Base):
    __tablename__ = "parents"

    parent_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), unique=True, nullable=False)
    tenant_id = Column(UUID(as_uuid=True), nullable=False)
    school_id = Column(UUID(as_uuid=True), nullable=False)
    
    occupation = Column(String, nullable=True)
    relationship_type = Column(String, nullable=True)
    is_primary_guardian = Column(Boolean, default=False)
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    user = relationship("User", backref="parent_profile")

class ParentStudent(Base):
    __tablename__ = "parent_students"
    
    parent_student_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("parents.parent_id"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.student_id"), nullable=False)
    relationship_type = Column(String, nullable=True)
    can_view_reports = Column(Boolean, default=True)
    can_receive_notifications = Column(Boolean, default=True)
    
    created_at = Column(DateTime, server_default=func.now())

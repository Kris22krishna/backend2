from sqlalchemy import Column, String, DateTime, ForeignKey, func, Integer, Date, JSON, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.db.base import Base
import uuid

class Teacher(Base):
    __tablename__ = "teachers"

    teacher_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), unique=True, nullable=False)
    tenant_id = Column(UUID(as_uuid=True), nullable=False)
    school_id = Column(UUID(as_uuid=True), nullable=False)
    
    employee_id = Column(String, nullable=True)
    qualification = Column(String, nullable=True)
    experience_years = Column(Integer, nullable=True)
    subjects = Column(JSONB, nullable=True) # List of subjects
    department = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    employment_type = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    
    date_of_joining = Column(Date, nullable=True)
    date_of_exit = Column(Date, nullable=True)
    status = Column(String, default="active")
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", backref="teacher_profile")

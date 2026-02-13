from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.db.base import Base

class LotteryRegistration(Base):
    __tablename__ = "lottery_registrations"

    registration_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True) # Optional link to user
    ticket_code = Column(String, unique=True, index=True, nullable=False)
    
    first_name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    grade = Column(String, nullable=True)
    school_name = Column(String, nullable=True)
    profession = Column(String, nullable=True)
    reference_source = Column(String, nullable=True)
    
    is_winner = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

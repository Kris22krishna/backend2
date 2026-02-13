from sqlalchemy import Column, String, DateTime, ForeignKey, func, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.base import Base
import uuid

class AuditLog(Base):
    __tablename__ = "audit_logs"

    audit_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=True)
    school_id = Column(UUID(as_uuid=True), nullable=True)
    actor_user_id = Column(UUID(as_uuid=True), nullable=True)
    actor_role_id = Column(UUID(as_uuid=True), nullable=True)
    action = Column(String, nullable=True)
    entity_type = Column(String, nullable=True)
    entity_id = Column(UUID(as_uuid=True), nullable=True)
    old_value = Column(JSONB, nullable=True)
    new_value = Column(JSONB, nullable=True)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    performed_at = Column(DateTime, server_default=func.now())

class UserOnboardingEvent(Base):
    __tablename__ = "user_onboarding_events"

    onboarding_event_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=True)
    school_id = Column(UUID(as_uuid=True), nullable=True)
    new_user_id = Column(UUID(as_uuid=True), nullable=True)
    onboarded_by_user_id = Column(UUID(as_uuid=True), nullable=True)
    onboarded_by_role = Column(String, nullable=True)
    method = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

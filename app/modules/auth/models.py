from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base
import uuid

class Tenant(Base):
    __tablename__ = "tenants"
    tenant_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_name = Column(String, nullable=False)
    tenant_code = Column(String, nullable=False, unique=True)
    status = Column(String)

class School(Base):
    __tablename__ = "schools"
    school_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False)
    school_name = Column(String)
    school_code = Column(String)
    status = Column(String)

class Role(Base):
    __tablename__ = "roles"
    role_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=True)
    role_name = Column(String)
    role_code = Column(String)
    scope = Column(String)
    is_system_role = Column(Boolean, default=False)
    status = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class Permission(Base):
    __tablename__ = "permissions"
    permission_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    permission_code = Column(String, unique=True)
    permission_name = Column(String)
    module = Column(String)
    description = Column(String)
    is_system_permission = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class UserRole(Base):
    __tablename__ = "user_roles"
    user_role_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.role_id"), nullable=False)
    school_id = Column(UUID(as_uuid=True), nullable=True)
    assigned_by = Column(UUID(as_uuid=True), nullable=True)
    assigned_at = Column(DateTime, nullable=True)
    valid_from = Column(DateTime, nullable=True)
    valid_until = Column(DateTime, nullable=True)
    status = Column(String)

class RolePermission(Base):
    __tablename__ = "role_permissions"
    role_permission_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.role_id"), nullable=False)
    permission_id = Column(UUID(as_uuid=True), ForeignKey("permissions.permission_id"), nullable=False)
    is_allowed = Column(Boolean, default=True)
    granted_by = Column(UUID(as_uuid=True), nullable=True)
    granted_at = Column(DateTime, nullable=True)
    revoked_at = Column(DateTime, nullable=True)

class User(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=True) # Assuming nullable based on context
    school_id = Column(UUID(as_uuid=True), nullable=True)
    user_type = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    display_name = Column(String, nullable=True)
    email = Column(String, nullable=True) # Can be null if phone number is used, but distinct in Credentials
    phone_number = Column(String, nullable=True)
    status = Column(String, default="active")
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    credentials = relationship("Credential", back_populates="user")

class Credential(Base):
    __tablename__ = "credentials"

    credential_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    tenant_id = Column(UUID(as_uuid=True), nullable=True)
    auth_type = Column(String, nullable=False) # e.g., 'password', 'google'
    identifier = Column(String, nullable=False) # email or username
    secret_hash = Column(String, nullable=True) # hashed password
    provider = Column(String, default="local")
    is_primary = Column(Boolean, default=True)
    status = Column(String, default="active")
    last_used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="credentials")

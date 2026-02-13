from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, func, text, Integer, Date
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
    plan_type = Column(String)
    max_users = Column(Integer)
    max_schools = Column(Integer)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class School(Base):
    __tablename__ = "schools"
    school_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False)
    school_name = Column(String)
    school_code = Column(String)
    school_type = Column(String)
    board = Column(String)
    status = Column(String)
    academic_year_start = Column(Date)
    academic_year_end = Column(Date)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

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

class V2User(Base):
    __tablename__ = "v2_users"
    user_id = Column(Integer, primary_key=True, autoincrement=True) # BIGSERIAL maps to Integer/BigInteger in SQLA
    name = Column(String, nullable=False)
    role = Column(String, nullable=False) 
    created_at = Column(DateTime, server_default=func.now())

class V2Student(Base):
    __tablename__ = "v2_students"
    user_id = Column(Integer, ForeignKey("v2_users.user_id", ondelete="CASCADE"), primary_key=True)
    class_name = Column("class", String, nullable=False)

class V2Parent(Base):
    __tablename__ = "v2_parents"
    user_id = Column(Integer, ForeignKey("v2_users.user_id", ondelete="CASCADE"), primary_key=True)
    phone_number = Column(String, nullable=False)

class V2Mentor(Base):
    __tablename__ = "v2_mentors"
    user_id = Column(Integer, ForeignKey("v2_users.user_id", ondelete="CASCADE"), primary_key=True)
    phone_number = Column(String, nullable=False)

class V2StudentParent(Base):
    __tablename__ = "v2_student_parent"
    parent_id = Column(Integer, ForeignKey("v2_parents.user_id", ondelete="CASCADE"), primary_key=True)
    student_id = Column(Integer, ForeignKey("v2_students.user_id", ondelete="CASCADE"), primary_key=True)

class V2Mentorship(Base):
    __tablename__ = "v2_mentorship"
    mentor_id = Column(Integer, ForeignKey("v2_mentors.user_id", ondelete="CASCADE"), primary_key=True)
    student_id = Column(Integer, ForeignKey("v2_students.user_id", ondelete="CASCADE"), primary_key=True)

class V2AuthCredential(Base):
    __tablename__ = "v2_auth_credentials"
    user_id = Column(Integer, ForeignKey("v2_users.user_id", ondelete="CASCADE"), primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email_id = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)

class V2Guest(Base):
    __tablename__ = "v2_guests"
    user_id = Column(Integer, ForeignKey("v2_users.user_id", ondelete="CASCADE"), primary_key=True)
    phone_number = Column(String, nullable=False)




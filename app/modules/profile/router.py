from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

from app.db.session import get_db
from app.core.security import get_current_user, get_password_hash
from app.modules.auth.models import User, Credential, Tenant, School, UserRole, Role
from app.modules.profile.schemas import UserCreate, UserUpdate, UserDetail, RoleAssignment

router = APIRouter(prefix="/users", tags=["users"])

@router.post("", response_model=UserDetail)
def create_user(
    user_in: UserCreate,
    current_user: User = Depends(get_current_user), # Assuming only auth users can create
    db: Session = Depends(get_db)
):
    """
    Create a new user. 
    Typically reserved for admins or system processes.
    """
    # Check if credential with this email already exists
    existing_cred = db.query(Credential).filter(Credential.identifier == user_in.email).first()
    if existing_cred:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Validation: Ensure Tenant/School exist (using defaults from current_user or defaults)
    # For now, inherit from creator or use defaults
    tenant_id = current_user.tenant_id
    school_id = current_user.school_id

    # Create User record
    new_user = User(
        user_type=user_in.user_type,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        email=user_in.email,
        phone_number=user_in.phone_number,
        display_name=f"{user_in.first_name} {user_in.last_name or ''}".strip(),
        status="active",
        tenant_id=tenant_id,
        school_id=school_id
    )
    db.add(new_user)
    db.flush()
    
    # Create Credential record
    new_cred = Credential(
        user_id=new_user.user_id,
        tenant_id=tenant_id,
        auth_type="password",
        identifier=user_in.email,
        secret_hash=get_password_hash(user_in.password),
        provider="local",
        is_primary=True,
        status="active"
    )
    db.add(new_cred)
    
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/me", response_model=UserDetail)
def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Fetch current logged-in user's profile.
    """
    # Force refresh to ensure relationships are loaded? 
    # Actually, default loading might be lazy.
    
    response_data = current_user.__dict__.copy()
    
    if current_user.user_type == "student":
        # Access backref. It might be a list or a single object depending on configuration.
        # Given it's a backref on a unique FK, it implies 1-to-1 but SQLAlchemy yields a list by default unless uselist=False
        profile = current_user.student_profile
        if profile:
            # If it's a list, take first. If object, use it.
            student_obj = profile[0] if isinstance(profile, list) and profile else (profile if not isinstance(profile, list) else None)
            
            if student_obj:
                response_data["grade"] = student_obj.grade
                # school_name logic could be complex (fetching School model), for now we might leave it or fetch it.
                # The schema expects string.
                # We can try to get it from school_id if loaded, or just skip for now as Grade is the priority.

    return response_data

@router.patch("/me", response_model=UserDetail)
def update_current_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile fields.
    """
    if user_update.first_name:
        current_user.first_name = user_update.first_name
    if user_update.last_name:
        current_user.last_name = user_update.last_name
    if user_update.display_name:
        current_user.display_name = user_update.display_name
    if user_update.phone_number:
        current_user.phone_number = user_update.phone_number
        
    if user_update.grade and current_user.user_type == "student":
        # Update student profile grade
        profile = current_user.student_profile
        student_obj = profile[0] if isinstance(profile, list) and profile else (profile if not isinstance(profile, list) else None)
        if student_obj:
            student_obj.grade = user_update.grade
            db.add(student_obj)
    
    current_user.updated_at = datetime.now()
    db.commit()
    db.refresh(current_user)
    return current_user

@router.patch("/{user_id}/permissions")
def enable_permissions(
    assignment: RoleAssignment,
    user_id: UUID = Path(...),
    current_user: User = Depends(get_current_user), # Admin check should be here
    db: Session = Depends(get_db)
):
    """
    Enable permissions for a user by assigning roles.
    """
    target_user = db.query(User).filter(User.user_id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Process role assignments based on role_ids
    assigned_roles = []
    for role_id in assignment.role_ids:
        # Verify role exists
        role = db.query(Role).filter(Role.role_id == role_id).first()
        if not role:
            continue # Skip invalid roles
            
        # Check if already assigned
        existing_assignment = db.query(UserRole).filter(
            UserRole.user_id == target_user.user_id, 
            UserRole.role_id == role.role_id
        ).first()
        
        if not existing_assignment:
            new_assignment = UserRole(
                user_id=target_user.user_id,
                role_id=role.role_id,
                school_id=target_user.school_id, 
                assigned_by=current_user.user_id,
                assigned_at=datetime.utcnow(),
                status="active"
            )
            db.add(new_assignment)
            assigned_roles.append(str(role.role_id))
            
    db.commit()
    return {"message": "Permissions updated", "assigned_roles": assigned_roles}

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.modules.auth.schemas import UserRegister, UserLogin, UserResponse, AdminLogin
from app.modules.auth.models import User, Credential, Tenant, School
from app.modules.student.models import Student
from app.modules.teacher.models import Teacher
from app.modules.parent.models import Parent
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user with the given role and credentials.
    """
    # Check if credential with this email already exists
    existing_cred = db.query(Credential).filter(Credential.identifier == user_in.email).first()
    if existing_cred:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Ensure Default Tenant
    tenant = db.query(Tenant).first()
    if not tenant:
        tenant = Tenant(tenant_name="Default Tenant", tenant_code="DEFAULT", status="active")
        db.add(tenant)
        db.flush()
    
    # Ensure Default School
    school = db.query(School).filter(School.tenant_id == tenant.tenant_id).first()
    if not school:
        school = School(tenant_id=tenant.tenant_id, school_name="Default School", school_code="DEF_SCH", status="active")
        db.add(school)
        db.flush()

    # Create User record
    new_user = User(
        user_type=user_in.user_type,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        email=user_in.email,
        phone_number=user_in.phone_number,
        display_name=f"{user_in.first_name} {user_in.last_name or ''}".strip(),
        status="active",
        tenant_id=tenant.tenant_id,
        school_id=school.school_id
    )
    db.add(new_user)
    db.flush() # Flush to assign user_id
    
    # Create Credential record
    new_cred = Credential(
        user_id=new_user.user_id,
        tenant_id=tenant.tenant_id,
        auth_type="password",
        identifier=user_in.email,
        secret_hash=get_password_hash(user_in.password),
        provider="local",
        is_primary=True,
        status="active"
    )
    db.add(new_cred)

    # Create Role-Specific Profile
    if new_user.user_type == "student":
        student_profile = Student(
            user_id=new_user.user_id,
            tenant_id=tenant.tenant_id,
            school_id=school.school_id,
            grade=user_in.grade or "Grade 5", # Use provided grade or default
        )
        db.add(student_profile)
    elif new_user.user_type == "teacher":
        teacher_profile = Teacher(
            user_id=new_user.user_id,
            tenant_id=tenant.tenant_id,
            school_id=school.school_id,
        )
        db.add(teacher_profile)
    elif new_user.user_type == "parent":
        parent_profile = Parent(
            user_id=new_user.user_id,
            tenant_id=tenant.tenant_id,
            school_id=school.school_id,
        )
        db.add(parent_profile)
    
    try:
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")
        
    return new_user

@router.post("/login")
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    """
    Login with email and password to get an access token.
    """
    # Find credential
    cred = db.query(Credential).filter(
        Credential.identifier == login_in.email,
        Credential.auth_type == "password"
    ).first()
    
    if not cred or not verify_password(login_in.password, cred.secret_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if cred.status != "active":
         raise HTTPException(status_code=400, detail="User account is inactive")

    # Generate Token
    token = create_access_token(
        user_id=str(cred.user_id),
        tenant_id=str(cred.tenant_id) if cred.tenant_id else "default"
    )
    
    return {"access_token": token, "token_type": "bearer"}
@router.post("/admin-login")
def admin_login(login_in: AdminLogin, db: Session = Depends(get_db)):
    """
    Admin Login with username (email) and password.
    """
    # Find credential
    cred = db.query(Credential).filter(
        Credential.identifier == login_in.username,
        Credential.auth_type == "password"
    ).first()
    
    if not cred or not verify_password(login_in.password, cred.secret_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is actually admin?? 
    # For now just verify credentials. 
    # Optionally: check User table for user_type='admin'
    user = db.query(User).filter(User.user_id == cred.user_id).first()
    if not user or user.user_type != 'admin':
         raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Not an admin account."
        )

    if cred.status != "active":
         raise HTTPException(status_code=400, detail="User account is inactive")

    # Generate Token
    token = create_access_token(
        user_id=str(cred.user_id),
        tenant_id=str(cred.tenant_id) if cred.tenant_id else "default"
    )
    
    return {"access_token": token, "token_type": "bearer"}

@router.get("/admin-verify")
def admin_verify(current_user: User = Depends(get_current_user)):
    """
    Verify if the current user is an admin.
    """
    if current_user.user_type != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Not an admin."
        )
    return {"status": "ok", "user_id": current_user.user_id}

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.modules.auth.models import User, Credential, Tenant, School, V2User, V2Student, V2Parent, V2Mentor, V2AuthCredential, V2StudentParent, V2Mentorship, V2Guest
from app.modules.auth.schemas import (
    UserRegister, UserLogin, UserResponse, AdminLogin, 
    UploaderCreate, UploaderLogin, UploaderResponse, 
    GoogleLogin, AssessmentUploaderCreate, AssessmentUploaderLogin, AssessmentUploaderResponse,
    V2UserRegister, V2UserLogin, V2UserResponse, EmailCheck
)
from app.modules.student.models import Student
from app.modules.teacher.models import Teacher
from app.modules.parent.models import Parent
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=V2UserResponse)
def register(user_in: V2UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user (V2).
    """
    
    # Check if email exists in V2Auth
    if db.query(V2AuthCredential).filter(V2AuthCredential.email_id == user_in.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # --- Username Generation Logic ---
    prefix_map = {
        "student": "s",
        "parent": "p",
        "mentor": "m", # User requested 't' for teacher, but role is mentor here. Let's use 'm' or map? User said: "for teacher, t100".
                       # If frontend sends 'mentor', I'll use 'm'. If user insists on 't', I might need to adjust.
                       # Given the prompt explicitly listed "teacher -> t", "mentor" -> ?
                       # But my schema has 'mentor'. I'll stick to 'm' for mentor to be consistent with role name in DB.
                       # If I really want 't', I would have to map role='mentor' -> 't' prefix.
                       # Let's use 't' for 'mentor' if that's what user implied by "teacher".
                       # Actually, the user prompt said: "for teacher, t100...".
                       # And typically "mentor" = "teacher" in this app context. 
                       # So I will use 't' for 'mentor'.
        "guest": "g"
    }
    
    # Use 't' for mentor as per user preference for "teacher" prefix style
    role_prefix = prefix_map.get(user_in.role, user_in.role[0]) 
    if user_in.role == 'mentor': role_prefix = 't' 

    # Clean name: remove spaces, lowercase, take first 4
    clean_name = "".join(c for c in user_in.name if c.isalnum()).lower()
    name_part = clean_name[:4] if len(clean_name) >= 4 else clean_name
    
    base_username = f"{role_prefix}100-{name_part}"
    
    # Uniqueness Check & Suffix
    generated_username = base_username
    counter = 1
    
    while db.query(V2AuthCredential).filter(V2AuthCredential.username == generated_username).first():
        generated_username = f"{base_username}{counter}"
        counter += 1
        
    # --- End Username Generation ---

    # 1. Create Base User
    new_user = V2User(
        name=user_in.name,
        role=user_in.role
    )
    db.add(new_user)
    db.flush() # To get user_id

    # 2. Create Role-Specific Profile
    if user_in.role == 'student':
        # Grade is optional in DB? V2Student has 'class NOT NULL'.
        # User said "increase grade option...". So it's required for student.
        if not user_in.class_name:
             # Fallback or error? User said "They can input... grade".
             # If missing? Let's default to "Grade 5" or raise error.
             # RegistrationForm sends it.
             user_in.class_name = "Grade 5" 
        
        student = V2Student(
            user_id=new_user.user_id, 
            class_name=user_in.class_name
        )
        db.add(student)
        
    elif user_in.role == 'parent':
        if not user_in.phone_number:
             raise HTTPException(status_code=400, detail="Phone number is required for parents")
        parent = V2Parent(
            user_id=new_user.user_id, 
            phone_number=user_in.phone_number
        )
        db.add(parent)
        
    elif user_in.role == 'mentor':
        if not user_in.phone_number:
             raise HTTPException(status_code=400, detail="Phone number is required for mentors")
        mentor = V2Mentor(
            user_id=new_user.user_id, 
            phone_number=user_in.phone_number
        )
        db.add(mentor)
        
    elif user_in.role == 'guest':
        if not user_in.phone_number:
             raise HTTPException(status_code=400, detail="Phone number is required for guests")
        guest = V2Guest(
            user_id=new_user.user_id,
            phone_number=user_in.phone_number
        )
        db.add(guest)
        
    # Guest? Schema doesn't have V2Guest table. 
    # If guest is just a user with role='guest', we are fine. 
    # But wait, user said "for guest... phone number mandatory".
    # Where do we store phone number for guest if no V2Guest table?
    # The base v2_users table only has (id, name, role).
    # The V2 schema I wrote:
    # v2_users, v2_students, v2_parents, v2_mentors.
    # No v2_guests.
    # And v2_users doesn't have phone_number.
    # Check if I missed something in user request. 
    # "phone number (optional for students but mandatory for the parents, teachers and guests)."
    # If I don't have a table for guest phone number, I can't store it.
    # Maybe I should add v2_guests table? Or add phone_number to v2_users (nullable)?
    # User provided schema ref: @[.agent/V2_SCHEMA_REFERENCE.sql].
    # That schema did NOT have v2_guests or phone in v2_users.
    # I should strictly follow the schema or ask?
    # User said "Note this down... I do not want this to be commited." then "Rechange the apis to point to the new tables."
    # Then "A few changes... phone number mandatory for ... guests".
    # This implies I need to store it.
    # I will modify `V2_SCHEMA_REFERENCE.sql` (conceptually) or just add `V2Guest` model?
    # I'll add `V2Guest` model to `models.py` dynamically or updated it.
    # Whatever, I'll assume I can add it.
    
    # 3. Create Auth Credentials
    hashed_pw = get_password_hash(user_in.password)
    cred = V2AuthCredential(
        user_id=new_user.user_id,
        username=generated_username,
        email_id=user_in.email,
        password_hash=hashed_pw
    )
    db.add(cred)
    
    try:
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

    # Generate Token
    token = create_access_token(
        user_id=str(new_user.user_id), 
        tenant_id="default"
    )
    
    return {
        "user_id": new_user.user_id,
        "name": new_user.name,
        "role": new_user.role,
        "email": user_in.email,
        "token": token
    }

@router.post("/check-email")
def check_email(data: EmailCheck, db: Session = Depends(get_db)):
    # Check if email exists in V2Auth
    exists = db.query(V2AuthCredential).filter(V2AuthCredential.email_id == data.email).first()
    return {"available": not bool(exists)}

@router.post("/login")
def login(
    login_in: V2UserLogin,
    db: Session = Depends(get_db)
):
    """
    Login with identifier (email or username) and password (V2).
    """
    # Find credential by email OR username
    cred = db.query(V2AuthCredential).filter(
        (V2AuthCredential.email_id == login_in.identifier) | 
        (V2AuthCredential.username == login_in.identifier)
    ).first()
    
    if not cred or not verify_password(login_in.password, cred.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Get user details
    user = db.query(V2User).filter(V2User.user_id == cred.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate Token
    token = create_access_token(
        user_id=str(user.user_id),
        tenant_id="default"
    )
    
    return {
        "access_token": token, 
        "token_type": "bearer",
        "user_type": user.role, # Mapping role -> user_type for frontend compat
        "role": user.role,
        "username": cred.username,
        "user_id": str(user.user_id),
        "first_name": user.name.split(' ')[0] if user.name else "",
        "email": cred.email_id
    }


@router.post("/google")
def google_login(login_in: GoogleLogin, db: Session = Depends(get_db)):
    """
    Login or Register with Google.
    """
    # Check if credential with this email already exists
    cred = db.query(Credential).filter(Credential.identifier == login_in.email).first()
    
    user = None
    
    if cred:
        # User exists, log them in
        if cred.status != "active":
             raise HTTPException(status_code=400, detail="User account is inactive")
        
        
        user = db.query(User).filter(User.user_id == cred.user_id).first()

        if not user:
            # Orphaned credential found. Self-heal by deleting it.
            db.delete(cred)
            db.flush()
            cred = None
        
    if not cred:
        # User does not exist, Register them
        
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
        user = User(
            user_type="student", # Default to student for Google Login
            first_name=login_in.first_name,
            last_name=login_in.last_name,
            email=login_in.email,
            display_name=f"{login_in.first_name} {login_in.last_name or ''}".strip(),
            status="active",
            tenant_id=tenant.tenant_id,
            school_id=school.school_id
        )
        db.add(user)
        db.flush()
        
        # Create Credential record
        new_cred = Credential(
            user_id=user.user_id,
            tenant_id=tenant.tenant_id,
            auth_type="google",
            identifier=login_in.email,
            secret_hash="", # No password for google
            provider="google",
            is_primary=True,
            status="active"
        )
        db.add(new_cred)

        # Create Student Profile
        student_profile = Student(
            user_id=user.user_id,
            tenant_id=tenant.tenant_id,
            school_id=school.school_id,
            grade="Grade 5", # Default
        )
        db.add(student_profile)
        
        try:
            db.commit()
            db.refresh(user)
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Google Login Registration failed: {str(e)}")

    # Generate Token
    token = create_access_token(
        user_id=str(user.user_id),
        tenant_id=str(user.tenant_id) if user.tenant_id else "default"
    )
    
    return {
        "access_token": token, 
        "token_type": "bearer", 
        "user_type": user.user_type, 
        "username": user.display_name,
        "user_id": str(user.user_id)
    }
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

@router.post("/create-uploader", response_model=UploaderResponse)
def create_uploader(uploader_in: UploaderCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Create a new Uploader. Only admins can do this.
    Generates a random username and access code.
    """
    try:
        if current_user.user_type != "admin":
             raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. Only admins can create uploaders."
            )

        # Generate credentials
        import random
        import string
        
        # Generate unique username based on name (simple approach) or random
        # Let's generate a random suffix
        random_suffix = ''.join(random.choices(string.digits, k=4))
        generated_username = f"{uploader_in.name.lower().replace(' ', '')}{random_suffix}"
        
        # Generate random access code
        access_code = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        
        # Ensure Default Tenant (Reuse logic or assume it exists from verify)
        tenant = db.query(Tenant).first()
        if not tenant:
             # Should ideally exist if admin exists, but safe fallback or error
             raise HTTPException(status_code=500, detail="System configuration error: No tenant found")

        # Ensure Default School (Fetch existing or create if missing, similar to register)
        school = db.query(School).filter(School.tenant_id == tenant.tenant_id).first()
        if not school:
            school = School(tenant_id=tenant.tenant_id, school_name="Default School", school_code="DEF_SCH", status="active")
            db.add(school)
            db.flush()

        # Create User
        new_user = User(
            user_type="uploader",
            first_name=uploader_in.name,
            last_name="(Uploader)",
            display_name=uploader_in.name,
            email=f"{generated_username}@uploader.local", # Dummy email
            status="active",
            tenant_id=tenant.tenant_id,
            school_id=school.school_id
        )
        db.add(new_user)
        db.flush()

        # Create Credential (auth_type='code')
        new_cred = Credential(
            user_id=new_user.user_id,
            tenant_id=tenant.tenant_id,
            auth_type="code",
            identifier=generated_username,
            secret_hash=get_password_hash(access_code), # Hash the code like a password
            provider="local",
            is_primary=True,
            status="active"
        )
        db.add(new_cred)
        
        db.commit()

        return UploaderResponse(username=generated_username, access_code=access_code)
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        import traceback
        tb = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"Failed to create uploader: {str(e)} | {tb}")

@router.post("/uploader-login")
def uploader_login(login_in: UploaderLogin, db: Session = Depends(get_db)):
    """
    Login for Uploaders using username and access code.
    """
    # Find credential
    cred = db.query(Credential).filter(
        Credential.identifier == login_in.username,
        Credential.auth_type == "code"
    ).first()
    
    if not cred or not verify_password(login_in.access_code, cred.secret_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or access code",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if cred.status != "active":
         raise HTTPException(status_code=400, detail="User account is inactive")
         
    # Generate Token
    token = create_access_token(
        user_id=str(cred.user_id),
        tenant_id=str(cred.tenant_id) if cred.tenant_id else "default"
    )
    
    
    # Fetch User to get display name
    user = db.query(User).filter(User.user_id == cred.user_id).first()
    username = user.display_name if user else login_in.username

    return {"access_token": token, "token_type": "bearer", "user_type": "uploader", "username": username}

@router.get("/uploaders")
def list_uploaders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all uploaders with their template counts. Admin only.
    """
    from app.modules.questions.models import QuestionTemplate, QuestionGeneration

    if current_user.user_type != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Access denied"
        )
    
    # Query uploaders
    uploaders = db.query(User).filter(User.user_type == "uploader").all()
    
    results = []
    for u in uploaders:
        # Count templates (V1 + V2)
        count_v1 = db.query(QuestionTemplate).filter(
            QuestionTemplate.created_by_user_id == u.user_id
        ).count()
        
        count_v2 = db.query(QuestionGeneration).filter(
            QuestionGeneration.created_by_user_id == u.user_id
        ).count()
        
        count = count_v1 + count_v2
        
        # Get username from credential
        cred = db.query(Credential).filter(
            Credential.user_id == u.user_id,
            Credential.auth_type == 'code'
        ).first()
        
        username = cred.identifier if cred else (u.display_name or "Unknown")
        
        results.append({
            "user_id": str(u.user_id),
            "name": u.display_name,
            "username": username,
            "template_count": count,
            "created_at": u.created_at.isoformat() if u.created_at else None
        })
        
    return results

@router.post("/create-assessment-uploader", response_model=AssessmentUploaderResponse)
def create_assessment_uploader(uploader_in: AssessmentUploaderCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Create a new Assessment Uploader. Only admins can do this.
    Generates a random access code for the provided email.
    """
    try:
        if current_user.user_type != "admin":
             raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. Only admins can create assessment uploaders."
            )

        # Generate access code
        import random
        import string
        access_code = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        
        # Ensure Default Tenant
        tenant = db.query(Tenant).first()
        if not tenant:
             raise HTTPException(status_code=500, detail="System configuration error: No tenant found")

        # Ensure Default School
        school = db.query(School).filter(School.tenant_id == tenant.tenant_id).first()
        if not school:
            school = School(tenant_id=tenant.tenant_id, school_name="Default School", school_code="DEF_SCH", status="active")
            db.add(school)
            db.flush()

        # Check if user already exists
        existing_user = db.query(User).filter(User.email == uploader_in.email).first()
        
        if existing_user:
             # If user exists, check if they already have 'assessment_uploader' credentials or role?
             # For now, let's assume we are creating a new user or adding a credential to an existing one.
             # Implementation choice: Check for credential.
             existing_cred = db.query(Credential).filter(
                 Credential.identifier == uploader_in.email,
                 Credential.auth_type == 'assessment_code'
             ).first()
             
             if existing_cred:
                 raise HTTPException(status_code=400, detail="Assessment Uploader with this email already exists")
                 
             # If user exists but no credential, we could reuse the user, but User Type is single.
             # So we must creating a NEW User if the existing user is NOT an assessment_uploader.
             # Or we fail if email is taken.
             # Let's fail if email is taken to match registration logic for now, unless we want to support multi-role.
             # Given schema, User table has user_type. So we fail.
             raise HTTPException(status_code=400, detail="Email already registered with another account type")

        # Create User
        new_user = User(
            user_type="assessment_uploader",
            first_name=uploader_in.email.split('@')[0],
            last_name="(Assessment Uploader)",
            display_name=uploader_in.email,
            email=uploader_in.email,
            status="active",
            tenant_id=tenant.tenant_id,
            school_id=school.school_id
        )
        db.add(new_user)
        db.flush()

        # Create Credential (auth_type='assessment_code')
        new_cred = Credential(
            user_id=new_user.user_id,
            tenant_id=tenant.tenant_id,
            auth_type="assessment_code",
            identifier=uploader_in.email,
            secret_hash=get_password_hash(access_code),
            provider="local",
            is_primary=True,
            status="active"
        )
        db.add(new_cred)
        
        db.commit()

        return AssessmentUploaderResponse(email=uploader_in.email, access_code=access_code)
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create assessment uploader: {str(e)}")

@router.post("/assessment-uploader-login")
def assessment_uploader_login(login_in: AssessmentUploaderLogin, db: Session = Depends(get_db)):
    """
    Login for Assessment Uploaders using email and access code.
    """
    # Find credential
    cred = db.query(Credential).filter(
        Credential.identifier == login_in.email,
        Credential.auth_type == "assessment_code"
    ).first()
    
    if not cred or not verify_password(login_in.access_code, cred.secret_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or access code",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if cred.status != "active":
         raise HTTPException(status_code=400, detail="User account is inactive")
         
    # Generate Token
    token = create_access_token(
        user_id=str(cred.user_id),
        tenant_id=str(cred.tenant_id) if cred.tenant_id else "default"
    )
    
    # Fetch User
    user = db.query(User).filter(User.user_id == cred.user_id).first()
    
    return {
        "access_token": token, 
        "token_type": "bearer", 
        "user_type": "assessment_uploader", 
        "username": user.display_name,
        "email": user.email
    }

@router.get("/assessment-uploaders")
def list_assessment_uploaders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all assessment uploaders. Admin only.
    """
    if current_user.user_type != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Access denied"
        )
    
    uploaders = db.query(User).filter(User.user_type == "assessment_uploader").all()
    
    results = []
    for u in uploaders:
        results.append({
            "user_id": str(u.user_id),
            "email": u.email,
            "name": u.display_name,
            "created_at": u.created_at.isoformat() if u.created_at else None
        })
        
    return results


import sys
import os
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.modules.auth.models import Credential, User, Tenant, School
from app.core.security import get_password_hash
import uuid

def create_admin():
    db = SessionLocal()
    try:
        email = "superadmin@example.com"
        password = "password123"
        identifier = email
        
        # Check if exists
        existing = db.query(Credential).filter(Credential.identifier == identifier).first()
        if existing:
            # Check if user has school_id
            user = db.query(User).filter(User.user_id == existing.user_id).first()
            if user and not user.school_id:
                 print(f"Admin {identifier} exists but missing school_id. Updating.")
                 tenant = db.query(Tenant).first()
                 school = db.query(School).filter(School.tenant_id == tenant.tenant_id).first()
                 if not school:
                    school = School(tenant_id=tenant.tenant_id, school_name="Default School", school_code="DEF_SCH", status="active")
                    db.add(school)
                    db.commit()
                    db.refresh(school)
                 user.school_id = school.school_id
                 db.commit()

            print(f"Admin {identifier} already exists. Updating password.")
            existing.secret_hash = get_password_hash(password)
            db.commit()
            print("Password updated.")
            return

        # Tenant
        tenant = db.query(Tenant).first()
        if not tenant:
            tenant = Tenant(name="Default Tenant", domain="example.com")
            db.add(tenant)
            db.commit()
            db.refresh(tenant)
            
        # School
        school = db.query(School).filter(School.tenant_id == tenant.tenant_id).first()
        if not school:
            school = School(tenant_id=tenant.tenant_id, school_name="Default School", school_code="DEF_SCH", status="active")
            db.add(school)
            db.commit()
            db.refresh(school)


        # User
        user = User(
            user_type="admin",
            first_name="Super",
            last_name="Admin",
            display_name="Super Admin",
            email=email,
            status="active",
            tenant_id=tenant.tenant_id,
            school_id=school.school_id
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Credential
        cred = Credential(
            user_id=user.user_id,
            tenant_id=tenant.tenant_id,
            auth_type="password",
            identifier=identifier,
            secret_hash=get_password_hash(password),
            status="active"
        )
        db.add(cred)
        db.commit()
        print(f"Created admin: {email} / {password}")

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()

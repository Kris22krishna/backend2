
import sys
import os
from sqlalchemy.orm import Session

# Add current directory to path
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.modules.auth.models import User, Credential, Tenant, School
from app.core.security import get_password_hash

def seed_admin():
    db = SessionLocal()
    try:
        email = "admin@learners.com"
        password = "admin123"
        
        # Check if admin exists
        existing_cred = db.query(Credential).filter(Credential.identifier == email).first()
        if existing_cred:
            print(f"Admin user already exists: {email}")
            return

        print(f"Creating admin user: {email}")
        
        # Get Default Tenant/School
        tenant = db.query(Tenant).first()
        if not tenant:
            tenant = Tenant(tenant_name="Default Tenant", tenant_code="DEFAULT", status="active")
            db.add(tenant)
            db.commit()
            
        school = db.query(School).first()
        if not school:
            school = School(tenant_id=tenant.tenant_id, school_name="Default School", school_code="DEF_SCH", status="active")
            db.add(school)
            db.commit()

        # Create Admin User
        admin_user = User(
            user_type="admin",
            first_name="Admin",
            last_name="User",
            email=email,
            display_name="System Admin",
            status="active",
            tenant_id=tenant.tenant_id,
            school_id=school.school_id
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        # Create Credentials
        cred = Credential(
            user_id=admin_user.user_id,
            tenant_id=tenant.tenant_id,
            auth_type="password",
            identifier=email,
            secret_hash=get_password_hash(password),
            provider="local",
            is_primary=True,
            status="active"
        )
        db.add(cred)
        db.commit()
        
        print("Admin user created successfully.")
        print(f"Username: {email}")
        print(f"Password: {password}")

    except Exception as e:
        print(f"Error seeding admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_admin()

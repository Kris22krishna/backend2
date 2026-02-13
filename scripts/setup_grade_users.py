
from app.db.session import SessionLocal
from app.modules.auth.models import User, Credential
from app.modules.questions.models import QuestionGeneration
from app.core.security import get_password_hash

db = SessionLocal()

# Grade -> (OldName, NewName, Passcode)
GRADE_CRED_MAP = {
    1: ("Stanzin", "stanzin0351", "oR2MG5qx"),
    2: ("Abhinav", "abhinav5081", "PfA80yMh"),
    3: ("Sathwik", "sathwik8282", "xlGRSy0q"),
    4: ("R Ganadhitya", "rganadhitya3101", "UEy9NLfw"),
    5: ("Manasa Mukund", "manasamukund9080", "SofoObT0"),
    6: ("prasidh", "s.prasidhvel2519", "JXUFYLqU"),
    7: ("Pranav", "pranav4629", "xofvocyf"),
    8: ("B Naveen", "bnaveen6480", "02VnX3IE"),
    9: ("Devashri D Haware", "devashridhaware0719", "u8OonZOp"),
    10: ("inchara5011", "inchara5011", "AKaZcpXi")
}

try:
    for grade, (old_name, new_name, passcode) in GRADE_CRED_MAP.items():
        print(f"Processing Grade {grade} -> {new_name}")
        
        user_id = None
        
        # 1. Try to find by NEW identifier first
        cred = db.query(Credential).filter(Credential.identifier == new_name).first()
        
        if not cred:
            # 2. Try to find by OLD identifier
            cred = db.query(Credential).filter(Credential.identifier == old_name).first()
            if cred:
                print(f"  Found old user '{old_name}', updating to '{new_name}'...")
                cred.identifier = new_name
                # Update User display name too maybe?
        
        if cred:
            print(f"  Updating credentials for {new_name}...")
            cred.secret_hash = get_password_hash(passcode)
            cred.auth_type = "code" # Ensure code type for uploader login
            
            # Update User table details to match
            user = db.query(User).filter(User.user_id == cred.user_id).first()
            if user:
                user.display_name = new_name
                user.first_name = new_name
                # user.email = ... # Optional update
                db.add(user)
            
            db.add(cred)
            db.commit()
            user_id = cred.user_id
        else:
            print(f"  Creating NEW user '{new_name}'...")
            # Create User
            new_user = User(
                user_type="uploader",
                display_name=new_name,
                first_name=new_name,
                email=f"{new_name}@uploader.local",
                status="active",
                tenant_id="9769b4ab-351c-47e7-ae3e-c18790424d0d",
                school_id="b2af8e86-7363-4963-927a-8a58f7e7ddad"
            )
            db.add(new_user)
            db.flush() # get ID
            
            # Create Credential
            new_cred = Credential(
                user_id=new_user.user_id,
                auth_type="code",
                identifier=new_name,
                secret_hash=get_password_hash(passcode),
                provider="local",
                tenant_id="9769b4ab-351c-47e7-ae3e-c18790424d0d"
            )
            db.add(new_cred)
            db.commit()
            user_id = new_user.user_id
            
        print(f"  User ID: {user_id}")

        # Update Templates ownership
        templates_query = db.query(QuestionGeneration).filter(QuestionGeneration.grade == grade)
        count = templates_query.count()
        print(f"  Found {count} templates for Grade {grade}")
        
        if count > 0:
            updated = templates_query.update(
                {QuestionGeneration.created_by_user_id: user_id},
                synchronize_session=False
            )
            db.commit()
            print(f"  Assigned {updated} templates.")
        else:
            print(f"  No templates found.")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()


from app.db.session import SessionLocal
from app.modules.auth.models import Credential
from app.modules.questions.models import QuestionGeneration
from sqlalchemy import text

db = SessionLocal()
try:
    # 1. Get User ID for 'inchara5011'
    cred = db.query(Credential).filter(Credential.identifier == 'inchara5011').first()
    if not cred:
        print("User 'inchara5011' not found!")
    else:
        user_id = cred.user_id
        print(f"Found User ID: {user_id}")
        
        # 2. Update templates
        # Using raw SQL or ORM update
        # ORM is safer
        
        # Check count first
        count = db.query(QuestionGeneration).filter(QuestionGeneration.created_by_user_id == None).count()
        print(f"Found {count} orphaned templates.")
        
        if count > 0:
            db.query(QuestionGeneration).filter(QuestionGeneration.created_by_user_id == None).update(
                {QuestionGeneration.created_by_user_id: user_id},
                synchronize_session=False
            )
            db.commit()
            print("Successfully updated templates!")
        else:
            print("No templates needed updating.")
            
except Exception as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    db.close()

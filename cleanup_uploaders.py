
from app.db.session import SessionLocal
from app.modules.auth.models import User, Credential
from app.modules.questions.models import QuestionGeneration, QuestionTemplate

db = SessionLocal()

ALLOWED_USERNAMES = [
    "stanzin0351",
    "abhinav5081",
    "sathwik8282",
    "rganadhitya3101",
    "manasamukund9080",
    "s.prasidhvel2519",
    "pranav4629",
    "bnaveen6480",
    "devashridhaware0719",
    "inchara5011"
]

try:
    # Find all uploaders
    uploaders = db.query(User).filter(User.user_type == "uploader").all()
    
    deleted_count = 0
    
    for u in uploaders:
        # Get identifier
        cred = db.query(Credential).filter(Credential.user_id == u.user_id).first()
        username = cred.identifier if cred else u.display_name
        
        if username not in ALLOWED_USERNAMES:
            print(f"Deleting unused uploader: {username} (ID: {u.user_id})")
            
            # Check for templates (just for info)
            count = db.query(QuestionGeneration).filter(QuestionGeneration.created_by_user_id == u.user_id).count()
            if count > 0:
                print(f"  WARNING: Has {count} V2 templates! They will be orphaned.")
            
            # Delete Credential & User
            if cred:
                db.delete(cred)
            db.delete(u)
            deleted_count += 1
        else:
            print(f"Keeping valid uploader: {username}")
            
    db.commit()
    print(f"Deleted {deleted_count} users.")

except Exception as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    db.close()

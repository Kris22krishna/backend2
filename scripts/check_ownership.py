
from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration
from app.modules.auth.models import User
from sqlalchemy import func

db = SessionLocal()
try:
    results = db.query(
        QuestionGeneration.created_by_user_id, 
        func.count(QuestionGeneration.template_id)
    ).group_by(QuestionGeneration.created_by_user_id).all()
    
    print("Template Counts by Owner:")
    for user_id, count in results:
        if user_id:
            user = db.query(User).filter(User.user_id == user_id).first()
            name = user.display_name if user else "Unknown"
            print(f"  {name} (ID: {user_id}): {count}")
        else:
            print(f"  None (Unassigned): {count}")
            
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()

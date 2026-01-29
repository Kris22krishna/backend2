
from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration
from app.modules.auth.models import Credential

db = SessionLocal()
try:
    # Get Stanzin's ID
    stanzin = db.query(Credential).filter(Credential.identifier == 'Stanzin').first()
    if stanzin:
        print(f"Stanzin User ID: {stanzin.user_id}")
    else:
        print("Stanzin not found!")

    # Check Grade 1 templates
    templates = db.query(QuestionGeneration).filter(QuestionGeneration.grade == 1).all()
    print(f"Total Grade 1 Templates: {len(templates)}")
    
    for t in templates:
        print(f"Template ID: {t.template_id}, Owner: {t.created_by_user_id}")
        
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()

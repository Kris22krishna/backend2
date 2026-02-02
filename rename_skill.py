from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration

db = SessionLocal()

# Update name of our new template
t = db.query(QuestionGeneration).filter(QuestionGeneration.template_id == 1956).first()
if t:
    t.skill_name = "Place Value (New)"
    db.commit()
    print("Updated template 1956 name to 'Place Value (New)'")
else:
    print("Template 1956 not found")

db.close()

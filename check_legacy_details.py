from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration

db = SessionLocal()

ids = [272, 403]
templates = db.query(QuestionGeneration).filter(QuestionGeneration.template_id.in_(ids)).all()

for t in templates:
    print(f"ID: {t.template_id} | Skill ID: {t.skill_id} | Skill Name: '{t.skill_name}' | Type: {t.type}")

db.close()

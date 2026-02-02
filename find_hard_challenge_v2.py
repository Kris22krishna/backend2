from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration

db = SessionLocal()

templates = db.query(QuestionGeneration).filter(
    QuestionGeneration.question_template.ilike("%Hard Challenge%")
).all()

print(f"--- Found {len(templates)} templates ---")
for t in templates:
    print(f"ID: {t.template_id} | Skill: {t.skill_id} | Type: {t.type}")

db.close()

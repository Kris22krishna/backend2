from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration

db = SessionLocal()

# Search for "Hard Challenge" in question_template
templates = db.query(QuestionGeneration).filter(
    QuestionGeneration.question_template.ilike("%Hard Challenge%")
).all()

print(f"Found {len(templates)} templates with 'Hard Challenge'")
for t in templates:
    print(f"ID: {t.template_id}, Skill: {t.skill_id} ({t.skill_name}), Type: {t.type}")
    print("Code Snippet:")
    print(t.question_template[:200])

db.close()

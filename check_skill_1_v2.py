from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration

db = SessionLocal()

templates = db.query(QuestionGeneration).filter(QuestionGeneration.skill_id == 1).order_by(QuestionGeneration.template_id.desc()).all()

print(f"--- Templates for Skill 1 (Count: {len(templates)}) ---")
for t in templates:
    has_input = "inline-input" in t.question_template
    has_hard = "Hard Challenge" in t.question_template
    print(f"ID: {t.template_id} | Type: {t.type} | Hard: {has_hard} | Inline: {has_input}")

db.close()

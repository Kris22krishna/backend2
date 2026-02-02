from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration

db = SessionLocal()

templates = db.query(QuestionGeneration).filter(QuestionGeneration.skill_id == 1).order_by(QuestionGeneration.template_id.desc()).all()

print(f"--- Templates for Skill 1 ---")
for t in templates:
    print(f"ID: {t.template_id} | Type: {t.type} | Created: {t.created_at}")
    has_input = "inline-input" in t.question_template
    has_hard = "Hard Challenge" in t.question_template
    print(f"   -> Has 'inline-input': {has_input} | Has 'Hard Challenge': {has_hard}")

db.close()

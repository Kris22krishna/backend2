from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration

db = SessionLocal()

print("--- Checking Active Templates (Skill 1) ---")
active = db.query(QuestionGeneration).filter(QuestionGeneration.skill_id == 1).all()
for t in active:
    print(f"ID: {t.template_id} | Type: {t.type} | Hard Challenge? {'Hard Challenge' in t.question_template}")

print("\n--- Checking Trash Templates (Skill -1) ---")
trash = db.query(QuestionGeneration).filter(QuestionGeneration.skill_id == -1).all()
for t in trash:
    print(f"ID: {t.template_id} | Original Type: {t.type} | Hard Challenge? {'Hard Challenge' in t.question_template}")

db.close()

from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration

db = SessionLocal()

active = db.query(QuestionGeneration).filter(QuestionGeneration.skill_id == 1).all()
trash = db.query(QuestionGeneration).filter(QuestionGeneration.skill_id == -1).all()

print(f"Active Count: {len(active)}")
for t in active:
    has_hard = "Hard Challenge" in t.question_template
    print(f"ACTIVE -> ID: {t.template_id} [Hard: {has_hard}]")

print(f"\nTrash Count: {len(trash)}")
for t in trash:
    if "Hard Challenge" in t.question_template:
        print(f"TRASH -> ID: {t.template_id} [Hard: True]")

db.close()

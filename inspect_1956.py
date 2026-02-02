from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration

db = SessionLocal()

def inspect(tid):
    t = db.query(QuestionGeneration).filter(QuestionGeneration.template_id == tid).first()
    if not t:
        print(f"Template {tid} NOT FOUND")
        return
    
    print(f"\n=== TEMPLATE {tid} ===")
    print(f"Skill ID: {t.skill_id}")
    print(f"Skill Name: {t.skill_name}")
    print(f"Question Template Code:")
    print("--------------------------------------------------")
    print(t.question_template)
    print("--------------------------------------------------")
    if "Hard Challenge" in t.question_template:
        print("!!! ALERT: Contains 'Hard Challenge' !!!")
    if "inline-input" in t.question_template:
        print(">>> CONFIRMED: Contains 'inline-input'")

inspect(1956)
inspect(272)

db.close()

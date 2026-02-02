from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration

db = SessionLocal()

tid = 1956
t = db.query(QuestionGeneration).filter(QuestionGeneration.template_id == tid).first()
print(f"Checking Template {tid}...")
if "Hard Challenge" in t.question_template:
    print("STATUS: BAD - Contains 'Hard Challenge'")
elif "inline-input" in t.question_template:
    print("STATUS: GOOD - Contains 'inline-input'")
else:
    print("STATUS: UNKNOWN CONTENT")

print("Snippet:")
print(t.question_template[:300])

db.close()

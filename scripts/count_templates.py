
from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration

db = SessionLocal()
try:
    for g in range(1, 13):
        count = db.query(QuestionGeneration).filter(QuestionGeneration.grade == g).count()
        print(f"Grade {g} Templates in question_generation: {count}")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()

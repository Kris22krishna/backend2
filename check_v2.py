from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration
from sqlalchemy import func

def check_v2_templates():
    db = SessionLocal()
    try:
        # Check QuestionGeneration table
        total = db.query(QuestionGeneration).count()
        print(f"Total V2 Templates (QuestionGeneration): {total}")
        
        grade = 5
        # grade column in QuestionGeneration is Integer, not Array
        g5_count = db.query(QuestionGeneration).filter(QuestionGeneration.grade == grade).count()
        print(f"Grade 5 V2 Templates: {g5_count}")
        
        if g5_count > 0:
            examples = db.query(QuestionGeneration).filter(QuestionGeneration.grade == grade).limit(5).all()
            for t in examples:
                print(f"ID: {t.template_id} | Skill: {t.skill_name} | Difficulty: {t.difficulty}")

    finally:
        db.close()

if __name__ == "__main__":
    check_v2_templates()

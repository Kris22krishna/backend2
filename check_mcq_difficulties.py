import sys
import os
from sqlalchemy.orm import Session
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)
from app.db.session import SessionLocal
from app.modules.questions.models import QuestionTemplate, QuestionGeneration
from app.modules.auth.models import User

def check_all_mcqs(grade):
    db = SessionLocal()
    print(f"\n--- MCQs for Grade {grade} ---")
    
    # Check V2
    v2_diffs = db.query(QuestionGeneration.difficulty, QuestionGeneration.type).filter(
        QuestionGeneration.grade == grade,
        QuestionGeneration.type == 'mcq'
    ).all()
    print(f"V2 MCQs: {len(v2_diffs)}")
    for d, t in v2_diffs:
        print(f"  - Difficulty: {d}")
        
    # Check V1
    v1_diffs = db.query(QuestionTemplate.difficulty, QuestionTemplate.type).filter(
        QuestionTemplate.grade_level.any(grade),
        QuestionTemplate.type == 'mcq'
    ).all()
    print(f"V1 MCQs: {len(v1_diffs)}")
    for d, t in v1_diffs:
        print(f"  - Difficulty: {d}")
    
    db.close()

if __name__ == "__main__":
    check_all_mcqs(4)

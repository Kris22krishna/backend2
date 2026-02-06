import sys
import os
from sqlalchemy.orm import Session

# Add the backend2 directory to the path so we can import 'app'
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from app.db.session import SessionLocal
# Import all models to ensure relationships are initialized
from app.modules.assessment_integration.models import AssessmentStudent, AssessmentSession, AssessmentSessionQuestion
from app.modules.questions.models import QuestionTemplate, QuestionGeneration
from app.modules.auth.models import User

def verify_grade(grade_num):
    print(f"\n--- Verifying Grade {grade_num} ---")
    db = SessionLocal()
    try:
        # 1. Target counts
        if grade_num <= 5:
            target_mcq = 18
            target_input = 7
        elif grade_num <= 8:
            target_mcq = 13
            target_input = 12
        else:
            target_mcq = 10
            target_input = 15
            
        print(f"Target: MCQ={target_mcq}, Input={target_input}")

        # 2. Fetch templates (logic mimicked from router.py)
        v2_easy = db.query(QuestionGeneration).filter(
            QuestionGeneration.grade == grade_num,
            QuestionGeneration.difficulty.ilike('%easy%')
        ).all()
        
        v1_easy = db.query(QuestionTemplate).filter(
            QuestionTemplate.status == "active",
            QuestionTemplate.grade_level.any(grade_num),
            QuestionTemplate.difficulty.ilike('%easy%')
        ).all()
        
        # Categorize
        mcq_count = 0
        input_count = 0
        
        for t in v2_easy:
            if t.type.lower() == 'mcq': mcq_count += 1
            else: input_count += 1
        for t in v1_easy:
            if t.type.lower() == 'mcq': mcq_count += 1
            else: input_count += 1
            
        print(f"Available Easy Candidates: MCQ={mcq_count}, Input={input_count}")
        
    except Exception as e:
        print(f"Error checking grade {grade_num}: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    for g in [4, 7, 10]:
        verify_grade(g)

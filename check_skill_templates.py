import os
import sys

# Add parent directory to sys.path to import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration

def check_templates():
    db = SessionLocal()
    try:
        # Check v2 templates
        v2_templates = db.query(QuestionGeneration).filter(QuestionGeneration.skill_id == 1).all()
        print(f"V2 Templates for skill_id=1: {len(v2_templates)}")
        for t in v2_templates:
            print(f"  - ID: {t.template_id}, Name: {t.skill_name}, Grade: {t.grade}, Type: {t.type}")
            
        # Also check all v2 templates to see what skill_ids are available
        all_v2 = db.query(QuestionGeneration).limit(10).all()
        print(f"\nSample of all V2 Templates:")
        for t in all_v2:
            print(f"  - ID: {t.template_id}, Skill ID: {t.skill_id}, Name: {t.skill_name}")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_templates()

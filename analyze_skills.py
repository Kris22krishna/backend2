from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.modules.questions.models import QuestionTemplate
from sqlalchemy import func

def analyze_skills():
    db = SessionLocal()
    try:
        # Get all active templates first
        templates = db.query(QuestionTemplate).all()
        
        print(f"Total Templates: {len(templates)}")
        
        skills_map = {}
        grade_5_templates = []
        
        for t in templates:
            print(f"ID: {t.template_id} | Status: {t.status} | Topic: {t.topic} | Grade: {t.grade_level}")
            if 5 in t.grade_level:
                grade_5_templates.append(t)
                
        print(f"\nTotal Grade 5 Templates: {len(grade_5_templates)}")
        topics = set([t.topic for t in grade_5_templates])
        print(f"Unique Topics for Grade 5: {topics}")
        
    finally:
        db.close()

if __name__ == "__main__":
    analyze_skills()

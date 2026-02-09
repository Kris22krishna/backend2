
import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Add parent dir to path to import models
sys.path.append(os.getcwd())

from app.modules.questions.models import QuestionGeneration
from app.db.session import SessionLocal

def check_junior_templates():
    db = SessionLocal()
    try:
        # Check Grade 1-4 templates
        templates = db.query(QuestionGeneration).filter(
            QuestionGeneration.grade.in_([1, 2, 3, 4])
        ).all()
        
        print(f"Found {len(templates)} templates for Grades 1-4")
        
        skill_stats = {}
        for t in templates:
            if t.skill_id not in skill_stats:
                skill_stats[t.skill_id] = {"name": t.skill_name, "types": set()}
            skill_stats[t.skill_id]["types"].add(t.type)
            
        print("\nSkill-wise types:")
        for sid, stats in skill_stats.items():
            print(f"Skill {sid} ({stats['name']}): {stats['types']}")
            
        # Check if any have ONLY User Input
        only_ui = [f"{stats['name']} (ID: {sid})" for sid, stats in skill_stats.items() if len(stats['types']) == 1 and list(stats['types'])[0].lower() == 'user input']
        if only_ui:
            print("\nSkills with ONLY User Input:")
            for s in only_ui:
                print(f" - {s}")
        else:
            print("\nAll skills have MCQ or other types available.")
            
    finally:
        db.close()

if __name__ == "__main__":
    check_junior_templates()

import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the current directory to sys.path to allow imports from app
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Now try importing from app
from app.modules.skills.models import Skill
from app.core.config import settings

def insert_skills():
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    new_skills_data = [
        # Grade 8
        {"grade": 8, "topic": "Exponents and Power", "skill_name": "Powers with Negative Exponents"},
        {"grade": 8, "topic": "Exponents and Power", "skill_name": "Laws of Exponents"},
        {"grade": 8, "topic": "Exponents and Power", "skill_name": "Use of Exponents to Express Small Numbers in Standard Form"},
        {"grade": 8, "topic": "Exponents and Power", "skill_name": "Comparing very large and very small Numbers"},
        # Grade 9
        {"grade": 9, "topic": "Linear Equation in Two Variables", "skill_name": "Linear equation"},
        {"grade": 9, "topic": "Linear Equation in Two Variables", "skill_name": "Solution of a linear equation"},
    ]
    
    inserted_ids = []
    
    try:
        print("Inserting skills...")
        for skill_info in new_skills_data:
            # Check if skill already exists to avoid duplicates
            existing = db.query(Skill).filter(
                Skill.grade == skill_info["grade"],
                Skill.topic == skill_info["topic"],
                Skill.skill_name == skill_info["skill_name"]
            ).first()
            
            if not existing:
                skill = Skill(**skill_info)
                db.add(skill)
                db.flush() # To get the skill_id before commit
                inserted_ids.append(skill.skill_id)
                print(f"Added: {skill_info['skill_name']} (Grade {skill_info['grade']})")
            else:
                inserted_ids.append(existing.skill_id)
                print(f"Skipped (exists): {skill_info['skill_name']} (Grade {skill_info['grade']})")
                
        db.commit()
        print("\nAll skills processed successfully.")
        print("Final List of Skill IDs:")
        for i, skill_info in enumerate(new_skills_data):
            print(f"Grade {skill_info['grade']} | {skill_info['topic']} | {skill_info['skill_name']} -> ID: {inserted_ids[i]}")
            
    except Exception as e:
        print(f"Error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    insert_skills()

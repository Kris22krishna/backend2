import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the project root to sys.path to allow imports from app
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from app.modules.skills.models import Skill
from app.core.config import settings

def insert_skills():
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    new_skills_data = [
        # Class 5th
        {"grade": 5, "topic": "Parts and wholes", "skill_name": "Our flag"},
        {"grade": 5, "topic": "Parts and wholes", "skill_name": "Magic top"},
        {"grade": 5, "topic": "Parts and wholes", "skill_name": "Greedy gatekeepers"},
        {"grade": 5, "topic": "Parts and wholes", "skill_name": "Patterns in parts"},
        {"grade": 5, "topic": "Parts and wholes", "skill_name": "Ramu's Vegetable field"},
        {"grade": 5, "topic": "Parts and wholes", "skill_name": "Cutting the Halwa"},
        {"grade": 5, "topic": "Parts and wholes", "skill_name": "Rupees and Paise"},
        {"grade": 5, "topic": "Parts and wholes", "skill_name": "An old woman's will"},
        {"grade": 5, "topic": "Parts and wholes", "skill_name": "School Magazine"},
        {"grade": 5, "topic": "Parts and wholes", "skill_name": "Sleeping Beauty"},
        {"grade": 5, "topic": "Parts and wholes", "skill_name": "Keerti's Shopping List"},

        # Class 4th
        {"grade": 4, "topic": "The Cleanest Village", "skill_name": "Daisy and Lou go Shopping(2 digit with 1 digit addition and subtraction- word problems)"},
        {"grade": 4, "topic": "The Cleanest Village", "skill_name": "A strange puzzle(2 digit with 1 digit addition and subtraction- word problems)"},
        {"grade": 4, "topic": "The Cleanest Village", "skill_name": "Let us Play( Triangle addition- word problems)"},
        {"grade": 4, "topic": "The Cleanest Village", "skill_name": "Add up(2 digit to 2 digit addition- word problems)"},
        {"grade": 4, "topic": "The Cleanest Village", "skill_name": "Let us do pt-1( 3 digit to 2 digit addition- word problems)"},
        {"grade": 4, "topic": "The Cleanest Village", "skill_name": "Subtract it(2 digit to 2 digit subtraction- word problems)"},
        {"grade": 4, "topic": "The Cleanest Village", "skill_name": "Let us solve( 3 digit to 3 digit addition and subtraction- word problems)"},
        {"grade": 4, "topic": "The Cleanest Village", "skill_name": "Number pair hunt( Box addition)"},
        {"grade": 4, "topic": "The Cleanest Village", "skill_name": "Missing Digits(Missing digits)"},
        {"grade": 4, "topic": "The Cleanest Village", "skill_name": "Let us do pt-2(3 digit to 3 digit addition and subtraction)"},
    ]
    
    try:
        print("Inserting skills...")
        inserted_skills = []
        for skill_info in new_skills_data:
            existing = db.query(Skill).filter(
                Skill.grade == skill_info["grade"],
                Skill.topic == skill_info["topic"],
                Skill.skill_name == skill_info["skill_name"]
            ).first()
            
            if not existing:
                skill = Skill(**skill_info)
                db.add(skill)
                db.flush() # Flush to get the ID
                print(f"Added: {skill_info['skill_name']} (Grade {skill_info['grade']}) -> ID: {skill.skill_id}")
                inserted_skills.append(skill)
            else:
                print(f"Skipped (exists): {skill_info['skill_name']} (Grade {skill_info['grade']}) -> ID: {existing.skill_id}")
                inserted_skills.append(existing)
                
        db.commit()
        print("\nAll skills processed successfully.")
        
        print("\n--- NEW SKILL SUMMARY ---")
        for s in inserted_skills:
            print(f"ID: {s.skill_id} | Grade: {s.grade} | Topic: {s.topic} | Skill: {s.skill_name}")
            
    except Exception as e:
        print(f"Error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    insert_skills()

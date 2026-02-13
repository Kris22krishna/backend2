from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os

# Add the app directory to sys.path
sys.path.append(os.path.join(os.getcwd(), 'app'))

from app.modules.skills.models import Skill
from app.core.config import settings

def check_skills():
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        print("--- Existing Skills for Grade 8 ---")
        g8_skills = db.query(Skill).filter(Skill.grade == 8).all()
        for s in g8_skills:
            print(f"ID: {s.skill_id} | Topic: {s.topic} | Name: {s.skill_name}")
            
        print("\n--- Existing Skills for Grade 9 ---")
        g9_skills = db.query(Skill).filter(Skill.grade == 9).all()
        for s in g9_skills:
            print(f"ID: {s.skill_id} | Topic: {s.topic} | Name: {s.skill_name}")
            
    finally:
        db.close()

if __name__ == "__main__":
    check_skills()

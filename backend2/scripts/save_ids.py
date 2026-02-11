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

def save_ids():
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    topics = ["Parts and wholes", "The Cleanest Village"]
    
    try:
        skills = db.query(Skill).filter(Skill.topic.in_(topics)).order_by(Skill.grade.desc(), Skill.skill_id.asc()).all()
        with open('skill_ids_output.txt', 'w') as f:
            for s in skills:
                f.write(f"ID: {s.skill_id} | Grade: {s.grade} | Topic: {s.topic} | Skill: {s.skill_name}\n")
        print("Written to skill_ids_output.txt")
    finally:
        db.close()

if __name__ == "__main__":
    save_ids()

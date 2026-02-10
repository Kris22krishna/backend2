import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the current directory to sys.path to allow imports from app
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from app.modules.skills.models import Skill
from app.core.config import settings

def get_ids():
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    topics = [
        "Exponents and Power", 
        "Linear Equation in Two Variables",
        "Pair of Linear Equations in Two Variables",
        "Exponents and Powers",
        "FRACTION",
        "Ways to Multiply and Divide"
    ]
    
    try:
        skills = db.query(Skill).filter(Skill.topic.in_(topics)).all()
        output_file = os.path.join(os.path.dirname(__file__), 'skill_ids.txt')
        with open(output_file, 'w') as f:
            f.write("--- NEW SKILL IDs ---\n")
            for s in skills:
                line = f"ID: {s.skill_id} | Grade: {s.grade} | Topic: {s.topic} | Skill: {s.skill_name}\n"
                f.write(line)
                print(line.strip())
        print(f"\nSaved to {output_file}")
    finally:
        db.close()

if __name__ == "__main__":
    get_ids()

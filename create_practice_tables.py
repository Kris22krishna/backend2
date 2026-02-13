import sys
import os

# Add parent dir to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import engine
from app.db.base import Base

# Import dependencies first to ensure they are registered
from app.modules.auth.models import V2User, V2Student, V2Parent, V2Mentor
from app.modules.practice.models import PracticeSession, QuestionAttempt, UserSkillProgress

if __name__ == "__main__":
    print("Creating tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("Tables created successfully.")
    except Exception as e:
        print(f"Error creating tables: {e}")

import sys
import os

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.session import SessionLocal
from app.modules.auth.models import V2Student, V2Mentorship

def map_students_to_mentor(mentor_id: int):
    db = SessionLocal()
    try:
        # Get all students
        students = db.query(V2Student).all()
        print(f"Found {len(students)} students.")

        count = 0
        for student in students:
            # Check if assignment exists
            exists = db.query(V2Mentorship).filter(
                V2Mentorship.student_id == student.user_id,
                V2Mentorship.mentor_id == mentor_id
            ).first()
            
            if not exists:
                new_assignment = V2Mentorship(
                    mentor_id=mentor_id,
                    student_id=student.user_id
                )
                db.add(new_assignment)
                count += 1
        
        db.commit()
        print(f"Successfully mapped {count} students to mentor {mentor_id}.")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    map_students_to_mentor(360)

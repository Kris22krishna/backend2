from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from app.db.session import SessionLocal
from app.modules.assessment_integration.models import AssessmentStudent, AssessmentSession
from app.modules.assessment_integration.schemas import AssessmentSessionResponse
from datetime import datetime
import json

# Mock the router function logic since we can't easily call it directly due to Depends
# We will just import the code block or logic if possible, or replicate the key part: fetching templates.
# Actually, let's just create a student and test the DB logic directly.

def test_diversity():
    db = SessionLocal()
    try:
        # 1. Find or Create a Test Student
        student = db.query(AssessmentStudent).filter(AssessmentStudent.serial_number == "TEST_DIV_001").first()
        if not student:
            print("Creating test student...")
            student = AssessmentStudent(
                serial_number="TEST_DIV_001",
                name="Diversity Tester",
                grade="Grade 5",
                school_name="Test School",
                uploaded_by_user_id="00000000-0000-0000-0000-000000000000" # Placeholder UUID if FK requires it, usually need real user
            )
            # Need a valid user ID for uploaded_by. Let's pick first user.
            from app.modules.auth.models import User
            user = db.query(User).first()
            if user:
                student.uploaded_by_user_id = user.user_id
                db.add(student)
                db.commit()
            else:
                print("No users found to link student. Aborting.")
                return

        # 2. Clear previous sessions
        db.query(AssessmentSession).filter(AssessmentSession.student_id == student.id).delete()
        db.commit()
        
        print(f"Starting test for Student: {student.name}, Grade: {student.grade}")
        
        # 3. Simulate Router Logic (Copy-Paste / Import check)
        # We'll just replicate the gathering logic to see what pool we get
        
        grade_level = 5
        
        # V2
        from app.modules.questions.models import QuestionGeneration, QuestionTemplate
        v2_all = db.query(QuestionGeneration).filter(QuestionGeneration.grade == grade_level).all()
        print(f"V2 Templates Found: {len(v2_all)}")
        
        # V1
        v1_all = db.query(QuestionTemplate).filter(QuestionTemplate.status == "active", QuestionTemplate.grade_level.any(grade_level)).all()
        print(f"V1 Templates Found: {len(v1_all)}")
        
        # Diversity Logic Check
        v2_hard = [t for t in v2_all if 'hard' in t.difficulty.lower()]
        v2_med = [t for t in v2_all if 'medium' in t.difficulty.lower()]
        v2_easy = [t for t in v2_all if 'easy' in t.difficulty.lower()]
        
        v1_hard = [t for t in v1_all if 'hard' in t.difficulty.lower()]
        v1_med = [t for t in v1_all if 'medium' in t.difficulty.lower()]
        
        pool = []
        pool.extend(v2_hard)
        pool.extend(v1_hard)
        pool.extend(v2_med)
        pool.extend(v1_med)
        
        print(f"Initial Pool Size (Hard+Med): {len(pool)}")
        
        topics = set()
        for t in v2_all:
            topics.add(t.skill_name)
        for t in v1_all:
            topics.add(t.topic)
            
        print(f"Unique Topics Available: {len(topics)}")
        print(f"Topics: {list(topics)[:10]}...") # Show sample
        
    finally:
        db.close()

if __name__ == "__main__":
    test_diversity()

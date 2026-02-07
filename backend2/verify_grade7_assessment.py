import sys
import os
import uuid

# Ensure current directory is in sys.path
sys.path.append(os.getcwd())

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.modules.assessment_integration.models import AssessmentStudent, AssessmentSession
from app.modules.assessment_integration.grade7_blueprint import GRADE_7_TEMPLATE_IDS
from app.modules.assessment_integration.router import start_assessment

def verify_grade7():
    print("Setting up DB connection...")
    engine = create_engine(settings.DATABASE_URL)
    Session = sessionmaker(bind=engine)
    db = Session()

    try:
        # 1. Create Dummy Student (Grade 7)
        student_id = uuid.uuid4()
        # Ensure we have a valid uploader ID. I'll pick one from DB or just insert a dummy user if needed.
        # Actually AssessmentStudent needs uploader_id which is a foreign key to Users.
        # Let's try to find an existing user first.
        from app.modules.auth.models import User
        uploader = db.query(User).filter(User.user_type == 'uploader').first()
        if not uploader:
            # Try admin
            uploader = db.query(User).first()
            
        if not uploader:
            print("No user found to link student. Please seed a user first.")
            return

        student = AssessmentStudent(
            id=student_id,
            serial_number=f"TEST-G7-{uuid.uuid4().hex[:6]}",
            name="Test Student Grade 7",
            grade="Grade 7",
            school_name="Test School",
            uploaded_by_user_id=uploader.user_id
        )
        db.add(student)
        db.commit()
        print(f"Created test student: {student.serial_number}")

        # 2. Run Start Assessment
        print("Starting Assessment...")
        response = start_assessment(student=student, db=db)
        
        # 3. Verify Response
        questions = response['questions']
        print(f"Generated {len(questions)} questions.")
        
        generated_ids = [q.template_id for q in questions]
        
        # Check Count
        if len(questions) != 25:
            print(f"FAILED: Expected 25 questions, got {len(questions)}")
        else:
            print("SUCCESS: Count is 25")
            
        # Check IDs
        blueprint_set = set(GRADE_7_TEMPLATE_IDS)
        generated_set = set(generated_ids)
        
        missing = blueprint_set - generated_set
        extra = generated_set - blueprint_set
        
        if not missing and not extra:
            print("SUCCESS: Generated questions match the 25 blueprint templates exactly.")
        else:
            print("FAILED: IDs do not match exact blueprint.")
            if missing: print(f"Missing IDs: {missing}")
            if extra: print(f"Extra IDs: {extra}")

        # debug output
        print("\n--- SAMPLE QUESTIONS ---")
        for i, q in enumerate(questions[:5]):
             print(f"\nQ{i+1} (Template {q.template_id}):")
             print(f"HTML: {q.question_html}")
             print(f"Options: {q.options}")
             print("-" * 20)

        # Cleanup
        # db.delete(student) # Keep for inspection? or delete.
        # db.commit()

        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    verify_grade7()

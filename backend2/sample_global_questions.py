import sys
import os
import uuid
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.modules.auth.models import User
from app.modules.student.models import Student
from app.modules.questions.models import QuestionTemplate, QuestionGeneration
from app.db.base import Base

sys.path.append(os.getcwd())

def sample_global_questions():
    print("Setting up DB connection...")
    engine = create_engine(settings.DATABASE_URL)
    Session = sessionmaker(bind=engine)
    db = Session()

    grades_to_check = [6, 8] # Sample a lower and higher grade
    
    try:
        for grade in grades_to_check:
            print(f"\n--- Checking Grade {grade} ---")
            
            # 1. Create Dummy User
            user_id = uuid.uuid4()
            tenant_id = uuid.uuid4()
            school_id = uuid.uuid4()
            
            user_email = f"test_student_g{grade}_{user_id.hex[:6]}@example.com"
            user = db.query(User).filter(User.email == user_email).first()
            if not user:
                user = User(
                    user_id=user_id,
                    email=user_email,
                    user_type="student",
                    tenant_id=tenant_id,      # Try providing these
                    school_id=school_id,      # Try providing these
                    first_name="Test",
                    last_name=f"Student G{grade}",
                    display_name=f"Test Student G{grade}",
                    status="active"
                )
                try:
                    db.add(user)
                    db.commit()
                    db.refresh(user)
                except Exception as e:
                    db.rollback()
                    print(f"Error creating User: {e}")
                    raise e
            
            # 2. Create Dummy Student Profile
            student = db.query(Student).filter(Student.user_id == user.user_id).first()
            if not student:
                student = Student(
                    user_id=user.user_id,
                    tenant_id=user.tenant_id, # Match User's tenant
                    school_id=user.school_id, # Match User's school
                    grade=str(grade),
                    section="A",
                    admission_number=f"ADM-G{grade}-{uuid.uuid4().hex[:4]}"
                )
                try:
                    db.add(student)
                    db.commit()
                except Exception as e:
                    db.rollback()
                    print(f"Error creating Student: {e}")
                    raise e
            
            # Fetch templates
            print(f"Fetching templates for Grade {grade}...")
            
            # Try specific grade match (int or array)
            # Since we can't easily do .any() without model definition confirmation, 
            # we'll fetch larger set and filter in Python for safety in this script
            templates = db.query(QuestionTemplate).limit(100).all()
            
            grade_templates = []
            for t in templates:
                if t.grade_level == grade or (isinstance(t.grade_level, list) and grade in t.grade_level):
                    grade_templates.append(t)
            
            # Limit to 5
            grade_templates = grade_templates[:5]

            if not grade_templates:
                print(f"WARNING: No templates found for Grade {grade}")
                continue
                    
            print(f"Found {len(grade_templates)} templates. Generating previews...")
                
            for t in grade_templates:
                print(f"\nTemplate ID: {t.template_id} (Type: {t.type})")
                try:
                    from app.modules.questions.executor import executor
                    result = executor.execute_generator(t.dynamic_question)
                    
                    if not result:
                        print("FAILED: Generator execution returned None")
                        continue
                        
                    q_html = result.get("question", "MISSING")
                    options = result.get("options", [])
                    
                    print(f"Question HTML: {str(q_html)[:100]}...")
                    print(f"Options: {options}")
                    
                    if not q_html or q_html == "MISSING":
                        print("ISSUE: Question HTML is empty/missing")
                    if not options and t.type == "MCQ":
                        print("ISSUE: Options missing for MCQ")
                    
                    if options:
                        for idx, opt in enumerate(options):
                            if not opt or str(opt).strip() == "":
                                    print(f"ISSUE: Option {idx} is empty")
                        
                except Exception as e:
                    print(f"ERROR generating question for TID {t.template_id}: {e}")
                
    except Exception as e:
        print(f"Global Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    sample_global_questions()

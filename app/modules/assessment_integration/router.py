from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_current_user
from app.modules.auth.models import User
from app.modules.assessment_integration.models import AssessmentStudent
from app.modules.assessment_integration.schemas import AssessmentStudentSchema, AssessmentAccessLogin
from app.core.security import create_access_token, oauth2_scheme, decode_token
from datetime import datetime
import openpyxl
from io import BytesIO
import random
import json
from uuid import UUID
from app.modules.questions.models import QuestionTemplate
from app.modules.questions.executor import executor
from app.modules.assessment_integration.models import AssessmentSession, AssessmentSessionQuestion, AssessmentStudent
from app.modules.assessment_integration.schemas import AssessmentSessionResponse, AssessmentQuestionResponse

router = APIRouter(prefix="/assessment-integration", tags=["assessment-integration"])

def get_current_student(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    student_id_str: str = payload.get("sub")
    if student_id_str is None:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    try:
        student_id = UUID(student_id_str)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid user ID")

    student = db.query(AssessmentStudent).filter(AssessmentStudent.id == student_id).first()
    if not student:
        raise HTTPException(status_code=401, detail="Student not found")
    return student

@router.post("/upload-students")
async def upload_students(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload Excel file with student details.
    Expected columns: Serial Number, Student Name, Grade, School Name, Phone Number
    """
    # Verify user is uploader or admin
    if current_user.user_type not in ["uploader", "admin", "assessment_uploader"]:
         raise HTTPException(status_code=403, detail="Access denied")

    if not file.filename.endswith('.xlsx'):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload .xlsx file")

    try:
        contents = await file.read()
        workbook = openpyxl.load_workbook(filename=BytesIO(contents))
        sheet = workbook.active
        
        # Iterate rows
        rows = list(sheet.iter_rows(values_only=True))
        if not rows:
             raise HTTPException(status_code=400, detail="Empty file")
             
        # Extract headers (assuming first row)
        headers = [str(h).lower().strip() if h else '' for h in rows[0]]
        
        # Map columns
        try:
            idx_serial = headers.index('serial number')
            idx_name = headers.index('student name')
            idx_grade = headers.index('grade')
            idx_school = headers.index('school name')
            idx_phone = headers.index('phone number')
        except ValueError as e:
             raise HTTPException(status_code=400, detail=f"Missing required column: {str(e)}")

        uploaded_count = 0
        errors = []
        
        for i, row in enumerate(rows[1:], start=2): # Start from row 2
            try:
                serial = str(row[idx_serial]).strip() if row[idx_serial] else None
                name = str(row[idx_name]).strip() if row[idx_name] else None
                grade = str(row[idx_grade]).strip() if row[idx_grade] else None
                school = str(row[idx_school]).strip() if row[idx_school] else None
                phone = str(row[idx_phone]).strip() if row[idx_phone] else None
                
                if not serial or not name or not grade or not school:
                    continue # Skip empty rows
                
                # Check for duplicate serial number
                existing = db.query(AssessmentStudent).filter(AssessmentStudent.serial_number == serial).first()
                if existing:
                    # Update or Skip? Let's Skip for now and report
                    errors.append(f"Row {i}: Serial Number {serial} already exists.")
                    continue
                
                new_student = AssessmentStudent(
                    serial_number=serial,
                    name=name,
                    grade=grade,
                    school_name=school,
                    phone_number=phone,
                    uploaded_by_user_id=current_user.user_id
                )
                db.add(new_student)
                uploaded_count += 1
            except Exception as e:
                errors.append(f"Row {i}: {str(e)}")
        
        db.commit()
        
        return {
            "success": True,
            "data": {
                "uploaded_count": uploaded_count,
                "errors": errors
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")

@router.get("/uploaded-students", response_model=list[AssessmentStudentSchema])
def get_uploaded_students(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List students uploaded by the current user.
    """
    students = db.query(AssessmentStudent).filter(
        AssessmentStudent.uploaded_by_user_id == current_user.user_id
    ).all()
    return students

@router.post("/student-access")
def student_access(
    login_in: AssessmentAccessLogin,
    db: Session = Depends(get_db)
):
    """
    Login using Serial Number. Returns a temporary token.
    """
    student = db.query(AssessmentStudent).filter(
        AssessmentStudent.serial_number == login_in.serial_number
    ).first()
    
    if not student:
        raise HTTPException(status_code=401, detail="Invalid Serial Number")
        
    # Generate a token with student specifics
    # We might need a generic user_id or a special type in token
    # For now, let's create a token with a special subject prefix or just the ID
    
    token = create_access_token(
        user_id=str(student.id),
        tenant_id=str(student.uploader.tenant_id)
    )
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "student_name": student.name,
        "grade": student.grade,
        "school_name": student.school_name,
        "serial_number": student.serial_number
    }

@router.post("/start-assessment", response_model=AssessmentSessionResponse)
def start_assessment(
    student: AssessmentStudent = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Start a new assessment session for the student.
    Generates 25 'Hard' questions for the student's grade.
    """
    
    # 1. Check for existing active session
    # For simplicity, if they have a pending session, return that.
    active_session = db.query(AssessmentSession).filter(
        AssessmentSession.student_id == student.id,
        AssessmentSession.status.in_(["PENDING", "IN_PROGRESS"])
    ).first()
    
    if active_session:
        # Fetch questions with topic from template
        # We join to get the topic. 
        # Since we need to return AssessmentQuestionResponse, we can construct the dicts or objects.
        # SQLAlchemy won't return AssessmentSessionQuestion objects if we select specific columns, it returns tuples.
        # But we can assume the relationship exists if we defined it? 
        # The model AssessmentSessionQuestion doesn't have a relationship to QuestionTemplate defined in models.py (it has template_id col but no relationship).
        # We'll do a join and manual construction.
        
        results = db.query(AssessmentSessionQuestion, QuestionTemplate.topic)\
            .join(QuestionTemplate, QuestionTemplate.template_id == AssessmentSessionQuestion.template_id)\
            .filter(AssessmentSessionQuestion.session_id == active_session.id)\
            .all()
            
        questions_response = []
        for q, topic in results:
            # Attach topic to the question object for Pydantic serialization
            q.topic = topic
            questions_response.append(q)
        
        # Format response
        return {
            "session_id": active_session.id,
            "questions": questions_response,
            "duration_minutes": 30
        }
    
    # 2. Extract Grade
    import re
    match = re.search(r'\d+', str(student.grade))
    grade_level = int(match.group()) if match else None
    
    if not grade_level:
         raise HTTPException(status_code=400, detail="Could not determine valid grade from student record")
         
    # 3. Fetch Templates
    # Active, Hard difficulty, matches grade
    # grade_level is ARRAY(Integer), so we check if grade_level contains our grade
    
    templates_query = db.query(QuestionTemplate).filter(
        QuestionTemplate.status == "active",
        QuestionTemplate.difficulty.ilike("hard"),
        QuestionTemplate.grade_level.any(grade_level)
    )
    
    templates = templates_query.all()
    
    if not templates:
        # Fallback: Try Medium if no Hard questions found
        templates = db.query(QuestionTemplate).filter(
            QuestionTemplate.status == "active",
            QuestionTemplate.difficulty.ilike("medium"),
            QuestionTemplate.grade_level.any(grade_level)
        ).all()
        
    if not templates:
        raise HTTPException(status_code=404, detail="No assessment questions available for this grade level")
        
    # 4. Create Session
    session = AssessmentSession(
        student_id=student.id,
        status="PENDING",
        started_at=datetime.utcnow()
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    
    # 5. Generate 25 Questions
    generated_questions = []
    target_count = 25
    
    # Select random templates, allowing repeats if specialized templates are few
    import random
    selected_templates = []
    if templates:
        for _ in range(target_count):
            selected_templates.append(random.choice(templates))
        
    for idx, template in enumerate(selected_templates):
        try:
            # Execute generator
            result = executor.execute_generator(template.dynamic_question)
            
            question_text = result.get('question', '')
            answer_value = str(result.get('answer', ''))
            question_type = result.get('type', template.type)
            options = json.dumps(result.get('options', [])) if 'options' in result else None
            
            # Create Session Question
            q = AssessmentSessionQuestion(
                session_id=session.id,
                template_id=template.template_id,
                question_html=question_text,
                question_type=question_type,
                options=options,
                correct_answer=answer_value,
                student_answer=None,
                is_correct=None
            )
            db.add(q)
            
            # Attach topic for response (transient)
            q.topic = template.topic
            
            generated_questions.append(q)
            
        except Exception as e:
            print(f"Failed to generate question from template {template.template_id}: {e}")
            continue
            
    db.commit()
    
    return {
        "session_id": session.id,
        "questions": generated_questions,
        "duration_minutes": 30
    }

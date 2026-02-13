import sys
import os

# Ensure current directory is in sys.path
sys.path.append(os.getcwd())

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import logging

try:
    from app.core.config import settings
    from app.modules.questions.models import QuestionGeneration
    from app.modules.questions.executor import executor
except ImportError as e:
    print(f"Import Error: {e}")
    sys.exit(1)

# List of requested skills
requested_ids = [
    123, 128, 499, 175, 207, 220, 249, 287, 296, 360, 397, 439, 504, 562, 613, 712, 776, 1573, 1067, 1681, 1735, 1937, 2041, 2335, 2451
]

def check_metadata():
    engine = create_engine(settings.DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    print(f"Checking {len(requested_ids)} templates for Grade 7...")
    
    results = []
    
    for tid in requested_ids:
        template = session.query(QuestionGeneration).filter_by(template_id=tid).first()
        
        status = "MISSING"
        grade = "N/A"
        diff = "N/A"
        gen_status = "Skipped"
        error_msg = ""
        
        if template:
            status = "FOUND"
            grade = template.grade
            diff = template.difficulty
            
            # Try generation
            try:
                q_code = template.question_template
                a_code = template.answer_template
                
                # Cleanup
                if q_code.startswith("```python"): q_code = q_code.replace("```python", "").replace("```", "")
                if a_code.startswith("```python"): a_code = a_code.replace("```python", "").replace("```", "")
                
                # Execute
                result = executor.execute_sequential([q_code, a_code])
                
                if result.get("question") and result.get("answer"):
                    gen_status = "SUCCESS"
                else:
                    gen_status = "PARTIAL" # Missing q or a
            except Exception as e:
                gen_status = "FAILED"
                error_msg = str(e)
                
        results.append({
            "id": tid,
            "status": status,
            "grade": grade,
            "difficulty": diff,
            "generation": gen_status,
            "error": error_msg
        })
        
    session.close()
    
    with open("check_report.txt", "w", encoding="utf-8") as f:
        f.write(f"{'ID':<6} | {'Status':<7} | {'Grade':<5} | {'Diff':<10} | {'Gen':<8} | {'Error'}\n")
        f.write("-" * 80 + "\n")
        for r in results:
            f.write(f"{r['id']:<6} | {r['status']:<7} | {r['grade']:<5} | {r['difficulty']:<10} | {r['generation']:<8} | {r['error']}\n")
            
        # Validation summary
        not_grade_7 = [r['id'] for r in results if r['grade'] != 7 and r['status'] == "FOUND"]
        generation_failed = [r['id'] for r in results if r['generation'] != "SUCCESS"]
        
        if not_grade_7:
            f.write(f"\nWARNING: Some templates are not Grade 7: {not_grade_7}\n")
        if generation_failed:
            f.write(f"\nWARNING: Some templates failed generation: {generation_failed}\n")
            
    print("Report written to check_report.txt")

if __name__ == "__main__":
    check_metadata()

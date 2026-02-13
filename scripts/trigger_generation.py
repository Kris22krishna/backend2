
import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.modules.questions import service
from app.modules.questions.schemas import QuestionGenerationJobCreate

sys.path.append(os.getcwd())

def trigger_generation():
    url = settings.DATABASE_URL.replace("+asyncpg", "")
    engine = create_engine(url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    # Template ID 6 is the likely culprit based on previous debug output
    template_id = 6 
    
    print(f"Creating new job for Template {template_id}...")
    job_data = QuestionGenerationJobCreate(
        template_id=template_id,
        requested_count=5
    )
    
    try:
        job = service.QuestionGenerationService.create_generation_job(db, job_data, user_id=1)
        print(f"Job created: {job.job_id}")
        
        print("Processing job...")
        service.QuestionGenerationService.process_generation_job(db, job.job_id)
        print("Job completed successfully!")
        
    except Exception as e:
        print("Job Failed!")
        print(f"Error: {e}")
        if hasattr(e, 'orig'):
            print(f"Original DB Error: {e.orig}")

if __name__ == "__main__":
    trigger_generation()

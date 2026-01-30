
import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.modules.questions import service
from app.modules.questions import models

sys.path.append(os.getcwd())

def verify_stats():
    url = settings.DATABASE_URL.replace("+asyncpg", "")
    engine = create_engine(url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    print("Checking questions stats...")
    stats = service.QuestionGenerationService.get_question_stats(db)
    print(f"Stats found: {len(stats)}")
    for s in stats:
        print(f"Template {s.template_id}: {s.count} questions")
        
    print("\nChecking generated questions list...")
    questions, total = service.QuestionGenerationService.list_generated_questions(db, limit=5)
    print(f"Total questions: {total}")
    for q in questions:
        print(f"Question {q.generated_question_id} (Template {q.template_id})")

if __name__ == "__main__":
    verify_stats()

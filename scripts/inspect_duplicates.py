
import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.modules.questions.models import GeneratedQuestion

sys.path.append(os.getcwd())

def inspect_questions():
    url = settings.DATABASE_URL.replace("+asyncpg", "")
    engine = create_engine(url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    # Check generated questions for Template 6 (Counting)
    questions = db.query(GeneratedQuestion).filter(GeneratedQuestion.template_id == 6).all()
    
    print(f"Found {len(questions)} questions for Template 6:")
    # Print the last 10 questions (most recent)
    for i, q in enumerate(questions[-10:]):
        import re
        clean_text = re.sub(r'<[^>]+>', ' ', q.question_html).strip()
        print(f"NEW #{i+1}: {clean_text} | Ans: {q.answer_value}")
        sys.stdout.flush()

if __name__ == "__main__":
    inspect_questions()


import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.modules.questions.models import QuestionTemplate

sys.path.append(os.getcwd())

def check_template():
    url = settings.DATABASE_URL.replace("+asyncpg", "")
    engine = create_engine(url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    t = db.query(QuestionTemplate).filter(QuestionTemplate.template_id == 6).first()
    if t:
        print(f"ID: {t.template_id}")
        print(f"Type: '{t.type}'")
        print(f"Topic: {t.topic}")
    else:
        print("Template 6 not found")

if __name__ == "__main__":
    check_template()

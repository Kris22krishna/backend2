import sys
import os
from sqlalchemy import func
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)
from app.db.session import SessionLocal
from app.modules.questions.models import QuestionTemplate, QuestionGeneration

def list_types():
    db = SessionLocal()
    print("--- V2 Types ---")
    v2_types = db.query(QuestionGeneration.type, func.count(QuestionGeneration.type)).group_by(QuestionGeneration.type).all()
    for t, c in v2_types:
        print(f"  {t}: {c}")
        
    print("\n--- V1 Types ---")
    v1_types = db.query(QuestionTemplate.type, func.count(QuestionTemplate.type)).group_by(QuestionTemplate.type).all()
    for t, c in v1_types:
        print(f"  {t}: {c}")
    db.close()

if __name__ == "__main__":
    list_types()

import sys
import os

sys.path.append(os.getcwd())

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.modules.questions.models import QuestionGeneration

def count_templates():
    engine = create_engine(settings.DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    count = session.query(QuestionGeneration).filter_by(grade=7).count()
    print(f"Total Grade 7 V2 Templates: {count}")
    
    # Also check V1
    # from app.modules.questions.models import QuestionTemplate
    # v1_count = session.query(QuestionTemplate).active... but let's stick to V2 as requested.
    
    session.close()

if __name__ == "__main__":
    count_templates()

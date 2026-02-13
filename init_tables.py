from app.db.session import engine
from app.db.base import Base
from app.modules.auth.models import User
from app.modules.assessment_integration.models import AssessmentStudent

def init_tables():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")

if __name__ == "__main__":
    init_tables()

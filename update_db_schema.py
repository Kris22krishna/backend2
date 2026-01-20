import sys
import os
from sqlalchemy import create_engine
from app.core.config import settings
from app.db.base import Base
# Import models to register them with metadata
from app.modules.questions import models

sys.path.append(os.getcwd())

def update_db():
    print("Updating database schema...")
    url = settings.DATABASE_URL.replace("+asyncpg", "")
    engine = create_engine(url)
    
    # This will create tables that don't satisfy existence check
    Base.metadata.create_all(bind=engine)
    print("Database updated successfully.")

if __name__ == "__main__":
    update_db()

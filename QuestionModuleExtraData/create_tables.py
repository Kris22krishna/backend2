"""
Quick script to create question template tables directly using SQLAlchemy.
Run this to create the tables without using Alembic.
"""

from app.db.session import engine
from app.db.base import Base

# Import all models to register them with Base
from app.modules.auth.models import *
from app.modules.student.models import *
from app.modules.teacher.models import *
from app.modules.parent.models import *
from app.modules.questions.models import *

def create_tables():
    """Create all tables defined in the models"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully!")
    
    # List created tables
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    print(f"\nTotal tables in database: {len(tables)}")
    
    # Check for question template tables
    question_tables = [t for t in tables if 'question' in t.lower()]
    if question_tables:
        print(f"\nQuestion template tables created:")
        for table in question_tables:
            print(f"  ✓ {table}")
    else:
        print("\n⚠ Warning: No question template tables found!")

if __name__ == "__main__":
    create_tables()

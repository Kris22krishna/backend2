"""
Database migration script to create content tables.
Run this script to create grades, categories, and skills tables.
"""

from sqlalchemy import create_engine, text
from app.core.config import settings
from app.db.base import Base
from app.modules.content.models import Grade, Category, Skill

def create_content_tables():
    """Create content tables in the database"""
    engine = create_engine(settings.DATABASE_URL)
    
    # Create tables
    Base.metadata.create_all(bind=engine, tables=[
        Grade.__table__,
        Category.__table__,
        Skill.__table__
    ])
    
    print("✓ Content tables created successfully!")
    print("  - grades")
    print("  - categories")
    print("  - skills")

if __name__ == "__main__":
    create_content_tables()

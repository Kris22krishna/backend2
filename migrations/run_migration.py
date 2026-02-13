"""
Migration script to add grade_level to question_templates
Run this with: python migrations/run_migration.py
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.db.session import engine

def run_migration():
    """Run the migration to add grade_level column"""
    
    migration_sql = """
    -- Add the column (nullable first for existing data)
    ALTER TABLE question_templates 
    ADD COLUMN IF NOT EXISTS grade_level INTEGER;
    
    -- Update existing records to default grade 1
    UPDATE question_templates 
    SET grade_level = 1 
    WHERE grade_level IS NULL;
    
    -- Make it NOT NULL
    ALTER TABLE question_templates 
    ALTER COLUMN grade_level SET NOT NULL;
    
    -- Add index
    CREATE INDEX IF NOT EXISTS idx_question_templates_grade_level 
    ON question_templates(grade_level);
    """
    
    try:
        with engine.connect() as connection:
            # Execute migration
            connection.execute(text(migration_sql))
            connection.commit()
            
            print("✅ Migration completed successfully!")
            
            # Verify
            result = connection.execute(text(
                "SELECT template_id, grade_level, topic, status FROM question_templates LIMIT 5"
            ))
            
            print("\n📋 Sample data after migration:")
            print("ID | Grade | Topic | Status")
            print("-" * 50)
            for row in result:
                print(f"{row[0]} | {row[1]} | {row[2]} | {row[3]}")
                
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        raise

if __name__ == "__main__":
    print("🚀 Running migration: add_grade_level to question_templates")
    run_migration()

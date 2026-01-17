import sys
import os
from sqlalchemy import text, inspect

sys.path.append(os.getcwd())
from app.db.session import engine, SessionLocal

def fix_teachers_table():
    print("Fixing teachers table schema...")
    with engine.connect() as connection:
        with connection.begin():
            # Add missing columns
            # qualification
            connection.execute(text("ALTER TABLE teachers ADD COLUMN IF NOT EXISTS qualification VARCHAR"))
            # experience_years
            connection.execute(text("ALTER TABLE teachers ADD COLUMN IF NOT EXISTS experience_years INTEGER"))
            # subjects (JSONB)
            connection.execute(text("ALTER TABLE teachers ADD COLUMN IF NOT EXISTS subjects JSONB"))
            # department
            connection.execute(text("ALTER TABLE teachers ADD COLUMN IF NOT EXISTS department VARCHAR"))
            # bio
            connection.execute(text("ALTER TABLE teachers ADD COLUMN IF NOT EXISTS bio TEXT"))
            
    print("Schema update statements executed.")

def verify_schema():
    print("Verifying schema...")
    inspector = inspect(engine)
    columns = [c['name'] for c in inspector.get_columns("teachers")]
    print(f"Columns in 'teachers' now: {columns}")
    
    missing = []
    for col in ['qualification', 'experience_years', 'subjects', 'department', 'bio']:
        if col not in columns:
            missing.append(col)
            
    if missing:
        print(f"CRITICAL: Still missing columns: {missing}")
    else:
        print("SUCCESS: All columns present.")

if __name__ == "__main__":
    try:
        fix_teachers_table()
        verify_schema()
    except Exception as e:
        print(f"Error fixing schema: {e}")

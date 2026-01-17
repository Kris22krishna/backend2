import sys
import os
from sqlalchemy import text, inspect

# Add current directory to path
sys.path.append(os.getcwd())

from app.db.session import engine, SessionLocal
from app.modules.teacher.models import Teacher

def log_to_file(message):
    with open("db_debug_output.txt", "a") as f:
        f.write(message + "\n")

def check_tables():
    log_to_file("Checking tables in database...")
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        log_to_file(f"Tables found: {tables}")
        
        if "teachers" in tables:
            log_to_file("Table 'teachers' exists.")
            columns = [c['name'] for c in inspector.get_columns("teachers")]
            log_to_file(f"Columns in 'teachers': {columns}")
        else:
            log_to_file("CRITICAL: Table 'teachers' does NOT exist.")
    except Exception as e:
        log_to_file(f"Error checking tables: {e}")

def test_insert():
    log_to_file("\nAttempting dummy insert into teachers...")
    db = SessionLocal()
    try:
        sql = text("INSERT INTO teachers (teacher_id, user_id, tenant_id, school_id, status) VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'active')")
        db.execute(sql)
        log_to_file("Insert executed (unexpectedly allowed with bad FKs, or rolled back).")
        db.rollback()
    except Exception as e:
        log_to_file(f"Insert failed with error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    # Clear file
    with open("db_debug_output.txt", "w") as f:
        f.write("Debug Start\n")
    check_tables()
    test_insert()

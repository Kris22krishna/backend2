import sys
import os
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.modules.student.models import Report, Student
from sqlalchemy import text

# Add current directory to path
sys.path.append(os.getcwd())

def test_stats_query():
    db = SessionLocal()
    try:
        print("Testing Student count...")
        s_count = db.query(Student).count()
        print(f"Student count: {s_count}")

        print("Testing Report count...")
        # This is the line failing in 500 error
        r_count = db.query(Report).count() 
        print(f"Report count: {r_count}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_stats_query()

import sys
import os
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
# Import User to ensure metadata is populated for ForeignKeys
from app.modules.auth.models import User
from app.modules.student.models import Report, Student
from sqlalchemy import text

# Add current directory to path
sys.path.append(os.getcwd())

def test_query():
    db = SessionLocal()
    try:
        print("Querying Report count...")
        c = db.query(Report).count()
        print(f"Report count: {c}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_query()

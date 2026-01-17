import sys
import os
from sqlalchemy import desc
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.modules.student.models import Report
from app.modules.auth.models import User
import uuid

# Add current directory to path
sys.path.append(os.getcwd())

def verify_reports_query():
    print("Verifying usage of Report model in query...", flush=True)
    db = SessionLocal()
    try:
        # Just grab any user to use as ID, or generate a random one
        # logic: db.query(Report).filter(Report.user_id == target_uid).order_by(desc(Report.created_at)).all()
        
        target_uid = uuid.uuid4() 
        print(f"Testing query with random UUID: {target_uid}", flush=True)
        
        reports = db.query(Report).filter(Report.user_id == target_uid).order_by(desc(Report.created_at)).all()
        
        print(f"Query executed successfully. Result count: {len(reports)}", flush=True)
        
    except Exception as e:
        print(f"Query FAILED with error: {e}", flush=True)
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    verify_reports_query()

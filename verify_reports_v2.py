import sys
import os
from sqlalchemy import desc
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.modules.student.models import Report
import uuid
import datetime

# Add current directory to path
sys.path.append(os.getcwd())

def verify_reports_schema():
    print("Verifying 'reports' schema...", flush=True)
    db = SessionLocal()
    try:
        # 1. Try to query (should not error even if empty)
        print("Executing SELECT query...", flush=True)
        # Using the exact same query structure as the endpoint
        target_uid = uuid.uuid4()
        reports = db.query(Report).filter(Report.user_id == target_uid).order_by(desc(Report.created_at)).all()
        print(f"Query OK. Result count: {len(reports)}", flush=True)
        
        # 2. Try to insert (to verify column names like report_data)
        print("Executing INSERT...", flush=True)
        new_report = Report(
            user_id=target_uid,
            status="completed",
            report_data={"test": "data", "score": 100},
            evaluated_at=datetime.datetime.utcnow()
        )
        db.add(new_report)
        db.commit()
        print("Insert OK.", flush=True)
        
    except Exception as e:
        print(f"Schema Verification FAILED: {e}", flush=True)
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    verify_reports_schema()

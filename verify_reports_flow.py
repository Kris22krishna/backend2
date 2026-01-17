import sys
import os
import uuid
import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.modules.student.models import Report
from app.modules.reports.router import get_reports

# Add current directory to path
sys.path.append(os.getcwd())

def verify_flow():
    print("Verifying Report Flow...", flush=True)
    db = SessionLocal()
    try:
        # 1. Create Data (Simulate POST)
        user_id = uuid.uuid4()
        report_data_input = {
            "summary": {"score": 100, "totalQuestions": 10},
            "timestamp": datetime.now().isoformat()
        }
        
        # This matches create_report logic
        new_report = Report(
            user_id=user_id,
            status="completed",
            report_data={
                "report_type": "Assessment",
                "parameters": report_data_input
            },
            evaluated_at=datetime.utcnow()
        )
        db.add(new_report)
        db.commit()
        db.refresh(new_report)
        print(f"Report Created: {new_report.report_id}", flush=True)
        
        # 2. Fetch Data (Simulate GET via Router Logic)
        # Simulate what the router returns now (which is a dict)
        router_result = get_reports(uid=str(user_id), db=db)
        
        # Check wrapping
        if isinstance(router_result, dict) and router_result.get("success"):
            results = router_result["data"]
            print(f"Fetched {len(results)} reports (Wrapped Success).", flush=True)
            if len(results) > 0:
                first = results[0]
                print(f"Report JSON keys: {first['report_json'].keys()}", flush=True)
                if "summary" in first["report_json"]:
                    print("SUCCESS: 'summary' found in report_json.", flush=True)
                else:
                    print("FAILURE: 'summary' MISSING in report_json.", flush=True)
        else:
             print("FAILURE: Response is not wrapped in {success: True, data: ...}", flush=True)
             print(f"Got: {type(router_result)}", flush=True)
        
    except Exception as e:
        print(f"Error: {e}", flush=True)
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    verify_flow()

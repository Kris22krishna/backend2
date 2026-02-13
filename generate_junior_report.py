
import json
import os
import sys
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration

def generate_report():
    db = SessionLocal()
    try:
        templates = db.query(QuestionGeneration).filter(
            QuestionGeneration.grade.in_([1, 2, 3, 4])
        ).all()
        
        report = {}
        for t in templates:
            sid = str(t.skill_id)
            if sid not in report:
                report[sid] = {
                    "name": t.skill_name,
                    "grade": t.grade,
                    "types": set()
                }
            report[sid]["types"].add(t.type)
            
        # Convert sets to lists for JSON serialization
        for sid in report:
            report[sid]["types"] = list(report[sid]["types"])
            
        with open("junior_templates_summary.json", "w") as f:
            json.dump(report, f, indent=4)
        print("Report generated: junior_templates_summary.json")
            
    finally:
        db.close()

if __name__ == "__main__":
    generate_report()

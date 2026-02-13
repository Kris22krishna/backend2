
import sys
import os
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.modules.skills.models import Skill
from app.modules.questions.models import QuestionGeneration

def final_diagnosis():
    db = SessionLocal()
    try:
        templates = db.query(QuestionGeneration).all()
        total_templates = len(templates)
        
        # Skill map for name/grade lookup
        all_skills = db.query(Skill).all()
        name_grade_to_id = {(s.grade, s.skill_name.strip().lower()): s.skill_id for s in all_skills}
        id_to_name_grade = {s.skill_id: (s.grade, s.skill_name.strip().lower()) for s in all_skills}
        
        counts = {
            "correct_id_and_name": 0,
            "wrong_id_but_can_fix_by_name": 0,
            "id_not_in_skill_table_but_can_fix_by_name": 0,
            "cannot_fix_no_name_match": 0,
            "already_perfect": 0
        }
        
        for t in templates:
            t_name_clean = t.skill_name.strip().lower()
            correct_skill_id = name_grade_to_id.get((t.grade, t_name_clean))
            
            skill_entry = id_to_name_grade.get(t.skill_id)
            
            if correct_skill_id:
                if t.skill_id == correct_skill_id:
                    counts["already_perfect"] += 1
                else:
                    if skill_entry:
                        counts["wrong_id_but_can_fix_by_name"] += 1
                    else:
                        counts["id_not_in_skill_table_but_can_fix_by_name"] += 1
            else:
                counts["cannot_fix_no_name_match"] += 1
                if counts["cannot_fix_no_name_match"] < 5:
                    print(f"DEBUG: Cannot find skill '{t.skill_name}' Grade {t.grade} in Skill table.")

        print("\n--- FINAL DIAGNOSIS ---")
        print(f"Total Templates: {total_templates}")
        for k, v in counts.items():
            print(f"{k:<45}: {v}")
            
    finally:
        db.close()

if __name__ == "__main__":
    final_diagnosis()

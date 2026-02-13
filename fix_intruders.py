
import sys
import os
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.modules.skills.models import Skill
from app.modules.questions.models import QuestionGeneration

def neutralize_intruders(dry_run=True):
    db = SessionLocal()
    try:
        # Load all skills into mapping
        print("Loading skill mapping...")
        all_skills = db.query(Skill).all()
        skill_map = {}
        for s in all_skills:
            key = (s.grade, s.skill_name.strip().lower())
            skill_map[key] = s.skill_id
            
        print(f"Loaded {len(skill_map)} skill mappings.")

        # Process ALL templates
        templates = db.query(QuestionGeneration).all()
        print(f"Analyzing {len(templates)} templates for intruders...")
        
        fixed_count = 0
        neutralized_count = 0
        already_correct = 0
        
        for t in templates:
            t_name_key = (t.grade, t.skill_name.strip().lower())
            correct_skill_id = skill_map.get(t_name_key)
            
            if correct_skill_id:
                if t.skill_id != correct_skill_id:
                    print(f"FIXING T-ID {t.template_id}: '{t.skill_name}' (ID {t.skill_id} -> {correct_skill_id})")
                    if not dry_run:
                        t.skill_id = correct_skill_id
                    fixed_count += 1
                else:
                    already_correct += 1
            else:
                # This template has a name that doesn't exist in Skill table
                # If its current skill_id is NOT -1, it's an intruder pointing to someone else!
                if t.skill_id != -1:
                    print(f"NEUTRALIZING T-ID {t.template_id}: '{t.skill_name}' Grade {t.grade} (Currently ID {t.skill_id} points to a different skill)")
                    if not dry_run:
                        t.skill_id = -1
                    neutralized_count += 1
                else:
                    already_correct += 1

        print(f"\n--- Results ({'DRY RUN' if dry_run else 'LIVE UPDATE'}) ---")
        print(f"Already Correct/Safe: {already_correct}")
        print(f"Fixed (re-linked):    {fixed_count}")
        print(f"Neutralized (to -1): {neutralized_count}")
        
        if not dry_run and (fixed_count > 0 or neutralized_count > 0):
            db.commit()
            print("Successfully committed changes to database.")
            
    finally:
        db.close()

if __name__ == "__main__":
    is_live = "--live" in sys.argv
    neutralize_intruders(dry_run=not is_live)


import sys
import os
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.modules.skills.models import Skill
from app.modules.questions.models import QuestionGeneration

def rescue_skill_ids_efficient(dry_run=True, grade_filter=None):
    db = SessionLocal()
    try:
        # Load all skills into mapping
        print("Loading skill mapping...")
        skills_query = db.query(Skill)
        if grade_filter:
            skills_query = skills_query.filter(Skill.grade == grade_filter)
        
        all_skills = skills_query.all()
        # Key: (grade, skill_name.strip().lower()), Value: skill_id
        skill_map = {}
        for s in all_skills:
            key = (s.grade, s.skill_name.strip().lower())
            skill_map[key] = s.skill_id
            
        print(f"Loaded {len(skill_map)} skill mappings.")

        # Process templates
        templates_query = db.query(QuestionGeneration)
        if grade_filter:
            templates_query = templates_query.filter(QuestionGeneration.grade == grade_filter)
            
        templates = templates_query.all()
        print(f"Analyzing {len(templates)} templates for alignment...")
        
        updates_count = 0
        not_found_count = 0
        already_correct = 0
        
        for t in templates:
            t_name_key = (t.grade, t.skill_name.strip().lower())
            correct_skill_id = skill_map.get(t_name_key)
            
            if correct_skill_id:
                if t.skill_id != correct_skill_id:
                    if updates_count < 5:
                        print(f"Updating T-ID {t.template_id}: '{t.skill_name}' (ID {t.skill_id} -> {correct_skill_id})")
                    
                    if not dry_run:
                        t.skill_id = correct_skill_id
                    updates_count += 1
                else:
                    already_correct += 1
            else:
                not_found_count += 1
                if not_found_count < 5:
                    print(f"WARNING: No skill match for '{t.skill_name}' (Grade {t.grade})")

        print(f"\n--- Results ({'DRY RUN' if dry_run else 'LIVE UPDATE'}) ---")
        print(f"Total processed:        {len(templates)}")
        print(f"Templates correct:      {already_correct}")
        print(f"Templates FIXED:       {updates_count}")
        print(f"Templates NOT FOUND:    {not_found_count}")
        
        if not dry_run and updates_count > 0:
            db.commit()
            print("Successfully committed changes to database.")
            
    finally:
        db.close()

if __name__ == "__main__":
    is_live = "--live" in sys.argv
    grade = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else None
    rescue_skill_ids_efficient(dry_run=not is_live, grade_filter=grade)


import sys
import os
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.modules.skills.models import Skill
from app.modules.questions.models import QuestionGeneration

def analyze_skills(grade_filter=None):
    db = SessionLocal()
    try:
        # Check specific grade or all junior grades
        grades = [grade_filter] if grade_filter else [1, 2, 3, 4]
        for g in grades:
            skills = db.query(Skill).filter(Skill.grade == g).all()
            print(f"\nGrade {g}: Found {len(skills)} skills")
            
            # Check for name duplicates in same grade
            names = [s.skill_name for s in skills]
            duplicates = set([x for x in names if names.count(x) > 1])
            if duplicates:
                print(f"  DUPLICATE NAMES in Grade {g}: {duplicates}")
            
            # Check if these skills have templates
            mismatch_count = 0
            found_count = 0
            for s in skills:
                templates = db.query(QuestionGeneration).filter(QuestionGeneration.skill_id == s.skill_id).all()
                if templates:
                    found_count += 1
                    for t in templates:
                         if t.skill_name != s.skill_name:
                             mismatch_count += 1
                             if mismatch_count <= 5: # Show only first 5
                                 print(f"  MISMATCH: Skill ID {s.skill_id}")
                                 print(f"    Skill Table:    '{s.skill_name}'")
                                 print(f"    Template Table: '{t.skill_name}'")
            
            print(f"  Summary for Grade {g}:")
            print(f"    Skills with templates: {found_count}/{len(skills)}")
            print(f"    Total template name mismatches: {mismatch_count}")
                         
    finally:
        db.close()

if __name__ == "__main__":
    grade = int(sys.argv[1]) if len(sys.argv) > 1 else None
    analyze_skills(grade)


import sys
import os
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.modules.skills.models import Skill
from app.modules.questions.models import QuestionGeneration

def analyze_mismatches_simple():
    db = SessionLocal()
    try:
        query = db.query(
            QuestionGeneration.template_id,
            QuestionGeneration.skill_id,
            QuestionGeneration.skill_name.label('t_name'),
            Skill.skill_name.label('s_name'),
            Skill.grade
        ).join(
            Skill, QuestionGeneration.skill_id == Skill.skill_id
        ).filter(
            QuestionGeneration.skill_name != Skill.skill_name
        )
        
        mismatches = query.all()
        print(f"Total Mismatches: {len(mismatches)}")
        
        for m in mismatches:
            print(f"--- Mismatch ID {m.template_id} (Skill {m.skill_id}, Grade {m.grade}) ---")
            print(f"  Template Table: '{m.t_name}'")
            print(f"  Skill Table:    '{m.s_name}'")
            
    finally:
        db.close()

if __name__ == "__main__":
    analyze_mismatches_simple()


import sys
import os
from sqlalchemy import join
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.modules.skills.models import Skill
from app.modules.questions.models import QuestionGeneration

def analyze_skills_efficiently():
    db = SessionLocal()
    try:
        # Perform a join to find templates where the denormalized skill_name doesn't match the Skill table
        query = db.query(
            QuestionGeneration.template_id,
            QuestionGeneration.skill_id,
            QuestionGeneration.skill_name.label('template_skill_name'),
            Skill.skill_name.label('skill_table_name'),
            Skill.grade
        ).join(
            Skill, QuestionGeneration.skill_id == Skill.skill_id
        ).filter(
            QuestionGeneration.skill_name != Skill.skill_name
        )
        
        mismatches = query.all()
        
        print(f"Total Mismatches Found: {len(mismatches)}")
        
        if mismatches:
            print("\nFirst 20 Mismatches:")
            print(f"{'Template ID':<12} | {'Skill ID':<8} | {'Grade':<6} | {'Template Skill Name':<40} | {'Skill Table Name'}")
            print("-" * 120)
            for m in mismatches[:20]:
                print(f"{m.template_id:<12} | {m.skill_id:<8} | {m.grade:<6} | {m.template_skill_name[:40]:<40} | {m.skill_table_name}")
        
    finally:
        db.close()

if __name__ == "__main__":
    analyze_skills_efficiently()

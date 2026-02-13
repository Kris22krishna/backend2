
import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.modules.questions.models import QuestionGeneration
from app.modules.skills.models import Skill
from app.db.session import SessionLocal

def check_skill_alignment():
    db = SessionLocal()
    try:
        # Check all V2 templates for mismatches
        templates = db.query(QuestionGeneration).all()
        mismatches = []
        not_found = []
        
        for t in templates:
            skill = db.query(Skill).filter(Skill.skill_id == t.skill_id).first()
            if not skill:
                not_found.append(f"Template {t.template_id}: Skill ID {t.skill_id} not found in skills table")
            elif t.skill_name != skill.skill_name:
                mismatches.append(f"Template {t.template_id}: Template Skill '{t.skill_name}' != Skill Table '{skill.skill_name}' (ID: {t.skill_id})")
        
        if not mismatches and not not_found:
            print("ALL CLEAR: All templates match the skills table.")
        else:
            if not_found:
                print(f"\nNOT FOUND ({len(not_found)}):")
                for item in not_found[:10]: print(item)
            if mismatches:
                print(f"\nMISMATCHES ({len(mismatches)}):")
                for item in mismatches[:10]: print(item)
            
    finally:
        db.close()

if __name__ == "__main__":
    check_skill_alignment()

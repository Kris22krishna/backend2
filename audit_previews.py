from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration
# Assuming Skill model is available, if not I'll just look at used skill_ids in templates
from sqlalchemy import func

db = SessionLocal()

# Get all unique skill IDs that HAVE templates
skills_with_templates = db.query(QuestionGeneration.skill_id).distinct().all()
skill_ids = [s[0] for s in skills_with_templates]

print(f"Scanning {len(skill_ids)} skills with templates...")

success_count = 0
fail_count = 0

for sid in skill_ids:
    # Try to fetch latest template
    t = db.query(QuestionGeneration).filter(
        QuestionGeneration.skill_id == sid
    ).order_by(QuestionGeneration.template_id.desc()).first()
    
    if not t:
        print(f"Skill {sid}: NO TEMPLATES (Should not happen due to query)")
        fail_count += 1
        continue

    # basic check if template has code
    if not t.question_template or len(t.question_template) < 10:
        print(f"Skill {sid}: Template {t.template_id} EMPTY CODE")
        fail_count += 1
        continue
        
    # We won't actually execute code here to save time/risk, 
    # but we check if it looks valid.
    # If the user says "no preview", maybe the template exists but execution fails?
    # Or maybe there are skills WITHOUT templates that are listed in the UI?
    
    # Wait, the syllabus lists ALL skills from the 'skills' table.
    # My query only checked skills that HAVE templates in 'question_generation'.
    # I should check the gap.
    
    success_count += 1

print(f"Skills with valid-looking templates: {success_count}")

# Now let's list skills that are likely in the DB but HAVE NO templates.
# I need to access the 'skills' table. 
# from app.modules.skills.models import Skill <-- I need to confirm this path.
# I viewed router.py for skills earlier: "from .models import Skill" in "app/modules/skills/router.py"
# So "app.modules.skills.models" should be correct.

try:
    from app.modules.skills.models import Skill
    all_skills = db.query(Skill).all()
    print(f"Total Skills in Syllabus: {len(all_skills)}")
    
    missing_content_skills = []
    for s in all_skills:
        if s.skill_id not in skill_ids:
            missing_content_skills.append(f"{s.skill_id}: {s.skill_name}")
            
    print(f"Skills WITHOUT Content ({len(missing_content_skills)}):")
    # Print first 20
    for m in missing_content_skills[:20]:
        print(m)
    if len(missing_content_skills) > 20: 
        print("...")

except ImportError:
    print("Could not import Skill model to verify coverage.")

db.close()

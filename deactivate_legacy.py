from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration

db = SessionLocal()

# Find all templates for Skill 1 that are NOT my new ones (Assuming new ones are > 1950)
# And set them to inactive
legacy_templates = db.query(QuestionGeneration).filter(
    QuestionGeneration.skill_id == 1,
    QuestionGeneration.template_id < 1950
).all()

print(f"Found {len(legacy_templates)} legacy templates to deactivate.")

for t in legacy_templates:
    print(f"Soft-deleting Template ID: {t.template_id} (Type: {t.type})")
    t.skill_id = -1  # Move to 'trash' skill

db.commit()
print("Legacy templates soft-deleted (moved to skill_id=-1) successfully.")

# Verify what's left active for Skill 1
active_templates = db.query(QuestionGeneration).filter(
    QuestionGeneration.skill_id == 1
).all()

print(f"--- Remaining Active Templates for Skill 1 ---")
for t in active_templates:
    print(f"ID: {t.template_id} | Type: {t.type} | Skill Name: {t.skill_name}")

db.close()

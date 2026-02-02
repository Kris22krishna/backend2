from app.db.session import SessionLocal
from app.modules.skills.models import Skill # Assuming Skill model exists? 
# Wait, I didn't verify Skill model.
# I will query 'active' templates grouping by skill_id and skill_name to deduce skills
# since I am not sure where the 'skills' table is (maybe app.modules.skills.models?)

from app.modules.questions.models import QuestionGeneration
from sqlalchemy import func

db = SessionLocal()

results = db.query(
    QuestionGeneration.skill_id, 
    QuestionGeneration.skill_name, 
    func.count(QuestionGeneration.template_id)
).group_by(
    QuestionGeneration.skill_id, 
    QuestionGeneration.skill_name
).all()

print("--- Active Skills (deduced from templates) ---")
for r in results:
    print(f"Skill ID: {r[0]} | Name: '{r[1]}' | Template Count: {r[2]}")

db.close()

from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration

db = SessionLocal()

# Template 272 (Legacy Hard Challenge)
t = db.query(QuestionGeneration).filter(QuestionGeneration.template_id == 272).first()

if t:
    print(f"Overwriting Template 272 (Skill {t.skill_id})...")
    
    # Inline Input Code (Same as 1956)
    question_code = """
import random

tens = random.randint(1, 9)
ones = random.randint(0, 9)
total = (tens * 10) + ones

blocks_html = f"<div style='margin-bottom: 20px; font-size: 20px; color: #f59e0b; letter-spacing: 2px;'>"
for _ in range(tens):
    blocks_html += "🧱" * 10 + " " 
blocks_html += "<br>"
blocks_html += "🟥" * ones
blocks_html += "</div>"

question = f'''
{blocks_html}
<div style='text-align: center;'>
    Count the blocks.<br><br>
    <input class='inline-input' type='text' /> tens + <input class='inline-input' type='text' /> ones = {total}
</div>
'''
"""
    answer_code = """
answer = f"{tens}|{ones}"
"""
    solution_code = """
solution = f"<div style='text-align: center;'>There are {tens} groups of ten and {ones} single blocks.<br>So, {tens} tens + {ones} ones = {total}.</div>"
"""
    
    t.question_template = question_code
    t.answer_template = answer_code
    t.solution_template = solution_code
    t.type = "User Input" # Ensure type is correct
    t.skill_name = "Place Value (Fixed)" # Rename to verify fix
    
    db.commit()
    print("Template 272 overwritten successfully.")

else:
    print("Template 272 not found.")

db.close()

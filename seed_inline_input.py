from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration

db = SessionLocal()

# Template for Place Value (Tens and Ones) with Inline Inputs
question_code = """
import random

tens = random.randint(1, 9)
ones = random.randint(0, 9)
total = (tens * 10) + ones

# Generate block visualization (simple text representation for now, or html blocks)
blocks_html = f"<div style='margin-bottom: 20px; font-size: 20px; color: #f59e0b; letter-spacing: 2px;'>"
for _ in range(tens):
    blocks_html += "🧱" * 10 + " " # 10 blocks per ten
blocks_html += "<br>"
blocks_html += "🟥" * ones # Single blocks
blocks_html += "</div>"

# Use class 'inline-input' which the frontend now recognizes
question = f'''
{blocks_html}
<div style='text-align: center;'>
    Count the blocks.<br><br>
    <input class='inline-input' type='text' /> tens + <input class='inline-input' type='text' /> ones = {total}
</div>
'''
"""

answer_code = """
# Pipe separated answer for multiple inputs
answer = f"{tens}|{ones}"
"""

solution_code = """
solution = f"<div style='text-align: center;'>There are {tens} groups of ten and {ones} single blocks.<br>So, {tens} tens + {ones} ones = {total}.</div>"
"""

# Create the template
new_template = QuestionGeneration(
    skill_id=1, # Re-using 1 for demo, or could use new skill
    skill_name="Place Value: Tens & Ones",
    category="Number Sense",
    grade=1,
    difficulty="Medium",
    type="User Input", # It's technically user input, just multiple
    format=1,
    question_template=question_code,
    answer_template=answer_code,
    solution_template=solution_code
)

db.add(new_template)
db.commit()
print(f"Successfully added Inline Input Template with ID: {new_template.template_id}")

db.close()

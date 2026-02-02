from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration

db = SessionLocal()

# Template for Simple Addition (Grade 1) with Options
question_code = """
import random

a = random.randint(1, 9)
b = random.randint(1, 9)
correct = a + b

# Generate Distractors
options = set()
options.add(correct)
while len(options) < 4:
    distractor = correct + random.randint(-4, 4)
    if distractor > 0 and distractor != correct:
        options.add(distractor)

options = list(options)
random.shuffle(options)

# IMPORTANT: The executor expects 'question' as the variable name, NOT 'question_html'
question = f"<div style='font-size: 24px; text-align: center;'>What is {a} + {b}?</div>"
"""

answer_code = """
# Executor expects 'answer'
answer = correct
"""

solution_code = """
# Executor expects 'solution'
solution = f"<div style='text-align: center;'>To equal {correct}, we add {a} and {b}.<br>{a} + {b} = {correct}</div>"
"""

# Create the template
new_template = QuestionGeneration(
    skill_id=1,
    skill_name="Addition Practice",
    category="Addition",
    grade=1,
    difficulty="Easy",
    type="MCQ",  # Explicitly MCQ
    format=1,
    question_template=question_code,
    answer_template=answer_code,
    solution_template=solution_code
)

db.add(new_template)
db.commit()
print(f"Successfully added V3 CORRECTED Addition MCQ template with ID: {new_template.template_id}")

db.close()

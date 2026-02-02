from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration

db = SessionLocal()

# Template for Simple Addition (Grade 1)
question_code = """
import random
a = random.randint(1, 9)
b = random.randint(1, 9)
correct = a + b
question_html = f"<div style='font-size: 24px; text-align: center;'>What is {a} + {b}?</div>"
"""

answer_code = """
answer_value = correct
"""

solution_code = """
solution_html = f"<div style='text-align: center;'>To equal {correct}, we add {a} and {b}.<br>{a} + {b} = {correct}</div>"
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
print(f"Successfully added new correct Addition MCQ template with ID: {new_template.template_id}")

db.close()

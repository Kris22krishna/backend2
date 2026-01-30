import requests
import json
import sys
import os

# Add path to import backend modules
sys.path.append(os.getcwd())
from app.core.security import create_access_token
from app.core.config import settings

# Generate Token
USER_ID = "31f46d25-f2ab-4d13-a012-e3dda7408284"
token = create_access_token(USER_ID, "default_tenant")
print(f"Generated Token: {token[:20]}...")

# Configuration
API_URL = "http://localhost:8000/api/v1/question-generation-templates"
HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
}

# 1. Define the Python Logic for the Template
# -------------------------------------------

# QUESTION TEMPLATE
# Generates random values, solves the problem, and creates options
question_code = """
import random

# Generate a quadratic equation with integer roots
r1 = random.randint(-8, 8)
r2 = random.randint(-8, 8)

# Calculate coefficients: (x - r1)(x - r2) = x^2 - (r1+r2)x + r1*r2 = 0
b = -(r1 + r2)
c = r1 * r2

# Format the equation string nicely
term_b = ""
if b < 0: term_b = f"- {-b}x"
elif b > 0: term_b = f"+ {b}x"

term_c = ""
if c < 0: term_c = f"- {-c}"
elif c > 0: term_c = f"+ {c}"

equation_str = f"x^2 {term_b} {term_c} = 0"

# Set the Answer
correct_answer = f"{min(r1, r2)}, {max(r1, r2)}"
answer = correct_answer

# Generate Distractors (Wrong Options) for MCQ
options = [correct_answer]
while len(options) < 4:
    # Create fake roots
    f1 = random.randint(-10, 10)
    f2 = random.randint(-10, 10)
    fake_ans = f"{min(f1, f2)}, {max(f1, f2)}"
    
    if fake_ans not in options:
        options.append(fake_ans)

random.shuffle(options)

# Set the Question HTML
question = f'''
<div class="question-content">
    <p class="text-lg text-gray-700 mb-4">Find the roots of the quadratic equation:</p>
    <div class="text-2xl font-bold text-center my-6 p-4 bg-gray-50 rounded-lg">
        $$ {equation_str} $$
    </div>
</div>
'''
"""

# ANSWER TEMPLATE
# The 'answer' variable is already set in question_code.
# We don't strictly need to do anything here, but we can access it if we want.
answer_code = """
# 'answer' variable is shared from the question script.
# We can explicitily set it (optional) or just 'pass'
pass
"""

# SOLUTION TEMPLATE
# Generates a step-by-step explanation
solution_code = """
solution = f'''
<div class="solution-content space-y-3">
    <p>To find the roots of the equation <strong>$$ {equation_str} $$</strong>, we factorize it.</p>
    
    <p>We are looking for two numbers that multiply to give <strong>{c}</strong> (constant term) 
    and add to give <strong>{b}</strong> (coefficient of x).</p>
    
    <div class="bg-blue-50 p-3 rounded border-l-4 border-blue-400 my-2">
        <p>The numbers are: <strong>{-r1}</strong> and <strong>{-r2}</strong></p>
        <p>Sum: ({-r1}) + ({-r2}) = {-(r1+r2)} = {b}</p>
        <p>Product: ({-r1}) * ({-r2}) = {r1*r2} = {c}</p>
    </div>
    
    <p>So we can write the equation as:</p>
    <p class="text-center font-mono my-2">(x - {r1})(x - {r2}) = 0</p>
    
    <p>This gives us the roots:</p>
    <p class="font-bold text-green-600">x = {r1}, x = {r2}</p>
</div>
'''
"""

# 2. Construct the Payload
# ----------------------
payload = {
    "skill_id": 1001,  # Replace with a valid Skill ID from your DB
    "grade": 10,
    "category": "Quadratic Equations",
    "skill_name": "Finding Roots by Factorization",
    "type": "MCQ",
    "format": 1,
    "difficulty": "Medium",
    "question_template": question_code,
    "answer_template": answer_code,
    "solution_template": solution_code
}

# 3. Send Request
# ---------------
print("Creating template...")
try:
    response = requests.post(API_URL, headers=HEADERS, json=payload)
    
    if response.status_code in [200, 201]:
        data = response.json()
        print("✅ Template created successfully!")
        print(f"Template ID: {data['data']['template_id']}")
    else:
        print(f"❌ Failed to create template: {response.status_code}")
        print(response.text)
        
except Exception as e:
    print(f"❌ Error: {e}")

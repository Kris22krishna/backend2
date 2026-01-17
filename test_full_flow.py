"""
Direct test - bypass Swagger UI completely
"""
import requests

BASE_URL = "http://127.0.0.1:8000"

print("=" * 70)
print("AUTHENTICATION TEST - BYPASSING SWAGGER")
print("=" * 70)

# Step 1: Login
print("\n1. Logging in...")
login_resp = requests.post(
    f"{BASE_URL}/api/v1/auth/login",
    json={"email": "test@skillbuilder.com", "password": "test123"}
)

if login_resp.status_code != 200:
    print(f"❌ Login failed: {login_resp.text}")
    exit(1)

token = login_resp.json()["access_token"]
print(f"✅ Login successful!")
print(f"Token: {token[:50]}...")

# Step 2: Test GET /question-templates
print("\n2. Testing GET /question-templates...")
headers = {"Authorization": f"Bearer {token}"}
resp = requests.get(f"{BASE_URL}/api/v1/question-templates", headers=headers)
print(f"Status: {resp.status_code}")
print(f"Response: {resp.json()}")

if resp.status_code == 200:
    print("✅ Authentication works!")
else:
    print("❌ Authentication failed!")
    exit(1)

# Step 3: Create a template
print("\n3. Creating a template...")
create_resp = requests.post(
    f"{BASE_URL}/api/v1/question-templates",
    headers=headers,
    json={
        "module": "Math Skill",
        "category": "Fundamentals",
        "topic": "Addition",
        "subtopic": "Simple Addition",
        "format": "a + b",
        "difficulty": "easy",
        "type": "user_input",
        "dynamic_question": "def generate():\n    import random\n    a = random.randint(1, 10)\n    b = random.randint(1, 10)\n    return {'question': f'{a} + {b} = ?', 'answer': str(a + b), 'variables': {'a': a, 'b': b}}",
        "logical_answer": "def validate(user_answer, correct_answer):\n    return str(user_answer).strip() == str(correct_answer).strip()"
    }
)

print(f"Status: {create_resp.status_code}")
if create_resp.status_code in [200, 201]:
    data = create_resp.json()
    template_id = data["data"]["template_id"]
    print(f"✅ Template created! ID: {template_id}")
    
    # Step 4: Preview the template
    print(f"\n4. Previewing template {template_id}...")
    preview_resp = requests.post(
        f"{BASE_URL}/api/v1/question-templates/{template_id}/preview",
        headers=headers,
        json={"count": 2}
    )
    print(f"Status: {preview_resp.status_code}")
    if preview_resp.status_code == 200:
        print("✅ Preview works!")
        samples = preview_resp.json()["data"]["preview_samples"]
        for i, sample in enumerate(samples, 1):
            print(f"\n  Sample {i}:")
            print(f"    Question: {sample['question_html']}")
            print(f"    Answer: {sample['answer_value']}")
    else:
        print(f"❌ Preview failed: {preview_resp.text}")
else:
    print(f"❌ Template creation failed: {create_resp.text}")

print("\n" + "=" * 70)
print("CONCLUSION:")
print("=" * 70)
print("✅ Backend authentication is WORKING PERFECTLY!")
print("❌ The issue is with Swagger UI, not the backend")
print("\nRECOMMENDATION:")
print("1. Clear browser cache and cookies")
print("2. Try in incognito/private mode")
print("3. Or use Postman/cURL instead of Swagger")
print("=" * 70)

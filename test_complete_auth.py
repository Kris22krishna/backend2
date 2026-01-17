"""
Test complete authentication flow
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

# Step 1: Login with test user
print("=" * 60)
print("STEP 1: LOGIN")
print("=" * 60)
login_response = requests.post(
    f"{BASE_URL}/api/v1/auth/login",
    json={
        "email": "test@skillbuilder.com",
        "password": "test123"
    }
)

print(f"Status: {login_response.status_code}")
if login_response.status_code == 200:
    data = login_response.json()
    token = data["access_token"]
    print(f"✅ Login successful!")
    print(f"Token: {token[:50]}...")
    
    # Step 2: Test authenticated endpoint
    print("\n" + "=" * 60)
    print("STEP 2: TEST AUTHENTICATED ENDPOINT")
    print("=" * 60)
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    templates_response = requests.get(
        f"{BASE_URL}/api/v1/question-templates",
        headers=headers
    )
    
    print(f"Status: {templates_response.status_code}")
    if templates_response.status_code == 200:
        print(f"✅ Authentication works!")
        print(f"Response: {json.dumps(templates_response.json(), indent=2)[:200]}...")
    else:
        print(f"❌ Authentication failed!")
        print(f"Response: {json.dumps(templates_response.json(), indent=2)}")
        
    # Step 3: Try creating a template
    print("\n" + "=" * 60)
    print("STEP 3: CREATE A TEMPLATE")
    print("=" * 60)
    create_response = requests.post(
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
    
    print(f"Status: {create_response.status_code}")
    if create_response.status_code in [200, 201]:
        print(f"✅ Template created!")
        print(f"Response: {json.dumps(create_response.json(), indent=2)[:300]}...")
    else:
        print(f"❌ Failed to create template!")
        print(f"Response: {json.dumps(create_response.json(), indent=2)}")
        
else:
    print(f"❌ Login failed!")
    print(f"Response: {json.dumps(login_response.json(), indent=2)}")

print("\n" + "=" * 60)
print("SWAGGER UI INSTRUCTIONS")
print("=" * 60)
print("1. Go to: http://127.0.0.1:8000/docs")
print("2. Click 'Authorize' button (lock icon)")
print("3. Enter: Bearer " + (token[:30] if login_response.status_code == 200 else "YOUR_TOKEN") + "...")
print("4. Click 'Authorize' then 'Close'")
print("5. Try the endpoints!")

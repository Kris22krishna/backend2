"""
Create a test user for authentication testing
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

# Create a test user
print("Creating test user...")
register_response = requests.post(
    f"{BASE_URL}/api/v1/auth/register",
    json={
        "user_type": "teacher",
        "first_name": "Test",
        "last_name": "User",
        "email": "test@skillbuilder.com",
        "phone_number": "1234567890",
        "password": "test123",
        "grade": None
    }
)

print(f"Registration Status: {register_response.status_code}")
print(f"Response: {json.dumps(register_response.json(), indent=2)}")

if register_response.status_code in [200, 201]:
    print("\n✅ User created successfully!")
    print("\nNow try logging in with:")
    print("  Email: test@skillbuilder.com")
    print("  Password: test123")
elif "already registered" in str(register_response.json()):
    print("\n✅ User already exists!")
    print("\nLogin with:")
    print("  Email: test@skillbuilder.com")
    print("  Password: test123")
else:
    print("\n❌ Failed to create user")

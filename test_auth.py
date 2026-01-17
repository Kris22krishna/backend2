"""
Test authentication flow manually
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

# Step 1: Login
print("Step 1: Logging in...")
login_response = requests.post(
    f"{BASE_URL}/api/v1/auth/login",
    json={
        "email": "test@example.com",  # Replace with actual email
        "password": "password123"      # Replace with actual password
    }
)

print(f"Login Status: {login_response.status_code}")
print(f"Login Response: {json.dumps(login_response.json(), indent=2)}")

if login_response.status_code == 200:
    token = login_response.json()["access_token"]
    print(f"\nToken received: {token[:50]}...")
    
    # Step 2: Test authenticated endpoint
    print("\nStep 2: Testing question templates endpoint...")
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    templates_response = requests.get(
        f"{BASE_URL}/api/v1/question-templates",
        headers=headers
    )
    
    print(f"Templates Status: {templates_response.status_code}")
    print(f"Templates Response: {json.dumps(templates_response.json(), indent=2)}")
    
    if templates_response.status_code == 401:
        print("\n❌ Authentication failed!")
        print("Debugging info:")
        print(f"  - Token format: Bearer {token[:20]}...")
        print(f"  - Headers sent: {headers}")
    else:
        print("\n✅ Authentication successful!")
else:
    print("\n❌ Login failed! Please check credentials.")
    print("Available endpoints to check:")
    print("  - POST /api/v1/auth/register (to create a user)")
    print("  - POST /api/v1/auth/login (to login)")

import requests
import json
import random
import string

BASE_URL = "http://localhost:8000/api/v1/auth"

def generate_random_string(length=8):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def run_test():
    # 1. Register/Login as Admin
    admin_email = f"admin_{generate_random_string()}@test.com"
    admin_pass = "admin123"
    print(f"Registering Admin: {admin_email}")
    
    reg_response = requests.post(f"{BASE_URL}/register", json={
        "username": admin_email.split('@')[0], # Use name part as username if schema allows or handled by model
        "email": admin_email,
        "password": admin_pass,
        "first_name": "Admin",
        "last_name": "User",
        "user_type": "admin",
        "phone_number": "1234567890" # Schema requires phone?
    })
    
    if reg_response.status_code != 200:
        # Maybe already exists, try login
        print(f"Registration status: {reg_response.status_code}. Response: {reg_response.text}")

    # Try Login
    print("Logging in as Admin...")
    login_response = requests.post(f"{BASE_URL}/admin-login", json={
        "username": admin_email, # Model might expect email as username for admin-login
        "password": admin_pass
    })
    
    if login_response.status_code != 200:
        # Try generic login
        login_response = requests.post(f"{BASE_URL}/login", data={
            "username": admin_email,
            "password": admin_pass
        })
    
    if login_response.status_code != 200:
        print("Failed to login as admin.")
        print(login_response.text)
        return

    tokens = login_response.json()
    access_token = tokens["access_token"]
    print("Admin Login Successful.")

    # 2. Create Uploader
    headers = {"Authorization": f"Bearer {access_token}"}
    uploader_name = "Test Upload"
    print(f"Creating Uploader: {uploader_name}")
    
    create_resp = requests.post(f"{BASE_URL}/create-uploader", json={"name": uploader_name}, headers=headers)
    
    if create_resp.status_code != 200:
        print("Failed to create uploader.")
        print(create_resp.text)
        return

    uploader_data = create_resp.json()
    print(f"Uploader Created: {uploader_data}")
    
    u_username = uploader_data["username"]
    u_code = uploader_data["access_code"]

    # 3. Login as Uploader
    print("Logging in as Uploader...")
    u_login_resp = requests.post(f"{BASE_URL}/uploader-login", json={
        "username": u_username,
        "access_code": u_code
    })

    if u_login_resp.status_code == 200:
        print("Uploader Login Successful!")
        print(u_login_resp.json())
        print("VERIFICATION PASSED.")
    else:
        print("Uploader Login Failed.")
        print(u_login_resp.text)

if __name__ == "__main__":
    run_test()

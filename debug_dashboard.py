import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/v1/dashboard/admin"

def test_endpoint(endpoint):
    url = f"{BASE_URL}/{endpoint}"
    print(f"Testing {url}...")
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Response Preview:", json.dumps(response.json(), indent=2)[:500])
        else:
            print("Error Response:", response.text)
    except Exception as e:
        print(f"Request failed: {e}")
    print("-" * 50)

if __name__ == "__main__":
    test_endpoint("stats")
    test_endpoint("charts")
    test_endpoint("students?limit=5")

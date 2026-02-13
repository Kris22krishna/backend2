"""
Test script to verify backend caching functionality and measure response times.
"""
import requests
import time

BASE_URL = "http://localhost:8000/api/v1"

def test_cache_performance():
    """Test cache performance by measuring response times"""
    print("=" * 60)
    print("Backend Caching Performance Test")
    print("=" * 60)
    
    # Test endpoint
    endpoint = f"{BASE_URL}/skills?grade=5"
    
    print(f"\nTesting endpoint: {endpoint}")
    print("-" * 60)
    
    # Test 1: First request (cold - should be slower)
    print("\n1. First request (cold start)...")
    start = time.time()
    try:
        response1 = requests.get(endpoint)
        elapsed1 = (time.time() - start) * 1000  # Convert to ms
        print(f"   Status: {response1.status_code}")
        print(f"   Response time: {elapsed1:.2f} ms")
        print(f"   Skills returned: {len(response1.json())}")
    except Exception as e:
        print(f"   ERROR: {e}")
        return
    
    # Test 2: Second request (should be cached - much faster)
    print("\n2. Second request (cached)...")
    start = time.time()
    try:
        response2 = requests.get(endpoint)
        elapsed2 = (time.time() - start) * 1000
        print(f"   Status: {response2.status_code}")
        print(f"   Response time: {elapsed2:.2f} ms")
        print(f"   Skills returned: {len(response2.json())}")
    except Exception as e:
        print(f"   ERROR: {e}")
        return
    
    # Test 3: Third request (still cached)
    print("\n3. Third request (still cached)...")
    start = time.time()
    try:
        response3 = requests.get(endpoint)
        elapsed3 = (time.time() - start) * 1000
        print(f"   Status: {response3.status_code}")
        print(f"   Response time: {elapsed3:.2f} ms")
        print(f"   Skills returned: {len(response3.json())}")
    except Exception as e:
        print(f"   ERROR: {e}")
        return
    
    # Calculate improvement
    print("\n" + "=" * 60)
    print("RESULTS")
    print("=" * 60)
    print(f"First request (cold):  {elapsed1:.2f} ms")
    print(f"Second request (cached): {elapsed2:.2f} ms")
    print(f"Third request (cached):  {elapsed3:.2f} ms")
    
    if elapsed1 > elapsed2:
        improvement = ((elapsed1 - elapsed2) / elapsed1) * 100
        speedup = elapsed1 / elapsed2
        print(f"\n✓ Cache is working!")
        print(f"  - Response time improved by {improvement:.1f}%")
        print(f"  - {speedup:.1f}x faster")
    else:
        print(f"\n⚠ Cache may not be working as expected")
    
    print("\n" + "=" * 60)
    
    # Test different grade
    print("\nTesting different grade (should have separate cache)...")
    endpoint2 = f"{BASE_URL}/skills?grade=6"
    print(f"Endpoint: {endpoint2}")
    
    start = time.time()
    try:
        response4 = requests.get(endpoint2)
        elapsed4 = (time.time() - start) * 1000
        print(f"Response time: {elapsed4:.2f} ms")
        print(f"Skills returned: {len(response4.json())}")
    except Exception as e:
        print(f"ERROR: {e}")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    test_cache_performance()

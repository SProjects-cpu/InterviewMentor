"""
Test MongoDB API Endpoints
Tests the MongoDB-enabled Flask API to ensure all endpoints work correctly
"""

import requests
import json
import time
import sys

# API base URL
BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test health check endpoint"""
    print("🔍 Testing health check endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data['status']}")
            print(f"📊 Database: {data['database']}")
            print(f"📊 Collections: {data['collections']}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check error: {e}")
        return False

def test_user_registration():
    """Test user registration"""
    print("\n🔍 Testing user registration...")
    try:
        user_data = {
            "username": f"testuser_{int(time.time())}",
            "password": "testpassword123",
            "email": "test@example.com"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json=user_data,
            timeout=5
        )
        
        if response.status_code == 201:
            data = response.json()
            print(f"✅ User registration successful: {data['user']['username']}")
            return data['token'], data['user']
        else:
            print(f"❌ User registration failed: {response.status_code} - {response.text}")
            return None, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ User registration error: {e}")
        return None, None

def test_user_login(username, password):
    """Test user login"""
    print("\n🔍 Testing user login...")
    try:
        login_data = {
            "username": username,
            "password": password
        }
        
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=login_data,
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ User login successful: {data['user']['username']}")
            return data['token']
        else:
            print(f"❌ User login failed: {response.status_code} - {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ User login error: {e}")
        return None

def test_get_current_user(token):
    """Test get current user endpoint"""
    print("\n🔍 Testing get current user...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers=headers,
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Get current user successful: {data['user']['username']}")
            return True
        else:
            print(f"❌ Get current user failed: {response.status_code} - {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Get current user error: {e}")
        return False

def test_aptitude_categories():
    """Test aptitude categories endpoint"""
    print("\n🔍 Testing aptitude categories...")
    try:
        response = requests.get(f"{BASE_URL}/api/aptitude/categories", timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            categories = data['categories']
            print(f"✅ Aptitude categories successful: {len(categories)} categories")
            for cat in categories:
                print(f"  - {cat['name']}: {cat['description']}")
            return True
        else:
            print(f"❌ Aptitude categories failed: {response.status_code} - {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Aptitude categories error: {e}")
        return False

def test_category_tests(category_id):
    """Test category tests endpoint"""
    print(f"\n🔍 Testing category tests for {category_id}...")
    try:
        response = requests.get(f"{BASE_URL}/api/aptitude/categories/{category_id}", timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            category = data['category']
            tests = category['tests']
            print(f"✅ Category tests successful: {len(tests)} tests for {category['name']}")
            for test in tests:
                print(f"  - {test['name']}: {test['questions']} questions, {test['time']} min")
            return True
        else:
            print(f"❌ Category tests failed: {response.status_code} - {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Category tests error: {e}")
        return False

def wait_for_server():
    """Wait for server to start"""
    print("⏳ Waiting for server to start...")
    for i in range(30):  # Wait up to 30 seconds
        try:
            response = requests.get(f"{BASE_URL}/api/health", timeout=2)
            if response.status_code == 200:
                print("✅ Server is ready!")
                return True
        except:
            pass
        time.sleep(1)
        print(f"   Waiting... ({i+1}/30)")
    
    print("❌ Server did not start in time")
    return False

def main():
    """Run all API tests"""
    print("🚀 Starting MongoDB API Tests...")
    print("=" * 50)
    
    # Wait for server to be ready
    if not wait_for_server():
        print("❌ Cannot connect to server. Please ensure the API is running on port 5000")
        return False
    
    # Run tests
    tests = []
    
    # Test health check
    tests.append(("Health Check", test_health_check()))
    
    # Test user registration
    token, user = test_user_registration()
    tests.append(("User Registration", token is not None))
    
    if token and user:
        # Test user login
        login_token = test_user_login(user['username'], "testpassword123")
        tests.append(("User Login", login_token is not None))
        
        # Test get current user
        if login_token:
            tests.append(("Get Current User", test_get_current_user(login_token)))
    
    # Test aptitude endpoints (no auth required)
    tests.append(("Aptitude Categories", test_aptitude_categories()))
    tests.append(("Category Tests - Logical", test_category_tests("logical")))
    tests.append(("Category Tests - Verbal", test_category_tests("verbal")))
    
    # Summary
    print("\n" + "=" * 50)
    print("📋 Test Results Summary:")
    
    passed = 0
    for test_name, result in tests:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"  {status}: {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("🎉 All tests passed! MongoDB API is working correctly!")
        return True
    else:
        print("⚠️ Some tests failed. Please check the issues above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

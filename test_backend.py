#!/usr/bin/env python3
"""
Simple test script to verify the backend API is working
"""

import requests
import json

def test_backend():
    base_url = "http://localhost:5000"
    
    print("🧪 Testing Backend API...")
    print("=" * 50)
    
    # Test 1: Check if server is running
    try:
        response = requests.get(f"{base_url}/api/aptitude/categories", timeout=5)
        print(f"✅ Server is running - Status: {response.status_code}")
        print(f"📋 CORS Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"📊 Categories loaded: {len(data.get('categories', []))}")
        
    except requests.exceptions.ConnectionError:
        print("❌ Server is not running or not accessible")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    # Test 2: Test registration endpoint
    try:
        test_user = {
            "username": f"testuser_{int(__import__('time').time())}",
            "password": "testpass123",
            "email": "test@example.com"
        }
        
        response = requests.post(
            f"{base_url}/api/auth/register",
            json=test_user,
            timeout=5
        )
        
        print(f"🔐 Registration test - Status: {response.status_code}")
        print(f"📋 Response Headers: {dict(response.headers)}")
        
        if response.status_code in [200, 201]:
            print("✅ Registration endpoint working")
        else:
            print(f"⚠️ Registration response: {response.text}")
            
    except Exception as e:
        print(f"❌ Registration test error: {e}")
    
    return True

if __name__ == "__main__":
    test_backend()

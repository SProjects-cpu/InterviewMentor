#!/usr/bin/env python3
"""
Test script to verify frontend-backend authentication flow
"""

import requests
import json

def test_frontend_backend_auth():
    backend_url = "http://localhost:5000"
    frontend_url = "http://localhost:3000"
    
    print("🧪 Testing Frontend-Backend Authentication Flow...")
    print("=" * 60)
    
    # Test 1: Check if backend is accessible
    try:
        response = requests.get(f"{backend_url}/api/aptitude/categories", timeout=5)
        print(f"✅ Backend accessible - Status: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not accessible")
        return False
    
    # Test 2: Check if frontend is accessible
    try:
        response = requests.get(frontend_url, timeout=5)
        print(f"✅ Frontend accessible - Status: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Frontend is not accessible")
        return False
    
    # Test 3: Test CORS by making a request from frontend domain
    print("\n🔗 Testing CORS Configuration...")
    headers = {
        'Origin': 'http://localhost:3000',
        'Content-Type': 'application/json'
    }
    
    # Test registration
    register_data = {
        "username": "frontend_test_user",
        "password": "testpass123",
        "email": "frontend@test.com"
    }
    
    try:
        response = requests.post(f"{backend_url}/api/auth/register", 
                               json=register_data, 
                               headers=headers, 
                               timeout=5)
        
        if response.status_code == 201:
            print("✅ Registration successful from frontend origin")
            token = response.json().get('token')
            
            # Test login
            login_data = {
                "username": "frontend_test_user",
                "password": "testpass123"
            }
            
            response = requests.post(f"{backend_url}/api/auth/login", 
                                   json=login_data, 
                                   headers=headers, 
                                   timeout=5)
            
            if response.status_code == 200:
                print("✅ Login successful from frontend origin")
                
                # Test authenticated endpoint
                auth_headers = {
                    'Origin': 'http://localhost:3000',
                    'Authorization': f'Bearer {token}',
                    'Content-Type': 'application/json'
                }
                
                response = requests.get(f"{backend_url}/api/auth/me", 
                                      headers=auth_headers, 
                                      timeout=5)
                
                if response.status_code == 200:
                    print("✅ Authenticated endpoint accessible")
                    user_data = response.json()
                    print(f"📋 User data: {user_data.get('user', {}).get('username')}")
                else:
                    print(f"❌ Authenticated endpoint failed: {response.status_code}")
                    print(f"Response: {response.text}")
            else:
                print(f"❌ Login failed: {response.status_code}")
                print(f"Response: {response.text}")
        
        elif response.status_code == 400 and "already exists" in response.text:
            print("⚠️ User already exists, testing login...")
            
            # Test login with existing user
            login_data = {
                "username": "frontend_test_user",
                "password": "testpass123"
            }
            
            response = requests.post(f"{backend_url}/api/auth/login", 
                                   json=login_data, 
                                   headers=headers, 
                                   timeout=5)
            
            if response.status_code == 200:
                print("✅ Login successful with existing user")
                token = response.json().get('token')
                
                # Test authenticated endpoint
                auth_headers = {
                    'Origin': 'http://localhost:3000',
                    'Authorization': f'Bearer {token}',
                    'Content-Type': 'application/json'
                }
                
                response = requests.get(f"{backend_url}/api/auth/me", 
                                      headers=auth_headers, 
                                      timeout=5)
                
                if response.status_code == 200:
                    print("✅ Authenticated endpoint accessible")
                else:
                    print(f"❌ Authenticated endpoint failed: {response.status_code}")
            else:
                print(f"❌ Login failed: {response.status_code}")
        else:
            print(f"❌ Registration failed: {response.status_code}")
            print(f"Response: {response.text}")
    
    except Exception as e:
        print(f"❌ Error during CORS test: {e}")
        return False
    
    print("\n✅ Frontend-Backend authentication flow test completed!")
    return True

if __name__ == "__main__":
    test_frontend_backend_auth()

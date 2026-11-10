#!/usr/bin/env python3
"""
Test script for coding test API endpoints
"""

import requests
import json

def test_coding_api():
    base_url = "http://localhost:5000"
    
    print("🧪 Testing Coding Test API...")
    print("=" * 50)
    
    # First, register a test user to get a token
    try:
        register_data = {
            "username": "testuser_coding",
            "password": "testpass123",
            "email": "test@example.com"
        }
        
        response = requests.post(f"{base_url}/api/auth/register", json=register_data, timeout=5)
        if response.status_code == 201:
            token = response.json().get('token')
            print(f"✅ Got auth token: {token[:20]}...")
        else:
            # Try login instead
            login_data = {
                "username": "testuser_coding",
                "password": "testpass123"
            }
            response = requests.post(f"{base_url}/api/auth/login", json=login_data, timeout=5)
            if response.status_code == 200:
                token = response.json().get('token')
                print(f"✅ Got auth token via login: {token[:20]}...")
            else:
                print(f"❌ Failed to get auth token: {response.status_code}")
                return False
        
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test 1: Get coding challenges
        print("\n📋 Testing GET /api/coding/challenges")
        response = requests.get(f"{base_url}/api/coding/challenges", headers=headers, timeout=5)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            challenges = data.get('challenges', [])
            print(f"✅ Found {len(challenges)} challenges")
            
            if challenges:
                challenge = challenges[0]
                print(f"📝 First challenge: {challenge.get('title')} ({challenge.get('difficulty')})")
                
                # Test 2: Get specific challenge
                challenge_id = challenge.get('id')
                print(f"\n🎯 Testing GET /api/coding/challenges/{challenge_id}")
                response = requests.get(f"{base_url}/api/coding/challenges/{challenge_id}", headers=headers, timeout=5)
                print(f"Status: {response.status_code}")
                
                if response.status_code == 200:
                    challenge_data = response.json()
                    print(f"✅ Got challenge details: {challenge_data.get('challenge', {}).get('title')}")
                    
                    # Test 3: Execute simple code
                    print(f"\n⚡ Testing POST /api/coding/execute")
                    execute_data = {
                        "code": "print('Hello, World!')",
                        "language": "python",
                        "challenge_id": challenge_id
                    }
                    response = requests.post(f"{base_url}/api/coding/execute", json=execute_data, headers=headers, timeout=10)
                    print(f"Status: {response.status_code}")
                    
                    if response.status_code == 200:
                        result = response.json()
                        print(f"✅ Code execution successful")
                        print(f"📤 Output: {result.get('execution_result', {}).get('output', 'No output')}")
                        print(f"🤖 AI Review: {result.get('ai_review', {}).get('status', 'No review')}")
                    else:
                        print(f"❌ Code execution failed: {response.text}")
                else:
                    print(f"❌ Failed to get challenge details: {response.text}")
            else:
                print("⚠️ No challenges found in database")
        else:
            print(f"❌ Failed to get challenges: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Server is not running or not accessible")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    print("\n✅ Coding API test completed!")
    return True

if __name__ == "__main__":
    test_coding_api()

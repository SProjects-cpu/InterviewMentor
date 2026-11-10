#!/usr/bin/env python3
"""
Test script to verify the optimized AI review functionality
"""

import requests
import json

def test_ai_review():
    """Test the optimized AI review system"""
    print("🧪 Testing Optimized AI Review System...")
    print("=" * 50)
    
    # Test data
    test_code = '''
def solution(input_string):
    return input_string[::-1]

print(solution("Hello"))
'''
    
    # API endpoint
    url = "http://localhost:5000/api/coding/execute"
    
    # Request data
    data = {
        "code": test_code,
        "language": "python",
        "challenge_id": 1  # String reversal challenge
    }
    
    try:
        print("📤 Sending code execution request...")
        response = requests.post(url, json=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Code execution successful!")
            print(f"📤 Execution Output: {result.get('execution_result', {}).get('output', 'No output')}")
            
            # Check AI review
            ai_review = result.get('ai_review', {})
            if ai_review.get('status') == 'success':
                print("\n🤖 AI Review Generated:")
                print("-" * 30)
                review_content = ai_review.get('review', '')
                print(review_content)
                print("-" * 30)
                
                # Check if review is concise (under 200 characters for token efficiency)
                review_length = len(review_content)
                print(f"\n📊 Review Length: {review_length} characters")
                
                if review_length < 200:
                    print("✅ Review is concise and token-efficient!")
                else:
                    print("⚠️ Review might be too long for optimal token usage")
                    
            else:
                print(f"❌ AI Review failed: {ai_review.get('message', 'Unknown error')}")
                
        else:
            print(f"❌ Request failed with status {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error testing AI review: {str(e)}")

if __name__ == "__main__":
    test_ai_review()

"""
Test GraphQL Setup and Implementation
Tests the GraphQL schema, resolvers, and API endpoints
"""

import requests
import json
import time
import sys
from datetime import datetime

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
            print(f"🔗 GraphQL: {data.get('graphql', 'not specified')}")
            print(f"📊 Collections: {data['collections']}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check error: {e}")
        return False

def test_graphql_info():
    """Test GraphQL info endpoint"""
    print("\n🔍 Testing GraphQL info endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/graphql/info", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ GraphQL info retrieved successfully")
            print(f"🔗 GraphQL endpoint: {data['graphql_endpoint']}")
            print(f"🔍 GraphiQL enabled: {data['graphiql_enabled']}")
            print(f"📋 Schema valid: {data['schema_valid']}")
            print(f"📖 Documentation: {data['documentation']}")
            return True
        else:
            print(f"❌ GraphQL info failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ GraphQL info error: {e}")
        return False

def test_graphql_introspection():
    """Test GraphQL introspection query"""
    print("\n🔍 Testing GraphQL introspection...")
    
    introspection_query = """
    query IntrospectionQuery {
        __schema {
            queryType {
                name
                fields {
                    name
                    type {
                        name
                    }
                }
            }
            mutationType {
                name
                fields {
                    name
                    type {
                        name
                    }
                }
            }
        }
    }
    """
    
    try:
        response = requests.post(
            f"{BASE_URL}/graphql",
            json={"query": introspection_query},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'data' in data and '__schema' in data['data']:
                schema = data['data']['__schema']
                print("✅ GraphQL introspection successful")
                
                # Print query fields
                if schema['queryType'] and schema['queryType']['fields']:
                    print(f"📋 Query fields ({len(schema['queryType']['fields'])}):")
                    for field in schema['queryType']['fields'][:5]:  # Show first 5
                        print(f"   - {field['name']}")
                    if len(schema['queryType']['fields']) > 5:
                        print(f"   ... and {len(schema['queryType']['fields']) - 5} more")
                
                # Print mutation fields
                if schema['mutationType'] and schema['mutationType']['fields']:
                    print(f"🔄 Mutation fields ({len(schema['mutationType']['fields'])}):")
                    for field in schema['mutationType']['fields'][:5]:  # Show first 5
                        print(f"   - {field['name']}")
                    if len(schema['mutationType']['fields']) > 5:
                        print(f"   ... and {len(schema['mutationType']['fields']) - 5} more")
                
                return True
            else:
                print(f"❌ Invalid introspection response: {data}")
                return False
        else:
            print(f"❌ GraphQL introspection failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ GraphQL introspection error: {e}")
        return False

def test_graphql_simple_query():
    """Test a simple GraphQL query"""
    print("\n🔍 Testing simple GraphQL query...")
    
    simple_query = """
    query GetGlobalStats {
        globalStats {
            totalUsers
            totalQuizResults
            totalCodingSolutions
            averageScore
            popularTests
        }
    }
    """
    
    try:
        response = requests.post(
            f"{BASE_URL}/graphql",
            json={"query": simple_query},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'data' in data and 'globalStats' in data['data']:
                stats = data['data']['globalStats']
                print("✅ Simple GraphQL query successful")
                print(f"📊 Global Statistics:")
                print(f"   - Total Users: {stats['totalUsers']}")
                print(f"   - Total Quiz Results: {stats['totalQuizResults']}")
                print(f"   - Total Coding Solutions: {stats['totalCodingSolutions']}")
                print(f"   - Average Score: {stats['averageScore']:.2f}%")
                print(f"   - Popular Tests: {stats['popularTests']}")
                return True
            else:
                print(f"❌ Invalid query response: {data}")
                return False
        else:
            print(f"❌ Simple GraphQL query failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Simple GraphQL query error: {e}")
        return False

def test_graphql_mutation():
    """Test a GraphQL mutation (user registration)"""
    print("\n🔍 Testing GraphQL mutation...")
    
    # Generate unique username for testing
    timestamp = int(time.time())
    test_username = f"graphql_test_user_{timestamp}"
    
    mutation = """
    mutation RegisterUser($input: UserInput!) {
        registerUser(input: $input) {
            success
            message
            token
            user {
                id
                username
                email
                createdAt
            }
        }
    }
    """
    
    variables = {
        "input": {
            "username": test_username,
            "password": "test_password_123",
            "email": f"{test_username}@test.com"
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/graphql",
            json={"query": mutation, "variables": variables},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'data' in data and 'registerUser' in data['data']:
                result = data['data']['registerUser']
                if result['success']:
                    print("✅ GraphQL mutation successful")
                    print(f"👤 Created user: {result['user']['username']}")
                    print(f"📧 Email: {result['user']['email']}")
                    print(f"🔑 Token received: {result['token'][:20]}...")
                    return True, result['token']
                else:
                    print(f"❌ Mutation failed: {result['message']}")
                    return False, None
            else:
                print(f"❌ Invalid mutation response: {data}")
                return False, None
        else:
            print(f"❌ GraphQL mutation failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ GraphQL mutation error: {e}")
        return False, None

def test_authenticated_query(token):
    """Test an authenticated GraphQL query"""
    print("\n🔍 Testing authenticated GraphQL query...")
    
    query = """
    query GetUsers($limit: Int) {
        users(limit: $limit) {
            id
            username
            email
            createdAt
        }
    }
    """
    
    variables = {"limit": 5}
    
    try:
        response = requests.post(
            f"{BASE_URL}/graphql",
            json={"query": query, "variables": variables},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}"
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'data' in data and 'users' in data['data']:
                users = data['data']['users']
                print("✅ Authenticated GraphQL query successful")
                print(f"👥 Retrieved {len(users)} users:")
                for user in users[:3]:  # Show first 3
                    print(f"   - {user['username']} ({user['email']})")
                if len(users) > 3:
                    print(f"   ... and {len(users) - 3} more")
                return True
            else:
                print(f"❌ Invalid authenticated query response: {data}")
                return False
        else:
            print(f"❌ Authenticated GraphQL query failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Authenticated GraphQL query error: {e}")
        return False

def main():
    """Run all GraphQL tests"""
    print("🚀 Starting GraphQL Setup Tests...")
    print("=" * 50)
    
    # Test results
    results = []
    
    # Test 1: Health check
    results.append(("Health Check", test_health_check()))
    
    # Test 2: GraphQL info
    results.append(("GraphQL Info", test_graphql_info()))
    
    # Test 3: GraphQL introspection
    results.append(("GraphQL Introspection", test_graphql_introspection()))
    
    # Test 4: Simple query
    results.append(("Simple Query", test_graphql_simple_query()))
    
    # Test 5: Mutation
    mutation_success, token = test_graphql_mutation()
    results.append(("GraphQL Mutation", mutation_success))
    
    # Test 6: Authenticated query (if we have a token)
    if token:
        results.append(("Authenticated Query", test_authenticated_query(token)))
    
    # Print summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if success:
            passed += 1
    
    print(f"\n🎯 Overall Result: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All GraphQL tests passed! Phase 2 implementation is working correctly.")
        print("\n🔗 GraphQL endpoints available:")
        print(f"   - GraphQL API: {BASE_URL}/graphql")
        print(f"   - GraphiQL Interface: {BASE_URL}/graphql")
        print(f"   - GraphQL Info: {BASE_URL}/api/graphql/info")
    else:
        print("⚠️ Some tests failed. Please check the implementation.")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

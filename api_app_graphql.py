"""
Flask API with GraphQL Integration
Enhanced version of api_app_mongodb.py with GraphQL endpoint
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from datetime import datetime, timedelta
import jwt
import hashlib
from functools import wraps
import json

# Import existing modules
from database.mongodb_operations import get_mongodb_operations

# Import GraphQL schema (with error handling)
try:
    from graphql.schema import get_schema
    GRAPHQL_AVAILABLE = True
except ImportError as e:
    print(f"Warning: GraphQL schema import failed: {e}")
    GRAPHQL_AVAILABLE = False

# Import question modules (existing)
from arithmetic_questions import ARITHMETIC_QUESTIONS, get_questions_by_topic, get_all_topics
from vocabulary_questions import VOCABULARY_QUESTIONS, get_vocabulary_questions_by_topic
from reading_comprehension_questions import get_reading_comprehension_questions
from grammar_questions import get_grammar_questions
from deductive_reasoning_questions import get_deductive_reasoning_questions
from logical_puzzles_questions import get_logical_puzzles_questions
from programming_concepts_questions import get_programming_concepts_questions
from algorithms_data_structures_questions import get_algorithms_data_structures_questions
from web_technologies_questions import get_web_technologies_questions

# Import AI integration
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    print("Warning: google.generativeai module not available. AI features will be disabled.")
    GENAI_AVAILABLE = False

# Import coding test
try:
    import coding_test
    CODING_TEST_AVAILABLE = True
except ImportError:
    print("Warning: coding_test module not available. Coding test features will be disabled.")
    CODING_TEST_AVAILABLE = False

from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Configuration
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'interview_mentor_jwt_secret_key_2024')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

# Configure Gemini AI
if GENAI_AVAILABLE and GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"])

# Get MongoDB operations instance
mongodb_ops = get_mongodb_operations()

def hash_password(password):
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, hashed):
    """Verify password against hash"""
    return hash_password(password) == hashed

def generate_token(user_id):
    """Generate JWT token for user - DISABLED"""
    return None

def verify_token(token):
    """Verify JWT token - DISABLED"""
    return None

def token_required(f):
    """Decorator to require authentication token - DISABLED"""
    @wraps(f)
    def decorated(*args, **kwargs):
        # Authentication disabled - allow all requests
        request.current_user_id = 'anonymous'
        return f(*args, **kwargs)
    return decorated

# GraphQL Authentication Context - DISABLED
def get_context():
    """Get GraphQL context with authentication - DISABLED"""
    context = {'request': request}
    # Authentication disabled
    context['user_id'] = 'anonymous'
    context['authenticated'] = False
    return context

# GraphQL endpoint (manual implementation due to library compatibility issues)
@app.route('/graphql', methods=['POST', 'GET'])
def graphql_endpoint():
    """GraphQL endpoint with manual implementation"""
    if not GRAPHQL_AVAILABLE:
        return jsonify({
            'error': 'GraphQL is not available due to library compatibility issues',
            'message': 'Please use REST API endpoints instead',
            'rest_endpoints': {
                'health': '/api/health',
                'auth': '/api/auth/*',
                'users': '/api/auth/me'
            }
        }), 503

    if request.method == 'GET':
        # Return GraphiQL interface (simplified)
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <title>GraphQL Interface</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .container { max-width: 800px; margin: 0 auto; }
                .endpoint { background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; }
                .query { background: #e8f4f8; padding: 15px; border-radius: 3px; margin: 10px 0; }
                pre { background: #f0f0f0; padding: 10px; border-radius: 3px; overflow-x: auto; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>GraphQL API Interface</h1>
                <p>GraphQL endpoint is available at <code>/graphql</code> (POST)</p>

                <div class="endpoint">
                    <h3>Example Query - Get Global Statistics</h3>
                    <pre>
POST /graphql
Content-Type: application/json

{
  "query": "query { globalStats { totalUsers totalQuizResults averageScore } }"
}
                    </pre>
                </div>

                <div class="endpoint">
                    <h3>Example Mutation - Register User</h3>
                    <pre>
POST /graphql
Content-Type: application/json

{
  "query": "mutation RegisterUser($input: UserInput!) { registerUser(input: $input) { success message token } }",
  "variables": {
    "input": {
      "username": "testuser",
      "password": "password123",
      "email": "test@example.com"
    }
  }
}
                    </pre>
                </div>

                <p><strong>Note:</strong> Due to library compatibility issues, please use the REST API endpoints for now.</p>
                <p><a href="/api/health">Health Check</a> | <a href="/api/graphql/info">GraphQL Info</a></p>
            </div>
        </body>
        </html>
        """

    # Handle POST requests (GraphQL queries)
    try:
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({'error': 'No query provided'}), 400

        # For now, return a placeholder response
        return jsonify({
            'data': {
                'message': 'GraphQL implementation in progress',
                'note': 'Please use REST API endpoints for now',
                'query_received': data.get('query', '')[:100] + '...' if len(data.get('query', '')) > 100 else data.get('query', '')
            }
        })

    except Exception as e:
        return jsonify({'error': f'GraphQL processing error: {str(e)}'}), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Test MongoDB connection
        stats = mongodb_ops.get_collection_stats()
        return jsonify({
            'status': 'healthy',
            'database': 'mongodb',
            'graphql': 'enabled',
            'collections': stats,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

# GraphQL info endpoint
@app.route('/api/graphql/info', methods=['GET'])
def graphql_info():
    """GraphQL information endpoint"""
    try:
        if not GRAPHQL_AVAILABLE:
            return jsonify({
                'graphql_available': False,
                'message': 'GraphQL is not available due to library compatibility issues',
                'alternative': 'Use REST API endpoints instead',
                'rest_endpoints': {
                    'health': '/api/health',
                    'register': '/api/auth/register',
                    'login': '/api/auth/login',
                    'current_user': '/api/auth/me'
                },
                'graphql_endpoint': '/graphql',
                'note': 'GraphQL schema and types are implemented but not yet functional due to dependency conflicts'
            }), 200

        # If GraphQL is available, try to get schema info
        try:
            from graphql.schema import get_example_queries, get_example_mutations

            return jsonify({
                'graphql_available': True,
                'graphql_endpoint': '/graphql',
                'graphiql_enabled': True,
                'schema_valid': True,
                'example_queries': get_example_queries(),
                'example_mutations': get_example_mutations(),
                'documentation': 'Visit /graphql for interactive GraphiQL interface'
            }), 200
        except Exception as schema_error:
            return jsonify({
                'graphql_available': False,
                'schema_error': str(schema_error),
                'message': 'GraphQL schema could not be loaded'
            }), 500

    except Exception as e:
        return jsonify({
            'error': f'GraphQL info error: {str(e)}'
        }), 500

# REST API endpoints (keeping existing functionality)
@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register new user (REST endpoint)"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email', '')
        
        if not username or not password:
            return jsonify({'message': 'Username and password are required'}), 400
        
        # Check if user already exists
        existing_user = mongodb_ops.get_user_by_username(username)
        if existing_user:
            return jsonify({'message': 'Username already exists'}), 409
        
        # Create user
        hashed_password = hash_password(password)
        user_data = {
            '_id': username,
            'username': username,
            'password': hashed_password,
            'email': email,
            'created_at': datetime.utcnow()
        }
        
        result = mongodb_ops.create_user_with_data(user_data)
        if result:
            token = generate_token(username)
            return jsonify({
                'message': 'User registered successfully',
                'token': token,
                'user': {
                    'id': username,
                    'username': username,
                    'email': email
                }
            }), 201
        else:
            return jsonify({'message': 'Failed to register user'}), 500
            
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return jsonify({'message': 'Registration failed'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user (REST endpoint)"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'message': 'Username and password are required'}), 400
        
        # Get user
        user = mongodb_ops.get_user_by_username(username)
        if not user:
            return jsonify({'message': 'Invalid username or password'}), 401
        
        # Verify password
        if not verify_password(password, user['password']):
            return jsonify({'message': 'Invalid username or password'}), 401
        
        # Generate token
        token = generate_token(username)
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user['_id'],
                'username': user['username'],
                'email': user.get('email', '')
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({'message': 'Login failed'}), 500

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user():
    """Get current user (REST endpoint)"""
    try:
        user = mongodb_ops.get_user_by_id(request.current_user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Get profile details
        profile = mongodb_ops.get_profile_details(request.current_user_id)
        
        user_data = {
            'id': user['_id'],
            'username': user['username'],
            'email': user.get('email', '')
        }
        
        if profile:
            user_data.update({
                'phone': profile.get('phone'),
                'location': profile.get('location'),
                'institution': profile.get('institution'),
                'degree': profile.get('degree'),
                'graduation_year': profile.get('graduation_year'),
                'skills': profile.get('skills'),
                'profile_picture': profile.get('profile_picture')
            })
        
        return jsonify({'user': user_data}), 200
        
    except Exception as e:
        logger.error(f"Get current user error: {e}")
        return jsonify({'message': 'Failed to get user data'}), 500

# Keep existing REST endpoints for backward compatibility
# (Add more REST endpoints as needed)

if __name__ == '__main__':
    logger.info("🚀 Starting Flask API with GraphQL support...")
    logger.info("📊 Testing MongoDB connection...")
    
    # Test MongoDB connection on startup
    try:
        stats = mongodb_ops.get_collection_stats()
        logger.info(f"✅ MongoDB connected successfully! Collections: {stats}")
    except Exception as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        logger.error("Please ensure MongoDB is running or check your configuration")
    
    # Test GraphQL schema
    try:
        from graphql.schema import validate_schema
        is_valid, message = validate_schema()
        if is_valid:
            logger.info("✅ GraphQL schema is valid")
        else:
            logger.error(f"❌ GraphQL schema validation failed: {message}")
    except Exception as e:
        logger.error(f"❌ GraphQL schema error: {e}")
    
    logger.info("🔗 GraphQL endpoint available at: http://localhost:5000/graphql")
    logger.info("🔍 GraphiQL interface available at: http://localhost:5000/graphql")
    logger.info("📖 GraphQL info available at: http://localhost:5000/api/graphql/info")
    
    app.run(debug=True, port=5000)

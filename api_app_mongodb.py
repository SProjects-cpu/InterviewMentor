"""
Flask API Application with MongoDB Support
Updated version of api_app.py that uses MongoDB instead of SQLite
"""

import os
import hashlib
import logging
from datetime import datetime, timedelta
from functools import wraps
import jwt
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Import question modules
from arithmetic_questions import ARITHMETIC_QUESTIONS, get_questions_by_topic, get_all_topics
from vocabulary_questions import VOCABULARY_QUESTIONS, get_vocabulary_questions_by_topic
from reading_comprehension_questions import get_reading_comprehension_questions
from grammar_questions import get_grammar_questions
from deductive_reasoning_questions import get_deductive_reasoning_questions
from logical_puzzles_questions import get_logical_puzzles_questions
from programming_concepts_questions import get_programming_concepts_questions
from algorithms_data_structures_questions import get_algorithms_data_structures_questions
from web_technologies_questions import get_web_technologies_questions

# Import MongoDB operations
from database.mongodb_operations import get_mongodb_operations

# Import coding test module with error handling
try:
    import coding_test
    CODING_TEST_AVAILABLE = True
except ImportError:
    print("Warning: coding_test module not available. Coding test features will be disabled.")
    CODING_TEST_AVAILABLE = False

# Import Gemini AI with error handling
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    print("Warning: google.generativeai not available. AI features will be disabled.")
    GENAI_AVAILABLE = False

import json

# Load environment variables from .env file
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")

# Configure Gemini API
if GEMINI_API_KEY and GENAI_AVAILABLE:
    genai.configure(api_key=GEMINI_API_KEY)
    GEMINI_MODEL = "models/gemini-1.5-flash"
    print(f"Configured Gemini API with model: {GEMINI_MODEL}")

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
    """Verify JWT token and return user_id - DISABLED"""
    return None

def token_required(f):
    """Decorator to require valid JWT token - DISABLED"""
    @wraps(f)
    def decorated(*args, **kwargs):
        # Authentication disabled - allow all requests
        request.current_user_id = 'anonymous'
        return f(*args, **kwargs)
    return decorated

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
            'collections': stats,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

# Authentication Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email', '')
        
        if not username or not password:
            return jsonify({'message': 'Username and password are required'}), 400
        
        # Check if username already exists
        existing_user = mongodb_ops.get_user_by_username(username)
        if existing_user:
            return jsonify({'message': 'Username already exists'}), 400
        
        # Create new user
        hashed_password = hash_password(password)
        user_id = username  # Using username as ID for simplicity
        
        if mongodb_ops.create_user(user_id, username, hashed_password, email):
            # Generate token
            token = generate_token(user_id)
            
            return jsonify({
                'message': 'User created successfully',
                'token': token,
                'user': {
                    'id': user_id,
                    'username': username,
                    'email': email
                }
            }), 201
        else:
            return jsonify({'message': 'Failed to create user'}), 500
        
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return jsonify({'message': f'Registration failed: {str(e)}'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'message': 'Username and password are required'}), 400
        
        # Verify user credentials
        user = mongodb_ops.get_user_by_username(username)
        if not user or not verify_password(password, user['password']):
            return jsonify({'message': 'Invalid username or password'}), 401
        
        # Generate token
        token = generate_token(user['_id'])
        
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
        return jsonify({'message': f'Login failed: {str(e)}'}), 500

@app.route('/api/auth/logout', methods=['POST'])
@token_required
def logout():
    # In a stateless JWT system, logout is handled client-side
    return jsonify({'message': 'Logout successful'}), 200

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user():
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
        return jsonify({'message': f'Failed to get user: {str(e)}'}), 500

# Aptitude Test Routes
@app.route('/api/aptitude/categories', methods=['GET'])
def get_aptitude_categories():
    categories = [
        {
            'id': 'logical',
            'name': 'Logical Reasoning',
            'icon': 'brain',
            'description': 'Test your logical thinking and problem-solving abilities.',
            'color': '#4CAF50'
        },
        {
            'id': 'verbal',
            'name': 'Verbal Ability',
            'icon': 'comment-alt',
            'description': 'Assess your language skills, vocabulary, and comprehension.',
            'color': '#2196F3'
        },
        {
            'id': 'quantitative',
            'name': 'Quantitative Aptitude',
            'icon': 'calculator',
            'description': 'Evaluate your mathematical and numerical reasoning skills.',
            'color': '#FF9800'
        },
        {
            'id': 'technical',
            'name': 'Technical Knowledge',
            'icon': 'code',
            'description': 'Test your understanding of technical concepts and programming.',
            'color': '#9C27B0'
        }
    ]
    return jsonify({'categories': categories}), 200

@app.route('/api/aptitude/categories/<category_id>', methods=['GET'])
def get_category_tests(category_id):
    categories = {
        'logical': {
            'id': 'logical',
            'name': 'Logical Reasoning',
            'tests': [
                {
                    'id': 'logical_deduction',
                    'name': 'Deductive Reasoning',
                    'description': 'Apply logical rules to solve complex problems.',
                    'questions': 10,
                    'time': 5,
                    'difficulty': 'Hard'
                },
                {
                    'id': 'logical_puzzles',
                    'name': 'Logical Puzzles',
                    'description': 'Solve puzzles that test your logical thinking.',
                    'questions': 10,
                    'time': 5,
                    'difficulty': 'Medium'
                }
            ]
        },
        'verbal': {
            'id': 'verbal',
            'name': 'Verbal Ability',
            'tests': [
                {
                    'id': 'verbal_vocabulary',
                    'name': 'Vocabulary',
                    'description': 'Test your knowledge of synonyms, antonyms, and word meanings.',
                    'questions': 10,
                    'time': 5,
                    'difficulty': 'Medium'
                },
                {
                    'id': 'verbal_comprehension',
                    'name': 'Reading Comprehension',
                    'description': 'Assess your ability to understand and analyze written text.',
                    'questions': 10,
                    'time': 5,
                    'difficulty': 'Medium'
                },
                {
                    'id': 'verbal_grammar',
                    'name': 'Grammar',
                    'description': 'Test your understanding of English grammar rules.',
                    'questions': 10,
                    'time': 5,
                    'difficulty': 'Easy'
                }
            ]
        },
        'quantitative': {
            'id': 'quantitative',
            'name': 'Quantitative Aptitude',
            'tests': [
                {
                    'id': 'quant_arithmetic',
                    'name': 'Arithmetic',
                    'description': 'Test your skills in basic arithmetic operations and calculations.',
                    'questions': 20,
                    'time': 20,
                    'difficulty': 'Medium'
                }
            ]
        },
        'technical': {
            'id': 'technical',
            'name': 'Technical Knowledge',
            'tests': [
                {
                    'id': 'tech_programming',
                    'name': 'Programming Concepts',
                    'description': 'Test your knowledge of programming fundamentals.',
                    'questions': 10,
                    'time': 10,
                    'difficulty': 'Medium'
                },
                {
                    'id': 'tech_algorithms',
                    'name': 'Algorithms & Data Structures',
                    'description': 'Assess your understanding of algorithms and data structures.',
                    'questions': 10,
                    'time': 10,
                    'difficulty': 'Hard'
                },
                {
                    'id': 'tech_web',
                    'name': 'Web Technologies',
                    'description': 'Test your knowledge of web development technologies.',
                    'questions': 10,
                    'time': 10,
                    'difficulty': 'Medium'
                }
            ]
        }
    }

    if category_id not in categories:
        return jsonify({'message': 'Category not found'}), 404

    return jsonify({'category': categories[category_id]}), 200

if __name__ == '__main__':
    logger.info("🚀 Starting Flask API with MongoDB support...")
    logger.info("📊 Testing MongoDB connection...")
    
    # Test MongoDB connection on startup
    try:
        stats = mongodb_ops.get_collection_stats()
        logger.info(f"✅ MongoDB connected successfully! Collections: {stats}")
    except Exception as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        logger.error("Please ensure MongoDB is running or check your configuration")
    
    app.run(debug=True, port=5000)

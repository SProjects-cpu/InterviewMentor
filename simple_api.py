#!/usr/bin/env python3
"""
Simplified API server to test CORS and registration
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import jwt
import datetime
import os

# Load environment variables
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dev-only-change-me")

app = Flask(__name__)
app.config['SECRET_KEY'] = JWT_SECRET_KEY

# Enable CORS with comprehensive configuration
CORS(app, 
     origins=["*"],
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     supports_credentials=False)

# Additional CORS headers
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

def get_db_connection():
    try:
        conn = sqlite3.connect('interview_mentor.db')
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        print(f"Error connecting to database: {e}")
        return None

def init_db():
    conn = None
    try:
        conn = get_db_connection()
        if conn is None:
            return
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                email TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        print("Database initialized successfully")
    except sqlite3.Error as e:
        print(f"Error initializing database: {e}")
    finally:
        if conn:
            conn.close()

def hash_password(password):
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, hashed):
    """Verify password against hash"""
    return hash_password(password) == hashed

def generate_token(user_id):
    """Generate JWT token for user - DISABLED"""
    return None

# Test endpoint
@app.route('/api/test', methods=['GET', 'OPTIONS'])
def test():
    return jsonify({'message': 'API is working!', 'cors': 'enabled'}), 200

# Registration endpoint - DISABLED
@app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
def register():
    return jsonify({'message': 'Authentication has been disabled'}), 403

# Login endpoint - DISABLED
@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def login():
    return jsonify({'message': 'Authentication has been disabled'}), 403

# Categories endpoint
@app.route('/api/aptitude/categories', methods=['GET', 'OPTIONS'])
def get_aptitude_categories():
    if request.method == 'OPTIONS':
        return '', 200
        
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

if __name__ == '__main__':
    print("🚀 Starting simplified API server...")
    print("📊 Initializing database...")
    init_db()
    print("🌐 Starting Flask server with CORS enabled...")
    print("📍 Server will be available at: http://localhost:5000")
    print("🔧 CORS enabled for all origins")
    
    app.run(debug=True, port=5001, host='0.0.0.0')

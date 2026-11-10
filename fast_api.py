#!/usr/bin/env python3
"""
Super Fast Minimal API for Interview Mentor
"""

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Pre-computed categories for instant responses
CATEGORIES = {
    'categories': [
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
}

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'message': 'Fast Interview Mentor API',
        'version': '3.0.0'
    }), 200

@app.route('/api/aptitude/categories', methods=['GET'])
def get_categories():
    return jsonify(CATEGORIES), 200

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'message': 'API is working perfectly!'}), 200

if __name__ == '__main__':
    print("🚀 Starting SUPER FAST API...")
    print("📍 Available at: http://localhost:5001")
    
    app.run(
        debug=False,
        port=5001,
        host='0.0.0.0',
        threaded=True
    )
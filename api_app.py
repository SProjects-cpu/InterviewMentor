from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import jwt
import datetime
from functools import wraps
import hashlib

# Import Google Generative AI with error handling
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    print("Warning: google.generativeai module not available. AI features will be disabled.")
    GENAI_AVAILABLE = False

from dotenv import load_dotenv
import time
import random

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

# Import coding test module with error handling
try:
    import coding_test
    CODING_TEST_AVAILABLE = True
except ImportError:
    print("Warning: coding_test module not available. Coding test features will be disabled.")
    CODING_TEST_AVAILABLE = False

import json

# Load environment variables from .env file
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")

# Configure Gemini API
if GEMINI_API_KEY and GENAI_AVAILABLE:
    genai.configure(api_key=GEMINI_API_KEY)
    GEMINI_MODEL = "gemini-pro"  # 不使用"models/"前缀
    print(f"Configured Gemini API with model: {GEMINI_MODEL}")

app = Flask(__name__)
app.config['SECRET_KEY'] = JWT_SECRET_KEY

# Enable CORS for all routes - allow all origins for development
CORS(app,
     origins=["*"],  # Allow all origins for development
     allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     supports_credentials=False)

# Additional CORS headers for preflight requests
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
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS quiz_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                test_id TEXT,
                score INTEGER,
                total_questions INTEGER,
                answers TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS career_guidance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                interests TEXT,
                academic_score INTEGER,
                future_aspirations TEXT,
                skills TEXT,
                recommendations TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS profile_details (
                user_id TEXT PRIMARY KEY,
                phone TEXT,
                location TEXT,
                institution TEXT,
                degree TEXT,
                graduation_year TEXT,
                skills TEXT,
                profile_picture TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                session_data TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error initializing database: {e}")
    finally:
        if conn:
            conn.close()

# Initialize the database at app startup
init_db()

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

# Authentication Routes - DISABLED
@app.route('/api/auth/register', methods=['POST'])
def register():
    return jsonify({'message': 'Authentication has been disabled'}), 403

@app.route('/api/auth/login', methods=['POST'])
def login():
    return jsonify({'message': 'Authentication has been disabled'}), 403

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Authentication has been disabled'}), 403

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE id = ?', (request.current_user_id,))
        user = cursor.fetchone()
        
        if not user:
            conn.close()
            return jsonify({'message': 'User not found'}), 404
        
        # Get profile details
        cursor.execute('SELECT * FROM profile_details WHERE user_id = ?', (request.current_user_id,))
        profile = cursor.fetchone()
        conn.close()
        
        user_data = {
            'id': user['id'],
            'username': user['username'],
            'email': user['email']
        }
        
        if profile:
            user_data.update({
                'phone': profile['phone'],
                'location': profile['location'],
                'institution': profile['institution'],
                'degree': profile['degree'],
                'graduation_year': profile['graduation_year'],
                'skills': profile['skills'],
                'profile_picture': profile['profile_picture']
            })
        
        return jsonify({'user': user_data}), 200
        
    except Exception as e:
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
                    'description': 'Test your knowledge of words and their meanings.',
                    'questions': 20,
                    'time': 5,
                    'difficulty': 'Medium'
                },
                {
                    'id': 'verbal_comprehension',
                    'name': 'Reading Comprehension',
                    'description': 'Understand and analyze written passages.',
                    'questions': 20,
                    'time': 5,
                    'difficulty': 'Medium'
                },
                {
                    'id': 'verbal_grammar',
                    'name': 'Grammar & Usage',
                    'description': 'Identify and correct grammatical errors.',
                    'questions': 20,
                    'time': 5,
                    'difficulty': 'Medium'
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
                    'description': 'Solve problems involving basic mathematical operations.',
                    'questions': 10,
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
                    'questions': 15,
                    'time': 5,
                    'difficulty': 'Medium'
                },
                {
                    'id': 'tech_algorithms',
                    'name': 'Algorithms & Data Structures',
                    'description': 'Evaluate your understanding of algorithms and data structures.',
                    'questions': 10,
                    'time': 5,
                    'difficulty': 'Hard'
                },
                {
                    'id': 'tech_web',
                    'name': 'Web Technologies',
                    'description': 'Test your knowledge of web development technologies.',
                    'questions': 15,
                    'time': 5,
                    'difficulty': 'Medium'
                }
            ]
        }
    }

    if category_id not in categories:
        return jsonify({'message': 'Category not found'}), 404

    return jsonify({'category': categories[category_id]}), 200

@app.route('/api/aptitude/test/<test_id>/start', methods=['POST'])
@token_required
def start_aptitude_test(test_id):
    try:
        # Get questions based on test_id
        questions = []
        time_limit = 20  # Default time limit

        if test_id == 'quant_arithmetic':
            questions = get_questions_by_topic('Percentages') + \
                       get_questions_by_topic('Profit and Loss') + \
                       get_questions_by_topic('Simple Interest') + \
                       get_questions_by_topic('Compound Interest') + \
                       get_questions_by_topic('Arithmetic')
            time_limit = 20
        elif test_id == 'logical_deduction':
            questions = get_deductive_reasoning_questions()
            time_limit = 5
        elif test_id == 'logical_puzzles':
            questions = get_logical_puzzles_questions()
            time_limit = 5
        elif test_id == 'verbal_vocabulary':
            questions = get_vocabulary_questions_by_topic('Synonyms') + get_vocabulary_questions_by_topic('Antonyms')
            time_limit = 5
        elif test_id == 'verbal_comprehension':
            questions = get_reading_comprehension_questions()
            time_limit = 5
        elif test_id == 'verbal_grammar':
            questions = get_grammar_questions()
            time_limit = 5
        elif test_id == 'tech_programming':
            questions = get_programming_concepts_questions()
            time_limit = 5
        elif test_id == 'tech_algorithms':
            questions = get_algorithms_data_structures_questions()
            time_limit = 5
        elif test_id == 'tech_web':
            questions = get_web_technologies_questions()
            time_limit = 5
        else:
            return jsonify({'message': 'Test not found'}), 404

        # Randomize and limit questions
        random.shuffle(questions)
        if test_id in ['verbal_vocabulary', 'verbal_comprehension', 'verbal_grammar', 'tech_programming', 'tech_web']:
            questions = questions[:15]
        elif test_id in ['tech_algorithms', 'logical_deduction', 'logical_puzzles']:
            questions = questions[:10]
        else:
            questions = questions[:10]

        # Store test session in database
        conn = get_db_connection()
        cursor = conn.cursor()

        # Create session data
        session_data = {
            'test_id': test_id,
            'questions': questions,
            'current_question': 0,
            'answers': {},
            'start_time': time.time(),
            'time_limit': time_limit,
            'end_time': time.time() + (time_limit * 60)
        }

        cursor.execute('''
            INSERT INTO user_sessions (user_id, session_data)
            VALUES (?, ?)
        ''', (request.current_user_id, json.dumps(session_data)))

        session_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return jsonify({
            'session_id': session_id,
            'test_id': test_id,
            'total_questions': len(questions),
            'time_limit': time_limit,
            'message': 'Test started successfully'
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to start test: {str(e)}'}), 500

@app.route('/api/aptitude/test/<int:session_id>/question/<int:question_index>', methods=['GET'])
@token_required
def get_test_question(session_id, question_index):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM user_sessions WHERE id = ? AND user_id = ?',
                      (session_id, request.current_user_id))
        session = cursor.fetchone()
        conn.close()

        if not session:
            return jsonify({'message': 'Session not found'}), 404

        session_data = json.loads(session['session_data'])
        questions = session_data['questions']

        if question_index >= len(questions):
            return jsonify({'message': 'Question not found'}), 404

        question = questions[question_index]

        # Calculate remaining time
        remaining_time = max(0, session_data['end_time'] - time.time())

        return jsonify({
            'question': question,
            'current_question': question_index + 1,
            'total_questions': len(questions),
            'remaining_time': remaining_time,
            'progress': ((question_index + 1) / len(questions)) * 100
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get question: {str(e)}'}), 500

@app.route('/api/aptitude/test/<int:session_id>/question/<int:question_index>', methods=['POST'])
@token_required
def submit_answer(session_id, question_index):
    try:
        data = request.get_json()
        answer = data.get('answer')

        if not answer:
            return jsonify({'message': 'Answer is required'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM user_sessions WHERE id = ? AND user_id = ?',
                      (session_id, request.current_user_id))
        session = cursor.fetchone()

        if not session:
            conn.close()
            return jsonify({'message': 'Session not found'}), 404

        session_data = json.loads(session['session_data'])

        # Store the answer
        session_data['answers'][str(question_index)] = answer
        session_data['current_question'] = question_index + 1

        # Update session in database
        cursor.execute('UPDATE user_sessions SET session_data = ? WHERE id = ?',
                      (json.dumps(session_data), session_id))
        conn.commit()
        conn.close()

        return jsonify({'message': 'Answer submitted successfully'}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to submit answer: {str(e)}'}), 500

@app.route('/api/aptitude/test/<int:session_id>/results', methods=['GET'])
@token_required
def get_test_results(session_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM user_sessions WHERE id = ? AND user_id = ?',
                      (session_id, request.current_user_id))
        session = cursor.fetchone()

        if not session:
            conn.close()
            return jsonify({'message': 'Session not found'}), 404

        session_data = json.loads(session['session_data'])
        questions = session_data['questions']
        answers = session_data['answers']

        # Calculate score
        correct_answers = 0
        total_questions = len(questions)
        detailed_results = []

        for i, question in enumerate(questions):
            user_answer = answers.get(str(i), '')
            correct_answer = question.get('correct_answer', question.get('answer', ''))
            is_correct = user_answer.lower().strip() == correct_answer.lower().strip()

            if is_correct:
                correct_answers += 1

            detailed_results.append({
                'question_number': i + 1,
                'question': question.get('question', ''),
                'options': question.get('options', []),
                'user_answer': user_answer,
                'correct_answer': correct_answer,
                'is_correct': is_correct,
                'explanation': question.get('explanation', '')
            })

        score_percentage = (correct_answers / total_questions) * 100 if total_questions > 0 else 0

        # Store results in quiz_results table
        cursor.execute('''
            INSERT INTO quiz_results (user_id, test_id, score, total_questions, answers)
            VALUES (?, ?, ?, ?, ?)
        ''', (request.current_user_id, session_data['test_id'], correct_answers,
              total_questions, json.dumps(answers)))

        conn.commit()
        conn.close()

        # Determine performance level
        if score_percentage >= 90:
            performance = 'Excellent'
            performance_color = 'green'
        elif score_percentage >= 75:
            performance = 'Good'
            performance_color = 'blue'
        elif score_percentage >= 60:
            performance = 'Average'
            performance_color = 'yellow'
        else:
            performance = 'Needs Improvement'
            performance_color = 'red'

        return jsonify({
            'session_id': session_id,
            'test_id': session_data['test_id'],
            'score': correct_answers,
            'total_questions': total_questions,
            'score_percentage': round(score_percentage, 1),
            'performance': performance,
            'performance_color': performance_color,
            'time_taken': session_data.get('time_limit', 0),
            'detailed_results': detailed_results
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get results: {str(e)}'}), 500

# Coding Test Routes
@app.route('/api/coding/challenges', methods=['GET'])
@token_required
def get_coding_challenges():
    try:
        if not CODING_TEST_AVAILABLE:
            return jsonify({'message': 'Coding test feature is not available'}), 503

        challenges = coding_test.get_all_challenges()
        return jsonify({'challenges': challenges}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get challenges: {str(e)}'}), 500

@app.route('/api/coding/challenges/<int:challenge_id>', methods=['GET'])
@token_required
def get_coding_challenge(challenge_id):
    try:
        if not CODING_TEST_AVAILABLE:
            return jsonify({'message': 'Coding test feature is not available'}), 503

        challenge = coding_test.get_challenge_by_id(challenge_id)
        if not challenge:
            return jsonify({'message': 'Challenge not found'}), 404

        return jsonify({'challenge': challenge}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get challenge: {str(e)}'}), 500

@app.route('/api/coding/execute', methods=['POST'])
@token_required
def execute_code():
    try:
        if not CODING_TEST_AVAILABLE:
            return jsonify({'message': 'Coding test feature is not available'}), 503

        data = request.get_json()
        code = data.get('code')
        language = data.get('language', 'python')
        challenge_id = data.get('challenge_id')

        if not code:
            return jsonify({
                'status': 'error',
                'message': 'Code is required'
            }), 400

        # Execute the code
        execution_result = coding_test.execute_code(code, language)

        # Generate AI review if challenge_id is provided
        ai_review = {'status': 'not_requested'}
        if challenge_id:
            challenge = coding_test.get_challenge_by_id(challenge_id)
            if challenge:
                try:
                    ai_review = coding_test.generate_ai_review(
                        code,
                        language,
                        execution_result.get('output', ''),
                        challenge.get('description', '')
                    )

                    # Save the user's solution
                    coding_test.save_user_solution(
                        request.current_user_id,
                        challenge_id,
                        language,
                        code,
                        execution_result,
                        ai_review
                    )
                except Exception as e:
                    print(f"Error generating AI review: {str(e)}")
                    ai_review = {
                        'status': 'error',
                        'message': f'Error generating AI review: {str(e)}'
                    }

        return jsonify({
            'status': 'success',
            'execution_result': execution_result,
            'ai_review': ai_review
        }), 200

    except Exception as e:
        print(f"Error executing code: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Error executing code: {str(e)}',
            'execution_result': {
                'status': 'error',
                'output': f'Server error: {str(e)}'
            },
            'ai_review': {
                'status': 'error',
                'message': 'Could not generate AI review due to execution error'
            }
        }), 500

@app.route('/api/coding/solutions', methods=['GET'])
@token_required
def get_user_solutions():
    try:
        if not CODING_TEST_AVAILABLE:
            return jsonify({'message': 'Coding test feature is not available'}), 503

        solutions = coding_test.get_user_solutions(request.current_user_id)
        return jsonify({'solutions': solutions}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get solutions: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

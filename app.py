from flask import Flask, render_template, request, session, redirect, url_for, jsonify, flash
from flask_session import Session
# from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user  # Authentication disabled
import sqlite3
import os
from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, TextAreaField, SubmitField
from wtforms.validators import DataRequired, Optional

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
print(f"Loaded GEMINI_API_KEY: {'[VALID KEY]' if GEMINI_API_KEY else '[MISSING]'}")

# Configure Gemini API
if GEMINI_API_KEY and GENAI_AVAILABLE:
    genai.configure(api_key=GEMINI_API_KEY)
    # Use the same model as in coding_test.py
    GEMINI_MODEL = "models/gemini-1.5-flash"
    print(f"Configured Gemini API with model: {GEMINI_MODEL}")

# Conditionally import heavy libraries with error handling
try:
    from sentence_transformers import SentenceTransformer, util
    from transformers import pipeline
    import torch
    NLP_LIBRARIES_AVAILABLE = True
except (ImportError, OSError) as e:
    print(f"Warning: Could not import NLP libraries: {e}")
    NLP_LIBRARIES_AVAILABLE = False

# PDF generation imports - wrapped in try-except to handle missing dependencies
try:
    from io import BytesIO
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    PDF_GENERATION_AVAILABLE = True
except ImportError as e:
    print(f"Warning: PDF generation will not be available: {e}")
    PDF_GENERATION_AVAILABLE = False

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Replace with a secure key for production
app.config['SESSION_TYPE'] = 'filesystem'
# Force template reloading
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
Session(app)

# Flask-Login setup - DISABLED
# login_manager = LoginManager()
# login_manager.init_app(app)
# login_manager.login_view = 'landing'

# User model (simplified for demo) - DISABLED
class UserMixin:
    """Dummy UserMixin for compatibility"""
    pass

class User(UserMixin):
    def __init__(self, user_id):
        self.id = user_id

# @login_manager.user_loader
def load_user(user_id):
    return User(user_id)  # In a real app, query from database

# Load Sentence-Transformer model for AI suggestions if available
model = None
if NLP_LIBRARIES_AVAILABLE:
    try:
        model = SentenceTransformer('all-MiniLM-L6-v2')
    except Exception as e:
        print(f"Warning: Could not load SentenceTransformer model: {e}")

# Sample resume data (default structure with all sections)
resume_data = {
    'personal_info': {'full_name': '', 'email': '', 'phone': '', 'location': ''},
    'professional_summary': '',
    'experience': [],
    'education': [],
    'skills': [],
    'projects': [],
    'interests': [],
    'volunteering': [],
    'certifications': [],
    'awards': []
}

# Sample AI suggestions
skill_suggestions = ["Python", "JavaScript", "Data Analysis", "Project Management", "Communication"]
experience_suggestions = ["Developed web applications", "Led a team of 5", "Improved process efficiency by 20%"]
education_suggestions = ["Completed a degree in Computer Science", "Certified in Data Science"]
project_suggestions = ["Built an IoT system", "Developed a chatbot", "Created a data dashboard"]
interest_suggestions = ["Cybersecurity", "Blockchain", "AI/ML"]
volunteering_suggestions = ["Organized tech events", "Mentored students", "Volunteered at hackathons"]
certification_suggestions = ["AWS Certified", "Python Certification", "Data Science Certificate"]
award_suggestions = ["Hackathon Winner", "Best Project Award", "Leadership Recognition"]

# 5 aptitude questions
questions = [
    {"id": 1, "question": "If the day after tomorrow is Wednesday, what day is it today?", 
     "options": ["Monday", "Tuesday", "Wednesday", "Thursday"], "answer": "Monday"},
    {"id": 2, "question": "What is 15% of 200?", 
     "options": ["20", "25", "30", "35"], "answer": "30"},
    {"id": 3, "question": "If all cats are mammals, and some mammals are black, can all cats be black?", 
     "options": ["Yes", "No", "Maybe", "Always"], "answer": "No"},
    {"id": 4, "question": "If 3x = 12, what is x?", 
     "options": ["2", "3", "4", "5"], "answer": "4"},
    {"id": 5, "question": "Which number comes next: 2, 4, 6, 8, ...?", 
     "options": ["9", "10", "11", "12"], "answer": "10"}
]

# Career Guidance Form
class CareerGuidanceForm(FlaskForm):
    interests = TextAreaField('Interests (e.g., tech, arts, business)', validators=[Optional()])
    academic_score = IntegerField('Academic Score (0-100)', validators=[DataRequired(), Optional()])
    future_aspirations = TextAreaField('Where do you see yourself in the future? (e.g., CEO, software engineer)', validators=[DataRequired()])
    skills = TextAreaField('Skills (comma-separated, e.g., Python, leadership)', validators=[Optional()])
    submit = SubmitField('Get Career Guidance')

def get_db_connection():
    try:
        conn = sqlite3.connect('resume.db')
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
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                email TEXT
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS quiz_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                score INTEGER,
                total_questions INTEGER,
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
                recommendations TEXT
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS errors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                error_message TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                feedback TEXT,
                section TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
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
            CREATE TABLE IF NOT EXISTS user_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                settings_data TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Drop and recreate the profile_details table to fix any schema issues
        try:
            cursor.execute('DROP TABLE IF EXISTS profile_details_temp')
            cursor.execute('''
                CREATE TABLE profile_details_temp (
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
            cursor.execute('INSERT OR IGNORE INTO profile_details_temp SELECT * FROM profile_details')
            cursor.execute('DROP TABLE IF EXISTS profile_details')
            cursor.execute('''
                CREATE TABLE profile_details (
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
            cursor.execute('INSERT OR IGNORE INTO profile_details SELECT * FROM profile_details_temp')
            cursor.execute('DROP TABLE IF EXISTS profile_details_temp')
        except:
            pass
            
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error initializing database: {e}")
    finally:
        if conn:
            conn.close()

# Initialize the database at app startup
init_db()

@app.route('/login', methods=['GET', 'POST'])
def login():
    # Authentication disabled - redirect to home
    return redirect(url_for('home'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    # Authentication disabled - redirect to home
    return redirect(url_for('home'))

@app.route('/logout')
def logout():
    # Authentication disabled - redirect to home
    return redirect(url_for('home'))

@app.route('/landing')
def landing():
    # Authentication disabled - always show landing page
    return render_template('landing.html')

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/settings')
def settings():
    return render_template('settings.html')

@app.route('/api/settings', methods=['POST'])
def save_settings():
    # Authentication disabled - allow anonymous settings
    try:
        # Simple settings save implementation for anonymous user
        conn = get_db_connection()
        conn.execute('UPDATE users SET settings = ? WHERE id = ?',
                    (json.dumps(request.json), 'anonymous'))
        conn.commit()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/profile', methods=['GET', 'POST'])
# @login_required  # Authentication disabled
def profile():
    # Get user information from the database
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    
    # Check if users table has email column, add it if not
    try:
        conn.execute('SELECT email FROM users LIMIT 1')
    except sqlite3.OperationalError:
        conn.execute('ALTER TABLE users ADD COLUMN email TEXT')
        conn.commit()
    
    user = conn.execute('SELECT * FROM users WHERE id = ?', (session['user_id'],)).fetchone()
    
    success_message = None
    error_message = None
    
    # Check if profile_details table exists, if not create it
    conn.execute('''
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
    conn.commit()
    
    if request.method == 'POST':
        try:
            # Handle profile update logic here
            fullname = request.form.get('fullName', '')
            email = request.form.get('email', '')
            phone = request.form.get('phone', '')
            location = request.form.get('location', '')
            institution = request.form.get('institution', '')
            degree = request.form.get('degree', '')
            graduation_year = request.form.get('graduationYear', '')
            skills = request.form.get('skills', '')
            
            # Convert user_id to string to ensure type consistency
            user_id_str = str(session['user_id'])
            
            # Handle profile picture upload
            profile_picture_path = None
            if 'profile_picture' in request.files:
                profile_pic = request.files['profile_picture']
                if profile_pic and profile_pic.filename:
                    # Ensure the static/images directory exists
                    os.makedirs('static/images', exist_ok=True)
                    
                    # Generate a unique filename
                    filename = f"profile_{user_id_str}_{int(time.time())}.png"
                    filepath = os.path.join('static/images', filename)
                    
                    # Save the file
                    profile_pic.save(filepath)
                    profile_picture_path = f"images/{filename}"
            
            # Get current profile picture if no new one uploaded
            if not profile_picture_path:
                current_profile = conn.execute('SELECT profile_picture FROM profile_details WHERE user_id = ?', 
                                             (user_id_str,)).fetchone()
                if current_profile and current_profile['profile_picture']:
                    profile_picture_path = current_profile['profile_picture']
            
            # Ensure all values are strings to prevent type mismatches
            fullname = str(fullname) if fullname else ''
            email = str(email) if email else ''
            phone = str(phone) if phone else ''
            location = str(location) if location else ''
            institution = str(institution) if institution else ''
            degree = str(degree) if degree else ''
            graduation_year = str(graduation_year) if graduation_year else ''
            skills = str(skills) if skills else ''
            profile_picture_path = str(profile_picture_path) if profile_picture_path else ''
            
            # Update user information in the database
            conn.execute('''
                UPDATE users 
                SET username = ?, email = ? 
                WHERE id = ?
            ''', (fullname, email, user_id_str))
            conn.commit()
            
            # Check if user already has profile details
            profile_exists = conn.execute('SELECT 1 FROM profile_details WHERE user_id = ?', 
                                         (user_id_str,)).fetchone()
            
            if profile_exists:
                # Update existing profile details
                conn.execute('''
                    UPDATE profile_details 
                    SET phone = ?, location = ?, institution = ?, degree = ?, 
                        graduation_year = ?, skills = ?, profile_picture = ? 
                    WHERE user_id = ?
                ''', (phone, location, institution, degree, graduation_year, skills, 
                      profile_picture_path, user_id_str))
            else:
                # Insert new profile details
                conn.execute('''
                    INSERT INTO profile_details (user_id, phone, location, institution, degree, 
                                               graduation_year, skills, profile_picture)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', (user_id_str, phone, location, institution, degree, 
                     graduation_year, skills, profile_picture_path))
            
            conn.commit()
            
            # Set success message
            success_message = "Profile updated successfully!"
            
            # Get updated user information
            user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id_str,)).fetchone()
        except Exception as e:
            # Log the error
            print(f"Error updating profile: {e}")
            try:
                conn.execute('''
                    INSERT INTO errors (user_id, error_message)
                    VALUES (?, ?)
                ''', (user_id_str, str(e)))
                conn.commit()
            except:
                pass
            error_message = f"Error updating profile: {e}"
    
    # Get profile details if they exist
    profile_details = conn.execute('''
        SELECT * FROM profile_details WHERE user_id = ?
    ''', (str(session['user_id']),)).fetchone()
    
    # Combine user and profile details for the template
    user_data = dict(user) if user else {'id': session['user_id'], 'username': session['user_id']}
    if profile_details:
        profile_details_dict = dict(profile_details)
        user_data.update(profile_details_dict)
    
    # Process skills for display
    if 'skills' in user_data and user_data['skills']:
        user_data['skills_list'] = [skill.strip() for skill in user_data['skills'].split(',') if skill.strip()]
    else:
        user_data['skills_list'] = []
    
    conn.close()
    
    return render_template('profile.html', user=user_data, success_message=success_message, error_message=error_message)

@app.route('/quiz', methods=['GET', 'POST'])
def question():
    # Redirect to the aptitude test categories page
    return redirect(url_for('aptitude_categories'))

@app.route('/aptitude')
def aptitude_categories():
    # Define the aptitude test categories
    categories = [
        {
            'id': 'logical',
            'name': 'Logical Reasoning',
            'icon': 'fas fa-brain',
            'description': 'Test your logical thinking and problem-solving abilities.',
            'color': '#4CAF50'
        },
        {
            'id': 'verbal',
            'name': 'Verbal Ability',
            'icon': 'fas fa-comment-alt',
            'description': 'Assess your language skills, vocabulary, and comprehension.',
            'color': '#2196F3'
        },
        {
            'id': 'quantitative',
            'name': 'Quantitative Aptitude',
            'icon': 'fas fa-calculator',
            'description': 'Evaluate your mathematical and numerical reasoning skills.',
            'color': '#FF9800'
        },
        {
            'id': 'technical',
            'name': 'Technical Knowledge',
            'icon': 'fas fa-code',
            'description': 'Test your understanding of technical concepts and programming.',
            'color': '#9C27B0'
        },
        {
            'id': 'personality',
            'name': 'Personality Assessment',
            'icon': 'fas fa-user-circle',
            'description': 'Discover your personality traits and work preferences.',
            'color': '#E91E63'
        },
        {
            'id': 'situational',
            'name': 'Situational Judgment',
            'icon': 'fas fa-users',
            'description': 'Evaluate your decision-making in workplace scenarios.',
            'color': '#607D8B'
        }
    ]
    
    return render_template('aptitude_categories.html', categories=categories)

@app.route('/aptitude/<category_id>')
def aptitude_category(category_id):
    # Define the aptitude test categories
    categories = {
        'logical': {
            'id': 'logical',
            'name': 'Logical Reasoning',
            'icon': 'fas fa-brain',
            'description': 'Test your logical thinking and problem-solving abilities.',
            'color': '#4CAF50',
            'tests': [
                {
                    'id': 'logical_patterns',
                    'name': 'Pattern Recognition',
                    'description': 'Identify patterns and sequences in various problems.',
                    'questions': 15,
                    'time': 2,
                    'difficulty': 'Medium'
                },
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
            'icon': 'fas fa-comment-alt',
            'description': 'Assess your language skills, vocabulary, and comprehension.',
            'color': '#2196F3',
            'tests': [
                {
                    'id': 'verbal_vocabulary',
                    'name': 'Vocabulary',
                    'description': 'Test your knowledge of words and their meanings.',
                    'questions': 20,
                    'time': 5,  # Updated to 5 minutes as requested
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
            'icon': 'fas fa-calculator',
            'description': 'Evaluate your mathematical and numerical reasoning skills.',
            'color': '#FF9800',
            'tests': [
                {
                    'id': 'quant_arithmetic',
                    'name': 'Arithmetic',
                    'description': 'Solve problems involving basic mathematical operations.',
                    'questions': 10,
                    'time': 20,
                    'difficulty': 'Medium'
                },
                {
                    'id': 'quant_algebra',
                    'name': 'Algebra',
                    'description': 'Apply algebraic concepts to solve equations and problems.',
                    'questions': 10,
                    'time': 15,
                    'difficulty': 'Hard'
                },
                {
                    'id': 'quant_data',
                    'name': 'Data Interpretation',
                    'description': 'Analyze and interpret data from graphs and tables.',
                    'questions': 10,
                    'time': 20,
                    'difficulty': 'Medium'
                }
            ]
        },
        'technical': {
            'id': 'technical',
            'name': 'Technical Knowledge',
            'icon': 'fas fa-code',
            'description': 'Test your understanding of technical concepts and programming.',
            'color': '#9C27B0',
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
        },
        'personality': {
            'id': 'personality',
            'name': 'Personality Assessment',
            'icon': 'fas fa-user-circle',
            'description': 'Discover your personality traits and work preferences.',
            'color': '#E91E63',
            'tests': [
                {
                    'id': 'personality_coming_soon',
                    'name': 'Coming Soon',
                    'description': 'Our personality assessment tests are currently under development. Check back soon for a comprehensive suite of personality evaluation tools.',
                    'questions': 0,
                    'time': 0,
                    'difficulty': 'Easy'
                }
            ]
        },
        'situational': {
            'id': 'situational',
            'name': 'Situational Judgment',
            'icon': 'fas fa-users',
            'description': 'Evaluate your decision-making in workplace scenarios.',
            'color': '#607D8B',
            'tests': [
                {
                    'id': 'situational_coming_soon',
                    'name': 'Coming Soon',
                    'description': 'Our situational judgment tests are currently under development. Check back soon for realistic workplace scenarios to test your decision-making skills.',
                    'questions': 0,
                    'time': 0,
                    'difficulty': 'Medium'
                }
            ]
        }
    }
    
    if category_id not in categories:
        return redirect(url_for('aptitude_categories'))
    
    category = categories[category_id]
    return render_template('aptitude_category.html', category=category)

@app.route('/aptitude/test/<test_id>', methods=['GET', 'POST'])
def aptitude_test(test_id):
    # Handle "Coming Soon" test IDs
    if test_id == 'personality_coming_soon':
        flash('Personality Assessment tests are coming soon! Please check back later.', 'info')
        return redirect(url_for('aptitude_category', category_id='personality'))
    elif test_id == 'situational_coming_soon':
        flash('Situational Judgment tests are coming soon! Please check back later.', 'info')
        return redirect(url_for('aptitude_category', category_id='situational'))
    elif test_id == 'logical_patterns':
        flash('Pattern Recognition tests are coming soon! Please check back later.', 'info')
        return redirect(url_for('aptitude_category', category_id='logical'))
        
    # Initialize session variables if not present
    if 'test_questions' not in session:
        # Get questions based on test_id
        if test_id == 'quant_arithmetic':
            # Get arithmetic questions
            questions = get_questions_by_topic('Percentages') + \
                       get_questions_by_topic('Profit and Loss') + \
                       get_questions_by_topic('Simple Interest') + \
                       get_questions_by_topic('Compound Interest') + \
                       get_questions_by_topic('Interest Comparison') + \
                       get_questions_by_topic('Arithmetic')  # Add the Arithmetic topic
            time_limit = 20  # 20 minutes for arithmetic test
        elif test_id == 'quant_algebra':
            # Use the Algebra questions we added
            questions = get_questions_by_topic('Algebra')
            time_limit = 20  # 20 minutes for algebra test
        elif test_id == 'quant_data':
            # Use the Data Interpretation questions we added
            questions = get_questions_by_topic('Data Interpretation')
            time_limit = 20  # 20 minutes for data interpretation test
        elif test_id == 'logical_deduction':
            # Use deductive reasoning questions
            questions = get_deductive_reasoning_questions()
            time_limit = 5  # 5 minutes time limit for deductive reasoning test
        elif test_id == 'logical_puzzles':
            # Use logical puzzles questions
            questions = get_logical_puzzles_questions()
            time_limit = 5  # 5 minutes time limit for logical puzzles test
        elif test_id == 'verbal_vocabulary':
            # Use vocabulary questions
            questions = get_vocabulary_questions_by_topic('Synonyms') + get_vocabulary_questions_by_topic('Antonyms')
            time_limit = 5  # 5 minutes for vocabulary test as requested
        elif test_id == 'verbal_comprehension':
            # Use reading comprehension questions
            questions = get_reading_comprehension_questions()
            time_limit = 5  # 5 minutes for reading comprehension test as requested
        elif test_id == 'verbal_grammar':
            # Use grammar questions
            questions = get_grammar_questions()
            time_limit = 5  # 5 minutes for grammar test as requested
        elif test_id == 'tech_programming':
            # Use programming concepts questions
            questions = get_programming_concepts_questions()
            # Ensure we have exactly 15 questions for programming concepts
            if len(questions) > 15:
                # Randomize and limit to exactly 15 questions
                random.shuffle(questions)
                questions = questions[:15]
            time_limit = 5  # 5 minutes for programming concepts test as requested
        elif test_id == 'tech_algorithms':
            # Use algorithms and data structures questions
            questions = get_algorithms_data_structures_questions()
            # Ensure we have exactly 10 questions for algorithms
            if len(questions) > 10:
                # Randomize and limit to exactly 10 questions
                random.shuffle(questions)
                questions = questions[:10]
            time_limit = 5  # 5 minutes for algorithms test as requested
        elif test_id == 'tech_web':
            # Use web technologies questions
            questions = get_web_technologies_questions()
            # Ensure we have exactly 15 questions for web technologies
            if len(questions) > 15:
                # Randomize and limit to exactly 15 questions
                random.shuffle(questions)
                questions = questions[:15]
            time_limit = 5  # 5 minutes for web technologies test
        else:
            # Default to all arithmetic questions
            questions = ARITHMETIC_QUESTIONS
            time_limit = 20  # 20 minutes time limit
            
        # Randomize the questions
        random.shuffle(questions)
        
        # Limit to 15 questions for verbal tests and programming concepts, 10 for algorithms, 10 for others
        if test_id == 'verbal_vocabulary' or test_id == 'verbal_comprehension' or test_id == 'verbal_grammar' or test_id == 'tech_programming':
            questions = questions[:15]  # 15 questions for verbal tests and programming concepts
        elif test_id == 'tech_algorithms':
            questions = questions[:10]  # 10 questions for algorithms test
        elif test_id == 'tech_web':
            questions = questions[:15]  # 15 questions for web technologies test
        else:
            questions = questions[:10]  # 10 questions for other tests
        
        # Store in session
        session['test_questions'] = questions
        session['current_question_index'] = 0
        session['test_answers'] = {}
        session['test_id'] = test_id
        session['test_start_time'] = time.time()
        session['test_time_limit'] = time_limit
        # Force the timer to be exactly 5 minutes for programming concepts, algorithms, and web technologies
        if test_id == 'tech_programming' or test_id == 'tech_algorithms' or test_id == 'tech_web':
            session['test_time_limit'] = 5
            session['test_end_time'] = time.time() + (5 * 60)  # 5 minutes
        else:
            session['test_end_time'] = time.time() + (time_limit * 60)  # Calculate end time
    
    # Get current question
    current_index = session.get('current_question_index', 0)
    questions = session.get('test_questions', [])
    time_limit = session.get('test_time_limit', 20)  # Default to 20 minutes if not set
    
    # Calculate remaining time
    end_time = session.get('test_end_time', time.time() + (time_limit * 60))
    remaining_seconds = max(0, int(end_time - time.time()))
    
    if current_index >= len(questions):
        # All questions answered, redirect to results
        return redirect(url_for('aptitude_test_result'))
    
    current_question = questions[current_index]

    if request.method == 'POST':
        # Process the answer
        user_answer = request.form.get('answer')
        if user_answer:
            session['test_answers'][str(current_index)] = {
                'question_id': current_question['id'],
                'user_answer': user_answer,
                'correct_answer': current_question['answer'],
                'is_correct': user_answer == current_question['answer']
            }
            
            # Move to next question
            session['current_question_index'] = current_index + 1
            
            # Check if this was the last question
            if current_index + 1 >= len(questions):
                return redirect(url_for('aptitude_test_result'))
            else:
                return redirect(url_for('aptitude_test', test_id=test_id))
        else:
            # If no answer selected, just re-render the page with an error message
            error_message = "Please select an answer before proceeding."
            return render_template('aptitude_test.html', 
                                  question=current_question,
                                  current_number=current_index + 1,
                                  total_questions=len(questions),
                                  progress=progress,
                                  test_id=test_id,
                                  time_limit=time_limit,
                                  remaining_seconds=remaining_seconds,
                                  error_message=error_message)
    
    # Calculate progress
    progress = (current_index / len(questions)) * 100
    
    return render_template('aptitude_test.html', 
                          question=current_question,
                          current_number=current_index + 1,
                          total_questions=len(questions),
                          progress=progress,
                          test_id=test_id,
                          time_limit=time_limit,
                          remaining_seconds=remaining_seconds)

@app.route('/aptitude/test/result')
def aptitude_test_result():
    # Get test data from session
    questions = session.get('test_questions', [])
    answers = session.get('test_answers', {})
    test_id = session.get('test_id', '')
    start_time = session.get('test_start_time', time.time())
    
    # Calculate results
    total_questions = len(questions)
    correct_count = sum(1 for answer in answers.values() if answer['is_correct'])
    score_percentage = (correct_count / total_questions) * 100 if total_questions > 0 else 0
    
    # Calculate time taken
    end_time = time.time()
    time_taken_seconds = end_time - start_time
    minutes = int(time_taken_seconds // 60)
    seconds = int(time_taken_seconds % 60)
    
    # Determine performance level
    if score_percentage >= 80:
        performance = "Excellent"
        performance_message = "Outstanding! You have a strong grasp of the concepts."
    elif score_percentage >= 60:
        performance = "Good"
        performance_message = "Well done! You have a good understanding of the material."
    elif score_percentage >= 40:
        performance = "Average"
        performance_message = "You have a basic understanding, but there's room for improvement."
    else:
        performance = "Needs Improvement"
        performance_message = "You should focus on strengthening your understanding of the concepts."
    
    # Save results to database for anonymous user
    try:
        conn = get_db_connection()
        conn.execute('''
            INSERT INTO quiz_results (user_id, score, total_questions, timestamp)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ''', ('anonymous', correct_count, total_questions))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error saving quiz results: {e}")
    
    # Clear test session data
    session.pop('test_questions', None)
    session.pop('current_question_index', None)
    session.pop('test_answers', None)
    session.pop('test_id', None)
    session.pop('test_start_time', None)
    
    return render_template('aptitude_test_result.html',
                          questions=questions,
                          answers=answers, 
                          correct_count=correct_count, 
                          total_questions=total_questions,
                          score_percentage=score_percentage,
                          performance=performance,
                          performance_message=performance_message,
                          minutes=minutes,
                          seconds=seconds,
                          test_id=test_id)

@app.route('/clear-test')
def clear_test():
    # Clear test session data
    session.pop('test_questions', None)
    session.pop('current_question_index', None)
    session.pop('test_answers', None)
    session.pop('test_id', None)
    session.pop('test_start_time', None)
    return redirect(url_for('aptitude_categories'))

@app.route('/career-guidance', methods=['GET', 'POST'])
def career_guidance():
    # Get user skills from profile for anonymous user
    user_skills = []
    conn = get_db_connection()
    if conn:
        try:
            conn.row_factory = sqlite3.Row
            profile_details = conn.execute('''
                SELECT skills FROM profile_details WHERE user_id = ?
            ''', ('anonymous',)).fetchone()

            if profile_details and profile_details['skills']:
                user_skills = [skill.strip() for skill in profile_details['skills'].split(',') if skill.strip()]
        except sqlite3.Error as e:
            print(f"Database error: {e}")
        finally:
            conn.close()
    
    # Render the new career guidance dashboard
    return render_template('career_guidance.html', user_skills=user_skills)

@app.route('/resume-builder', methods=['GET', 'POST'])
def resume_builder():
    # Serve the vanilla JavaScript resume builder
    return render_template('resume_builder.html')

@app.route('/coding-test')
# @login_required  # Authentication disabled
def coding_test_home():
    return render_template('coding_test.html')

@app.route('/coding-test/challenges')
# @login_required  # Authentication disabled
def coding_challenges():
    challenges = coding_test.get_all_challenges()
    return render_template('coding_challenges.html', challenges=challenges)

@app.route('/coding-test/practice')
# @login_required  # Authentication disabled
def coding_practice():
    return render_template('coding_practice.html')

@app.route('/coding-test/competitions')
# @login_required  # Authentication disabled
def coding_competitions():
    # This would be implemented in a real app
    return render_template('coding_test.html')  # Redirect to main page for now

@app.route('/coding-test/progress')
# @login_required  # Authentication disabled
def coding_progress():
    # Authentication disabled - use anonymous user
    user_solutions = coding_test.get_user_solutions('anonymous')
    return render_template('coding_progress.html', solutions=user_solutions)

@app.route('/coding-test/challenge/<int:challenge_id>')
# @login_required  # Authentication disabled
def coding_challenge(challenge_id):
    challenge = coding_test.get_challenge_by_id(challenge_id)
    
    if not challenge:
        return redirect('/coding-test/challenges')
    
    return render_template('coding_challenge.html', challenge=challenge)

@app.route('/api/execute-code', methods=['POST'])
# @login_required  # Authentication disabled
def execute_code():
    data = request.get_json()
    code = data.get('code')
    language = data.get('language', 'python')
    challenge_id = data.get('challenge_id')
    
    if not code:
        return jsonify({
            'status': 'error',
            'message': 'Code is required'
        }), 400
    
    try:
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
                    
                    # Log successful AI review generation
                    print(f"AI review generated successfully: {ai_review['status']}")
                    
                    # Save the user's solution for anonymous user
                    coding_test.save_user_solution(
                        'anonymous',
                        challenge_id,
                        language,
                        code,
                        execution_result,
                        ai_review
                    )
                except Exception as e:
                    print(f"Error generating AI review: {str(e)}")
                    import traceback
                    traceback.print_exc()
                    ai_review = {
                        'status': 'error',
                        'message': f'Error generating AI review: {str(e)}'
                    }
        
        return jsonify({
            'status': 'success',
            'execution_result': execution_result,
            'ai_review': ai_review
        })
    except Exception as e:
        print(f"Error executing code: {str(e)}")
        import traceback
        traceback.print_exc()
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

@app.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    # Check if ReportLab is available
    if not globals().get('PDF_GENERATION_AVAILABLE', False):
        return jsonify({
            'error': 'PDF generation is not available. ReportLab library is not installed.',
            'success': False
        }), 500
        
    data = request.json
    
    # Create a PDF
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []
    
    # Add personal info
    elements.append(Paragraph(data.get('name', ''), styles['Title']))
    elements.append(Paragraph(data.get('email', ''), styles['Normal']))
    elements.append(Paragraph(data.get('phone', ''), styles['Normal']))
    elements.append(Paragraph(data.get('address', ''), styles['Normal']))
    elements.append(Spacer(1, 12))
    
    # Add summary
    if data.get('summary'):
        elements.append(Paragraph('Summary', styles['Heading2']))
        elements.append(Paragraph(data.get('summary', ''), styles['Normal']))
        elements.append(Spacer(1, 12))
    
    # Add experience
    if data.get('experience'):
        elements.append(Paragraph('Experience', styles['Heading2']))
        for exp in data.get('experience', []):
            elements.append(Paragraph(f"{exp.get('title')} at {exp.get('company')}", styles['Heading3']))
            elements.append(Paragraph(f"{exp.get('startDate')} - {exp.get('endDate')}", styles['Normal']))
            elements.append(Paragraph(exp.get('description', ''), styles['Normal']))
            elements.append(Spacer(1, 12))
    
    # Add education
    if data.get('education'):
        elements.append(Paragraph('Education', styles['Heading2']))
        for edu in data.get('education', []):
            elements.append(Paragraph(f"{edu.get('degree')} from {edu.get('school')}", styles['Heading3']))
            elements.append(Paragraph(f"{edu.get('startDate')} - {edu.get('endDate')}", styles['Normal']))
            elements.append(Paragraph(edu.get('description', ''), styles['Normal']))
            elements.append(Spacer(1, 12))
    
    # Add skills
    if data.get('skills'):
        elements.append(Paragraph('Skills', styles['Heading2']))
        skill_text = ', '.join(data.get('skills', []))
        elements.append(Paragraph(skill_text, styles['Normal']))
    
    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    
    return buffer.getvalue(), 200, {'Content-Type': 'application/pdf'}

@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 0 minutes.
    """
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '-1'
    return response

if __name__ == '__main__':
    app.run(debug=True)

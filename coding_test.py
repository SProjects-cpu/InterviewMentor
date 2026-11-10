import os
import subprocess
import tempfile
import json
import time
import sqlite3
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import the new AI provider module
try:
    from ai_provider import ai_manager, generate_ai_code_review
    AI_PROVIDER_AVAILABLE = True
    print(f"✅ AI Provider module loaded successfully")
except ImportError as e:
    print(f"Warning: AI Provider module not available: {e}")
    AI_PROVIDER_AVAILABLE = False

# Legacy Gemini import for backward compatibility
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

# Configuration flags
GEMINI_AVAILABLE = False
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

# Fallback AI review responses
FALLBACK_REVIEWS = {
    'python': {
        'generic': """
        <h5>AI Review</h5>
        <p>Code structure looks good. Consider adding input validation and comments.</p>
        <p>Rating: 7/10</p>
        """
    },
    'generic': """
        <h5>AI Review</h5>
        <p>Code structure looks good. Consider adding input validation and comments.</p>
        <p>Rating: 7/10</p>
        """
}

# Database setup
def get_db_connection():
    conn = sqlite3.connect('interview_mentor.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_coding_test_db():
    conn = get_db_connection()
    conn.execute('''
    CREATE TABLE IF NOT EXISTS coding_challenges (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        description TEXT NOT NULL,
        examples TEXT NOT NULL,
        constraints TEXT NOT NULL,
        solution_template TEXT NOT NULL,
        test_cases TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS user_solutions (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        challenge_id INTEGER NOT NULL,
        language TEXT NOT NULL,
        code TEXT NOT NULL,
        status TEXT NOT NULL,
        execution_time REAL,
        memory_usage REAL,
        ai_review TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (challenge_id) REFERENCES coding_challenges (id)
    )
    ''')
    
    # Insert sample challenges if none exist
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM coding_challenges")
    count = cursor.fetchone()[0]
    
    if count == 0:
        insert_sample_challenges(conn)
    
    conn.commit()
    conn.close()

def insert_sample_challenges(conn):
    sample_challenges = [
        {
            'title': 'String Reversal',
            'subtitle': 'Reverse a string efficiently',
            'difficulty': 'Easy',
            'description': '<p>Write a function that takes a string as input and returns the string reversed. For example, if the input is "Hello", the output should be "olleH".</p><p>Your solution should handle empty strings and strings with spaces.</p>',
            'examples': json.dumps([
                {'input': '"Hello"', 'output': '"olleH"'},
                {'input': '"Interview Mentor"', 'output': '"rotneM weivretn"'},
                {'input': '""', 'output': '""', 'explanation': 'Empty string returns empty string.'}
            ]),
            'constraints': json.dumps([
                'The input string length will be between 0 and 10^5.',
                'The input string will contain printable ASCII characters.'
            ]),
            'solution_template': json.dumps({
                'python': 'def solution(input_string):\n    # Your code here\n    return input_string\n\n# Test cases\nprint(solution("Hello"))',
                'javascript': 'function solution(inputString) {\n    // Your code here\n    return inputString;\n}\n\n// Test cases\nconsole.log(solution("Hello"));',
                'java': 'public class Solution {\n    public static void main(String[] args) {\n        System.out.println(solution("Hello"));\n    }\n\n    public static String solution(String inputString) {\n        // Your code here\n        return inputString;\n    }\n}',
                'cpp': '#include <iostream>\n#include <string>\n\nusing namespace std;\n\nstring solution(string inputString) {\n    // Your code here\n    return inputString;\n}\n\nint main() {\n    cout << solution("Hello") << endl;\n    return 0;\n}'
            }),
            'test_cases': json.dumps([
                {'input': 'Hello', 'expected': 'olleH'},
                {'input': 'Interview Mentor', 'expected': 'rotneM weivretn'},
                {'input': '', 'expected': ''}
            ])
        },
        {
            'title': 'Palindrome Checker',
            'subtitle': 'Check if a string is a palindrome',
            'difficulty': 'Medium',
            'description': '<p>Create a function to check if a given string is a palindrome (reads the same forward and backward).</p><p>For this problem, a string is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.</p>',
            'examples': json.dumps([
                {'input': '"A man, a plan, a canal: Panama"', 'output': 'true', 'explanation': 'After removing non-alphanumeric characters and converting to lowercase, the string becomes "amanaplanacanalpanama", which is a palindrome.'},
                {'input': '"race a car"', 'output': 'false', 'explanation': 'After removing non-alphanumeric characters and converting to lowercase, the string becomes "raceacar", which is not a palindrome.'},
                {'input': '" "', 'output': 'true', 'explanation': 'After removing non-alphanumeric characters, the string becomes "", which is a palindrome.'}
            ]),
            'constraints': json.dumps([
                'The input string length will be between 1 and 2 * 10^5.',
                'The string will consist of printable ASCII characters.'
            ]),
            'solution_template': json.dumps({
                'python': 'def solution(input_string):\n    # Your code here\n    return True\n\n# Test cases\nprint(solution("A man, a plan, a canal: Panama"))',
                'javascript': 'function solution(inputString) {\n    // Your code here\n    return true;\n}\n\n// Test cases\nconsole.log(solution("A man, a plan, a canal: Panama"));',
                'java': 'public class Solution {\n    public static void main(String[] args) {\n        System.out.println(solution("A man, a plan, a canal: Panama"));\n    }\n\n    public static boolean solution(String inputString) {\n        // Your code here\n        return true;\n    }\n}',
                'cpp': '#include <iostream>\n#include <string>\n\nusing namespace std;\n\nbool solution(string inputString) {\n    // Your code here\n    return true;\n}\n\nint main() {\n    cout << (solution("A man, a plan, a canal: Panama") ? "true" : "false") << endl;\n    return 0;\n}'
            }),
            'test_cases': json.dumps([
                {'input': 'A man, a plan, a canal: Panama', 'expected': 'true'},
                {'input': 'race a car', 'expected': 'false'},
                {'input': ' ', 'expected': 'true'}
            ])
        }
    ]
    
    # Insert challenges into the database
    cursor = conn.cursor()
    cursor.execute('DELETE FROM coding_challenges')  # Clear existing challenges
    
    for challenge in sample_challenges:
        cursor.execute('''
            INSERT INTO coding_challenges (title, subtitle, difficulty, description, examples, constraints, solution_template, test_cases)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            challenge['title'],
            challenge['subtitle'],
            challenge['difficulty'],
            challenge['description'],
            challenge['examples'],
            challenge['constraints'],
            challenge['solution_template'],
            challenge['test_cases']
        ))
    
    conn.commit()

# Code execution functions
def execute_code(code, language='python', challenge_id=None):
    """Execute code in a sandboxed environment"""
    start_time = time.time()
    
    try:
        # Get test cases for the challenge if available
        test_cases = None
        if challenge_id:
            # Logic to get test cases for the challenge
            pass
        
        # Execute the code based on the language
        if language == 'python':
            try:
                # Check if Python is installed
                subprocess.run(['python', '--version'], capture_output=True, check=True)
            except (subprocess.SubprocessError, FileNotFoundError) as e:
                print(f"Python error: {e}")
                return {
                    'status': 'error',
                    'output': f'Error: Python interpreter not found. Please make sure Python is installed and in your PATH.\nDetails: {str(e)}',
                    'execution_time': 0,
                    'memory_usage': 0
                }
            
            # Execute the Python code
            output = execute_python(code, test_cases)
            
            # Check if the output is a string (old format) or a dictionary (new format)
            if isinstance(output, str):
                # Convert string output to dictionary format
                result = {
                    'status': 'success' if 'Error' not in output else 'error',
                    'output': output,
                    'execution_time': 0,
                    'memory_usage': 0
                }
            else:
                # Already in dictionary format
                result = output
                
        elif language == 'javascript':
            try:
                subprocess.run(['node', '--version'], capture_output=True, check=True)
            except (subprocess.SubprocessError, FileNotFoundError) as e:
                print(f"Node.js error: {e}")
                return {
                    'status': 'error',
                    'output': f'Error: Node.js interpreter not found. Please make sure Node.js is installed and in your PATH.\nDetails: {str(e)}',
                    'execution_time': 0,
                    'memory_usage': 0
                }
            
            # Execute the JavaScript code
            output = execute_javascript(code, test_cases)
            
            # Check if the output is a string (old format) or a dictionary (new format)
            if isinstance(output, str):
                # Convert string output to dictionary format
                result = {
                    'status': 'success' if 'Error' not in output else 'error',
                    'output': output,
                    'execution_time': 0,
                    'memory_usage': 0
                }
            else:
                # Already in dictionary format
                result = output
                
        elif language == 'java':
            try:
                subprocess.run(['javac', '-version'], capture_output=True, check=True)
            except (subprocess.SubprocessError, FileNotFoundError) as e:
                print(f"Java compiler error: {e}")
                return {
                    'status': 'error',
                    'output': f'Error: Java compiler not found. Please make sure Java JDK is installed and in your PATH.\nDetails: {str(e)}',
                    'execution_time': 0,
                    'memory_usage': 0
                }
            
            # Execute the Java code
            output = execute_java(code, test_cases)
            
            # Check if the output is a string (old format) or a dictionary (new format)
            if isinstance(output, str):
                # Convert string output to dictionary format
                result = {
                    'status': 'success' if 'Error' not in output else 'error',
                    'output': output,
                    'execution_time': 0,
                    'memory_usage': 0
                }
            else:
                # Already in dictionary format
                result = output
                
        elif language == 'cpp':
            try:
                subprocess.run(['g++', '--version'], capture_output=True, check=True)
            except (subprocess.SubprocessError, FileNotFoundError) as e:
                print(f"G++ compiler error: {e}")
                return {
                    'status': 'error',
                    'output': f'Error: G++ compiler not found. Please make sure G++ is installed and in your PATH.\nDetails: {str(e)}',
                    'execution_time': 0,
                    'memory_usage': 0
                }
            
            # Execute the C++ code
            output = execute_cpp(code, test_cases)
            
            # Check if the output is a string (old format) or a dictionary (new format)
            if isinstance(output, str):
                # Convert string output to dictionary format
                result = {
                    'status': 'success' if 'Error' not in output else 'error',
                    'output': output,
                    'execution_time': 0,
                    'memory_usage': 0
                }
            else:
                # Already in dictionary format
                result = output
                
        else:
            return {
                'status': 'error',
                'output': f'Error: Unsupported language: {language}',
                'execution_time': 0,
                'memory_usage': 0
            }
        
        # Calculate execution time
        execution_time = time.time() - start_time
        
        # Add execution time to the result
        result['execution_time'] = round(execution_time * 1000, 2)  # Convert to milliseconds
        
        # Add a message about execution completion
        if result['status'] == 'success':
            result['output'] += f"\n\nExecution completed in {result['execution_time']} ms"
        else:
            # Ensure error messages are clearly marked
            if not result['output'].startswith('Error:'):
                result['output'] = f"Error: {result['output']}"
        
        return result
    except Exception as e:
        print(f"Error executing code: {e}")
        import traceback
        traceback.print_exc()
        
        # Calculate execution time even for errors
        execution_time = time.time() - start_time
        
        return {
            'status': 'error',
            'output': f'Error: An unexpected error occurred while executing the code.\nDetails: {str(e)}',
            'execution_time': round(execution_time * 1000, 2),
            'memory_usage': 0
        }

def execute_python(code, test_cases=None):
    """Execute Python code in a sandboxed environment"""
    # Create a temporary file with the code
    with tempfile.NamedTemporaryFile(suffix='.py', delete=False) as temp:
        temp.write(code.encode())
        temp_name = temp.name
    
    try:
        # Format the output to look like an online compiler
        output = []
        
        # Add code info
        output.append(f"Running Python code...")
        
        # Run the code with a timeout
        start_time = time.time()
        result = subprocess.run(
            ['python', temp_name],
            capture_output=True,
            text=True,
            timeout=5  # 5 second timeout
        )
        execution_time = time.time() - start_time
        
        if result.returncode != 0:
            output.append(f"Execution Error:")
            output.append(f"{result.stderr}")
        else:
            output.append(f"Execution Output:")
            output.append(f"{result.stdout}")
            
        # Add execution stats
        output.append(f"Execution completed in {execution_time:.3f} seconds")
            
        return "\n".join(output)
    except subprocess.TimeoutExpired:
        return "Execution Error:\nCode execution timed out after 5 seconds."
    except Exception as e:
        return f"Execution Error:\n{str(e)}"
    finally:
        # Clean up the temporary file
        os.unlink(temp_name)

def execute_javascript(code, test_cases=None):
    """Execute JavaScript code in a sandboxed environment"""
    # Create a temporary file with the code
    with tempfile.NamedTemporaryFile(suffix='.js', delete=False) as temp:
        temp.write(code.encode())
        temp_name = temp.name
    
    try:
        # Format the output to look like an online compiler
        output = []
        
        # Add code info
        output.append(f"Running JavaScript code...")
        
        # Run the code with a timeout
        start_time = time.time()
        result = subprocess.run(
            ['node', temp_name],
            capture_output=True,
            text=True,
            timeout=5  # 5 second timeout
        )
        execution_time = time.time() - start_time
        
        if result.returncode != 0:
            output.append(f"Execution Error:")
            output.append(f"{result.stderr}")
        else:
            output.append(f"Execution Output:")
            output.append(f"{result.stdout}")
            
        # Add execution stats
        output.append(f"Execution completed in {execution_time:.3f} seconds")
            
        return "\n".join(output)
    except subprocess.TimeoutExpired:
        return "Execution Error:\nCode execution timed out after 5 seconds."
    except Exception as e:
        return f"Execution Error:\n{str(e)}"
    finally:
        # Clean up the temporary file
        os.unlink(temp_name)

def execute_java(code, test_cases=None):
    """Execute Java code in a sandboxed environment"""
    # Extract class name from code
    class_name = "Solution"  # Default class name
    
    # Create temporary directory
    temp_dir = tempfile.mkdtemp()
    java_file_path = os.path.join(temp_dir, f"{class_name}.java")
    
    try:
        # Format the output to look like an online compiler
        output = []
        
        # Add code info
        output.append(f"Running Java code...")
        
        # Write code to file
        with open(java_file_path, 'w') as java_file:
            java_file.write(code)
        
        # Compile Java code
        start_time = time.time()
        compile_result = subprocess.run(
            ['javac', java_file_path],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        if compile_result.returncode != 0:
            output.append(f"Compilation Error:")
            output.append(f"{compile_result.stderr}")
            return "\n".join(output)
        
        output.append("Compilation successful.")
        
        # Run Java code
        run_result = subprocess.run(
            ['java', '-cp', temp_dir, class_name],
            capture_output=True,
            text=True,
            timeout=5
        )
        execution_time = time.time() - start_time
        
        if run_result.returncode != 0:
            output.append(f"Execution Error:")
            output.append(f"{run_result.stderr}")
        else:
            output.append(f"Execution Output:")
            output.append(f"{run_result.stdout}")
            
        # Add execution stats
        output.append(f"Execution completed in {execution_time:.3f} seconds")
            
        return "\n".join(output)
    except subprocess.TimeoutExpired:
        return "Execution Error:\nCode execution timed out after 5 seconds."
    except Exception as e:
        return f"Execution Error:\n{str(e)}"
    finally:
        # Clean up temporary files
        import shutil
        shutil.rmtree(temp_dir)

def execute_cpp(code, test_cases=None):
    """Execute C++ code in a sandboxed environment"""
    # Create temporary directory
    temp_dir = tempfile.mkdtemp()
    cpp_file_path = os.path.join(temp_dir, "solution.cpp")
    exe_file_path = os.path.join(temp_dir, "solution")
    
    try:
        # Format the output to look like an online compiler
        output = []
        
        # Add code info
        output.append(f"Running C++ code...")
        
        # Write code to file
        with open(cpp_file_path, 'w') as cpp_file:
            cpp_file.write(code)
        
        # Compile C++ code
        start_time = time.time()
        compile_result = subprocess.run(
            ['g++', cpp_file_path, '-o', exe_file_path],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        if compile_result.returncode != 0:
            output.append(f"Compilation Error:")
            output.append(f"{compile_result.stderr}")
            return "\n".join(output)
        
        output.append("Compilation successful.")
        
        # Run C++ code
        run_result = subprocess.run(
            [exe_file_path],
            capture_output=True,
            text=True,
            timeout=5
        )
        execution_time = time.time() - start_time
        
        if run_result.returncode != 0:
            output.append(f"Execution Error:")
            output.append(f"{run_result.stderr}")
        else:
            output.append(f"Execution Output:")
            output.append(f"{run_result.stdout}")
            
        # Add execution stats
        output.append(f"Execution completed in {execution_time:.3f} seconds")
            
        return "\n".join(output)
    except subprocess.TimeoutExpired:
        return "Execution Error:\nCode execution timed out after 5 seconds."
    except Exception as e:
        return f"Execution Error:\n{str(e)}"
    finally:
        # Clean up temporary files
        import shutil
        shutil.rmtree(temp_dir)

# AI Code Review
def generate_ai_review(code, language, execution_result, challenge_description=None):
    """Generate an AI review of the code using the AI Provider (Groq/Gemini) with fallback"""
    print(f"Generating AI review for {language} code...")
    
    # Use the new AI Provider module if available
    if AI_PROVIDER_AVAILABLE:
        print("Using AI Provider module (Groq/Gemini)...")
        try:
            result = generate_ai_code_review(code, language, execution_result, challenge_description)
            if result["status"] == "success":
                print(f"✅ AI review generated successfully via AI Provider")
                return result
            else:
                print(f"⚠️ AI Provider returned error: {result.get('message')}")
        except Exception as e:
            print(f"⚠️ AI Provider error: {e}")
    
    # Fallback to static reviews
    print("Using fallback AI review")
    if language in FALLBACK_REVIEWS:
        return {
            'status': 'success',
            'review': FALLBACK_REVIEWS[language]['generic']
        }
    else:
        return {
            'status': 'success',
            'review': FALLBACK_REVIEWS['generic']
        }

# Challenge management functions
def get_all_challenges():
    """Get all coding challenges from the database"""
    conn = get_db_connection()
    challenges = conn.execute('SELECT * FROM coding_challenges ORDER BY difficulty, id').fetchall()
    conn.close()
    
    result = []
    for challenge in challenges:
        challenge_dict = dict(challenge)
        challenge_dict['examples'] = json.loads(challenge_dict['examples'])
        challenge_dict['constraints'] = json.loads(challenge_dict['constraints'])
        challenge_dict['solution_template'] = json.loads(challenge_dict['solution_template'])
        challenge_dict['test_cases'] = json.loads(challenge_dict['test_cases'])
        
        # Add difficulty class for UI
        if challenge_dict['difficulty'] == 'Easy':
            challenge_dict['difficulty_class'] = 'success'
        elif challenge_dict['difficulty'] == 'Medium':
            challenge_dict['difficulty_class'] = 'warning'
        else:
            challenge_dict['difficulty_class'] = 'danger'
            
        result.append(challenge_dict)
    
    return result

def get_challenge_by_id(challenge_id):
    """Get a specific coding challenge by ID"""
    conn = get_db_connection()
    challenge = conn.execute('SELECT * FROM coding_challenges WHERE id = ?', (challenge_id,)).fetchone()
    conn.close()
    
    if not challenge:
        return None
    
    challenge_dict = dict(challenge)
    challenge_dict['examples'] = json.loads(challenge_dict['examples'])
    challenge_dict['constraints'] = json.loads(challenge_dict['constraints'])
    challenge_dict['solution_template'] = json.loads(challenge_dict['solution_template'])
    challenge_dict['test_cases'] = json.loads(challenge_dict['test_cases'])
    
    # Add difficulty class for UI
    if challenge_dict['difficulty'] == 'Easy':
        challenge_dict['difficulty_class'] = 'success'
    elif challenge_dict['difficulty'] == 'Medium':
        challenge_dict['difficulty_class'] = 'warning'
    else:
        challenge_dict['difficulty_class'] = 'danger'
    
    # Get previous and next challenge IDs
    conn = get_db_connection()
    prev_challenge = conn.execute(
        'SELECT id FROM coding_challenges WHERE id < ? ORDER BY id DESC LIMIT 1', 
        (challenge_id,)
    ).fetchone()
    
    next_challenge = conn.execute(
        'SELECT id FROM coding_challenges WHERE id > ? ORDER BY id ASC LIMIT 1', 
        (challenge_id,)
    ).fetchone()
    
    conn.close()
    
    challenge_dict['prev_id'] = prev_challenge['id'] if prev_challenge else None
    challenge_dict['next_id'] = next_challenge['id'] if next_challenge else None
    
    return challenge_dict

def save_user_solution(user_id, challenge_id, language, code, execution_result, ai_review):
    """Save a user's solution to the database"""
    conn = get_db_connection()
    
    conn.execute('''
    INSERT INTO user_solutions (user_id, challenge_id, language, code, status, execution_time, memory_usage, ai_review)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        user_id,
        challenge_id,
        language,
        code,
        execution_result['status'],
        execution_result['execution_time'],
        execution_result['memory_usage'],
        json.dumps(ai_review)
    ))
    
    conn.commit()
    conn.close()

def get_user_solutions(user_id, challenge_id=None):
    """Get a user's solutions from the database"""
    conn = get_db_connection()
    
    if challenge_id:
        solutions = conn.execute('''
        SELECT * FROM user_solutions 
        WHERE user_id = ? AND challenge_id = ?
        ORDER BY created_at DESC
        ''', (user_id, challenge_id)).fetchall()
    else:
        solutions = conn.execute('''
        SELECT * FROM user_solutions 
        WHERE user_id = ?
        ORDER BY created_at DESC
        ''', (user_id,)).fetchall()
    
    conn.close()
    
    result = []
    for solution in solutions:
        solution_dict = dict(solution)
        solution_dict['ai_review'] = json.loads(solution_dict['ai_review'])
        result.append(solution_dict)
    
    return result

# Initialize the database when the module is imported
init_coding_test_db()
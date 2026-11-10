import os
#!/usr/bin/env python3
"""
MathMaster - Standalone Math Test Application
A focused math practice application using the arithmetic questions from Interview Mentor
"""

from flask import Flask, render_template_string, request, jsonify, session
import random
import json
from datetime import datetime

# Import the arithmetic questions
from arithmetic_questions import ARITHMETIC_QUESTIONS, get_questions_by_topic, get_all_topics

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-only-change-me")

# HTML Template for the Math Test
MATHMASTER_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MathMaster - Practice Math Questions</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 15px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header { 
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white; 
            padding: 30px; 
            text-align: center; 
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { font-size: 1.2em; opacity: 0.9; }
        .content { padding: 30px; }
        .topic-selector { margin-bottom: 30px; }
        .topic-btn { 
            display: inline-block; 
            margin: 5px; 
            padding: 12px 20px; 
            background: #3498db; 
            color: white; 
            border: none; 
            border-radius: 25px; 
            cursor: pointer; 
            transition: all 0.3s;
            font-size: 14px;
        }
        .topic-btn:hover { background: #2980b9; transform: translateY(-2px); }
        .topic-btn.active { background: #e74c3c; }
        .question-card { 
            background: #f8f9fa; 
            border-radius: 10px; 
            padding: 25px; 
            margin: 20px 0; 
            border-left: 5px solid #3498db;
        }
        .question-text { font-size: 1.3em; margin-bottom: 20px; color: #2c3e50; }
        .options { list-style: none; }
        .options li { 
            margin: 10px 0; 
            padding: 15px; 
            background: white; 
            border-radius: 8px; 
            cursor: pointer; 
            transition: all 0.3s;
            border: 2px solid transparent;
        }
        .options li:hover { background: #e3f2fd; border-color: #2196f3; }
        .options li.selected { background: #2196f3; color: white; }
        .btn { 
            padding: 15px 30px; 
            background: #27ae60; 
            color: white; 
            border: none; 
            border-radius: 8px; 
            cursor: pointer; 
            font-size: 16px; 
            margin: 10px 5px;
            transition: all 0.3s;
        }
        .btn:hover { background: #229954; transform: translateY(-2px); }
        .btn-primary { background: #3498db; }
        .btn-primary:hover { background: #2980b9; }
        .stats { 
            display: flex; 
            justify-content: space-around; 
            background: #ecf0f1; 
            padding: 20px; 
            border-radius: 10px; 
            margin: 20px 0;
        }
        .stat-item { text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; color: #2c3e50; }
        .stat-label { color: #7f8c8d; }
        .result { 
            padding: 20px; 
            border-radius: 10px; 
            margin: 15px 0; 
            font-weight: bold;
        }
        .correct { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .incorrect { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .explanation { 
            background: #fff3cd; 
            color: #856404; 
            padding: 15px; 
            border-radius: 8px; 
            margin-top: 10px;
            border: 1px solid #ffeaa7;
        }
        .progress-bar { 
            width: 100%; 
            height: 10px; 
            background: #ecf0f1; 
            border-radius: 5px; 
            overflow: hidden; 
            margin: 20px 0;
        }
        .progress-fill { 
            height: 100%; 
            background: linear-gradient(90deg, #00b894, #00cec9); 
            transition: width 0.3s;
        }
        .hidden { display: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧮 MathMaster</h1>
            <p>Master Your Mathematical Skills</p>
        </div>
        
        <div class="content">
            <div id="home-screen">
                <h2>Choose Your Math Topic</h2>
                <div class="topic-selector">
                    <button class="topic-btn" onclick="startTest('all')">All Topics</button>
                    <button class="topic-btn" onclick="startTest('Percentages')">Percentages</button>
                    <button class="topic-btn" onclick="startTest('Profit and Loss')">Profit & Loss</button>
                    <button class="topic-btn" onclick="startTest('Simple Interest')">Simple Interest</button>
                    <button class="topic-btn" onclick="startTest('Compound Interest')">Compound Interest</button>
                    <button class="topic-btn" onclick="startTest('Time and Work')">Time & Work</button>
                    <button class="topic-btn" onclick="startTest('Speed and Distance')">Speed & Distance</button>
                    <button class="topic-btn" onclick="startTest('Averages')">Averages</button>
                    <button class="topic-btn" onclick="startTest('Ratios and Proportions')">Ratios & Proportions</button>
                </div>
                
                <div class="stats">
                    <div class="stat-item">
                        <div class="stat-number">{{ total_questions }}</div>
                        <div class="stat-label">Total Questions</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">{{ total_topics }}</div>
                        <div class="stat-label">Topics Available</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">∞</div>
                        <div class="stat-label">Practice Sessions</div>
                    </div>
                </div>
            </div>
            
            <div id="test-screen" class="hidden">
                <div class="progress-bar">
                    <div class="progress-fill" id="progress"></div>
                </div>
                
                <div class="stats">
                    <div class="stat-item">
                        <div class="stat-number" id="current-q">1</div>
                        <div class="stat-label">Current Question</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number" id="total-q">10</div>
                        <div class="stat-label">Total Questions</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number" id="score">0</div>
                        <div class="stat-label">Score</div>
                    </div>
                </div>
                
                <div class="question-card">
                    <div class="question-text" id="question-text"></div>
                    <ul class="options" id="options-list"></ul>
                </div>
                
                <div id="result-area"></div>
                
                <button class="btn" id="submit-btn" onclick="submitAnswer()">Submit Answer</button>
                <button class="btn btn-primary hidden" id="next-btn" onclick="nextQuestion()">Next Question</button>
                <button class="btn btn-primary" onclick="goHome()">Back to Home</button>
            </div>
            
            <div id="final-screen" class="hidden">
                <h2>🎉 Test Complete!</h2>
                <div class="stats">
                    <div class="stat-item">
                        <div class="stat-number" id="final-score">0</div>
                        <div class="stat-label">Final Score</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number" id="final-percentage">0%</div>
                        <div class="stat-label">Percentage</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number" id="final-grade">A</div>
                        <div class="stat-label">Grade</div>
                    </div>
                </div>
                <button class="btn" onclick="goHome()">Take Another Test</button>
            </div>
        </div>
    </div>

    <script>
        let currentTest = [];
        let currentQuestionIndex = 0;
        let score = 0;
        let selectedAnswer = null;

        function startTest(topic) {
            fetch('/api/start-test', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({topic: topic})
            })
            .then(response => response.json())
            .then(data => {
                currentTest = data.questions;
                currentQuestionIndex = 0;
                score = 0;
                document.getElementById('home-screen').classList.add('hidden');
                document.getElementById('test-screen').classList.remove('hidden');
                document.getElementById('total-q').textContent = currentTest.length;
                loadQuestion();
            });
        }

        function loadQuestion() {
            if (currentQuestionIndex >= currentTest.length) {
                showFinalScreen();
                return;
            }

            const question = currentTest[currentQuestionIndex];
            document.getElementById('question-text').textContent = question.question;
            document.getElementById('current-q').textContent = currentQuestionIndex + 1;
            document.getElementById('score').textContent = score;
            
            const progress = ((currentQuestionIndex) / currentTest.length) * 100;
            document.getElementById('progress').style.width = progress + '%';

            const optionsList = document.getElementById('options-list');
            optionsList.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const li = document.createElement('li');
                li.textContent = option;
                li.onclick = () => selectOption(li, option);
                optionsList.appendChild(li);
            });

            document.getElementById('result-area').innerHTML = '';
            document.getElementById('submit-btn').classList.remove('hidden');
            document.getElementById('next-btn').classList.add('hidden');
            selectedAnswer = null;
        }

        function selectOption(element, answer) {
            document.querySelectorAll('.options li').forEach(li => li.classList.remove('selected'));
            element.classList.add('selected');
            selectedAnswer = answer;
        }

        function submitAnswer() {
            if (!selectedAnswer) {
                alert('Please select an answer!');
                return;
            }

            const question = currentTest[currentQuestionIndex];
            const isCorrect = selectedAnswer === question.answer;
            
            if (isCorrect) {
                score++;
                document.getElementById('score').textContent = score;
            }

            const resultDiv = document.createElement('div');
            resultDiv.className = 'result ' + (isCorrect ? 'correct' : 'incorrect');
            resultDiv.innerHTML = `
                <strong>${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</strong><br>
                Correct Answer: ${question.answer}
                ${question.explanation ? `<div class="explanation"><strong>Explanation:</strong> ${question.explanation}</div>` : ''}
            `;
            
            document.getElementById('result-area').appendChild(resultDiv);
            document.getElementById('submit-btn').classList.add('hidden');
            document.getElementById('next-btn').classList.remove('hidden');
        }

        function nextQuestion() {
            currentQuestionIndex++;
            loadQuestion();
        }

        function showFinalScreen() {
            const percentage = Math.round((score / currentTest.length) * 100);
            let grade = 'F';
            if (percentage >= 90) grade = 'A+';
            else if (percentage >= 80) grade = 'A';
            else if (percentage >= 70) grade = 'B';
            else if (percentage >= 60) grade = 'C';
            else if (percentage >= 50) grade = 'D';

            document.getElementById('test-screen').classList.add('hidden');
            document.getElementById('final-screen').classList.remove('hidden');
            document.getElementById('final-score').textContent = `${score}/${currentTest.length}`;
            document.getElementById('final-percentage').textContent = percentage + '%';
            document.getElementById('final-grade').textContent = grade;
        }

        function goHome() {
            document.getElementById('test-screen').classList.add('hidden');
            document.getElementById('final-screen').classList.add('hidden');
            document.getElementById('home-screen').classList.remove('hidden');
        }
    </script>
</body>
</html>
"""

@app.route('/')
def home():
    """Main page for MathMaster"""
    total_questions = len(ARITHMETIC_QUESTIONS)
    total_topics = len(get_all_topics())
    
    return render_template_string(MATHMASTER_TEMPLATE, 
                                total_questions=total_questions,
                                total_topics=total_topics)

@app.route('/api/start-test', methods=['POST'])
def start_test():
    """Start a new math test"""
    data = request.get_json()
    topic = data.get('topic', 'all')
    
    if topic == 'all':
        questions = ARITHMETIC_QUESTIONS.copy()
    else:
        questions = get_questions_by_topic(topic)
    
    # Shuffle and limit to 10 questions for a quick test
    random.shuffle(questions)
    test_questions = questions[:min(10, len(questions))]
    
    # Store in session for tracking
    session['current_test'] = {
        'questions': test_questions,
        'topic': topic,
        'start_time': datetime.now().isoformat()
    }
    
    return jsonify({
        'questions': test_questions,
        'topic': topic,
        'total': len(test_questions)
    })

@app.route('/api/topics')
def get_topics():
    """Get all available math topics"""
    topics = get_all_topics()
    return jsonify({'topics': topics})

@app.route('/api/questions/<topic>')
def get_topic_questions(topic):
    """Get questions for a specific topic"""
    if topic == 'all':
        questions = ARITHMETIC_QUESTIONS
    else:
        questions = get_questions_by_topic(topic)
    
    return jsonify({
        'topic': topic,
        'questions': questions,
        'count': len(questions)
    })

if __name__ == '__main__':
    print("🧮 Starting MathMaster - Your Math Practice Companion!")
    print("=" * 60)
    print("📊 Available Topics:")
    for topic in get_all_topics():
        count = len(get_questions_by_topic(topic))
        print(f"   • {topic}: {count} questions")
    print("=" * 60)
    print("🌐 Open your browser and go to: http://localhost:5000")
    print("🎯 Practice math questions and improve your skills!")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5000)

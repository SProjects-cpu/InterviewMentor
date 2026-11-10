# Interview Mentor - Setup Instructions

This document provides instructions on how to set up and run the Interview Mentor application.

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

## Installation

1. Clone or download this repository to your local machine.

2. Install the required dependencies:
   ```
   python -m pip install flask==2.0.1 flask-login==0.5.0 flask-session==0.4.0 flask-wtf==0.15.1 werkzeug==2.0.1 python-dotenv==0.19.0 google-generativeai==0.3.0 reportlab==4.0.0 sentence-transformers==2.2.2
   ```

## Running the Application

### Option 1: Using the Batch File (Windows)

1. Double-click the `run_app_fixed.bat` file.
2. The application will start and be available at http://127.0.0.1:5000
3. Press Ctrl+C in the terminal window to stop the server when you're done.

### Option 2: Using the Command Line

1. Open a terminal or command prompt.
2. Navigate to the project directory.
3. Run the following command:
   ```
   python app.py
   ```
4. The application will be available at http://127.0.0.1:5000
5. Press Ctrl+C to stop the server when you're done.

## Features

- **Aptitude Tests**: Practice various aptitude tests including arithmetic, vocabulary, reading comprehension, and more.
- **Career Guidance**: Get personalized career guidance based on your skills and interests.
- **Resume Builder**: Create professional resumes with a user-friendly interface.
- **Coding Tests**: Practice coding challenges and get AI-powered feedback.

## Troubleshooting

If you encounter issues with the dependencies, try using the full path to Python:

```
C:\Users\Administrator\AppData\Local\Microsoft\WindowsApps\python.exe -m pip install flask==2.0.1 flask-login==0.5.0 flask-session==0.4.0 flask-wtf==0.15.1 werkzeug==2.0.1 python-dotenv==0.19.0 google-generativeai==0.3.0 reportlab==4.0.0 sentence-transformers==2.2.2
```

And to run the application:

```
C:\Users\Administrator\AppData\Local\Microsoft\WindowsApps\python.exe app.py
```

If you see a warning about the GEMINI_API_KEY, you can ignore it if you don't need the AI code review functionality.

If you see warnings about missing libraries like reportlab or sentence_transformers, the application will still run but with reduced functionality:
- Without reportlab: PDF generation in the resume builder will not work
- Without sentence_transformers: Some NLP features may not work

Check the `server_logs.txt` file for any error messages if the application fails to start. 
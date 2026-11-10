@echo off
echo Starting Interview Mentor Application...

REM Check if virtual environment exists
if not exist venv_fresh (
    echo Virtual environment not found. Please run install_deps_fresh.bat first.
    pause
    exit /b
)

REM Activate the virtual environment
call venv_fresh\Scripts\activate.bat

echo Starting the application...
echo The application will be available at http://127.0.0.1:5000
echo Press Ctrl+C to stop the server when you're done.

REM Run the application
python app.py

pause 
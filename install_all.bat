@echo off
echo ============================================
echo   Installing All Dependencies
echo ============================================
echo.

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Install from https://python.org
    pause
    exit /b 1
)

:: Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)

echo [1/4] Creating Python virtual environment...
if not exist "venv" python -m venv venv
call venv\Scripts\activate.bat

echo [2/4] Installing Python dependencies...
pip install --upgrade pip
pip install -r requirements.txt

echo [3/4] Installing Next.js Frontend dependencies...
cd frontend
call npm install
cd ..

echo [4/4] Installing ATS Resume Builder dependencies...
cd "ATS-Resume builder"
call npm install
cd ..

echo.
echo ============================================
echo   Installation Complete!
echo ============================================
echo.
echo Run 'start_all.bat' to start all services.
pause

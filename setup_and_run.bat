@echo off
setlocal enabledelayedexpansion

echo ============================================
echo   Interview Mentor - Complete Setup Script
echo ============================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed or not in PATH
    pause
    exit /b 1
)

echo [OK] Python found: 
python --version
echo [OK] Node.js found:
node --version
echo [OK] npm found:
npm --version
echo.

:: ============================================
:: STEP 1: Setup Python Virtual Environment
:: ============================================
echo ============================================
echo   Step 1: Setting up Python Environment
echo ============================================

if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install --upgrade pip
pip install -r requirements.txt

if errorlevel 1 (
    echo [WARNING] Some Python packages may have failed to install
    echo Continuing with essential packages...
)

echo [OK] Python setup complete!
echo.

:: ============================================
:: STEP 2: Setup Next.js Frontend
:: ============================================
echo ============================================
echo   Step 2: Setting up Next.js Frontend
echo ============================================

cd frontend
echo Installing frontend dependencies...
call npm install

if errorlevel 1 (
    echo [ERROR] Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)

echo [OK] Frontend setup complete!
cd ..
echo.

:: ============================================
:: STEP 3: Setup ATS Resume Builder
:: ============================================
echo ============================================
echo   Step 3: Setting up ATS Resume Builder
echo ============================================

cd "ATS-Resume builder"
echo Installing Resume Builder dependencies...
call npm install

if errorlevel 1 (
    echo [ERROR] Failed to install Resume Builder dependencies
    cd ..
    pause
    exit /b 1
)

echo [OK] Resume Builder setup complete!
cd ..
echo.

:: ============================================
:: STEP 4: Create .env file if not exists
:: ============================================
echo ============================================
echo   Step 4: Checking Environment Variables
echo ============================================

if not exist ".env" (
    echo Creating .env file from example...
    copy .env.example .env
    echo [WARNING] Please update .env with your API keys!
) else (
    echo [OK] .env file exists
)

:: Create frontend .env.local if not exists
if not exist "frontend\.env.local" (
    echo Creating frontend\.env.local...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:5000
        echo NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5000/graphql
    ) > frontend\.env.local
)

echo [OK] Environment setup complete!
echo.

:: ============================================
:: STEP 5: Start All Services
:: ============================================
echo ============================================
echo   Step 5: Starting All Services
echo ============================================
echo.
echo Starting services in separate windows...
echo.

:: Start Flask Backend (Port 5000)
echo [1/3] Starting Flask Backend on http://localhost:5000
start "Flask Backend" cmd /k "cd /d %~dp0 && call venv\Scripts\activate.bat && python api_app.py"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start Next.js Frontend (Port 3000)
echo [2/3] Starting Next.js Frontend on http://localhost:3000
start "Next.js Frontend" cmd /k "cd /d %~dp0\frontend && npm run dev"

:: Wait a moment
timeout /t 2 /nobreak >nul

:: Start ATS Resume Builder (Port 3001)
echo [3/3] Starting ATS Resume Builder on http://localhost:3001
start "Resume Builder" cmd /k "cd /d %~dp0\ATS-Resume builder && set PORT=3001 && npm run dev"

echo.
echo ============================================
echo   All Services Started Successfully!
echo ============================================
echo.
echo   Flask Backend:      http://localhost:5000
echo   Next.js Frontend:   http://localhost:3000
echo   Resume Builder:     http://localhost:3001
echo.
echo   Press any key to open the frontend in browser...
pause >nul

start http://localhost:3000

echo.
echo To stop all services, close the terminal windows.
echo.
pause

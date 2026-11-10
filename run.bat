@echo off
echo ============================================
echo   Interview Mentor - Starting All Services
echo ============================================
echo.

:: Get the current directory
set ROOT_DIR=%~dp0

:: Start Flask API Backend (Port 5000)
echo [1/3] Starting Flask API Backend on http://localhost:5000
start "Flask API Backend" cmd /k "cd /d %ROOT_DIR% && call venv\Scripts\activate.bat && python api_app.py"

:: Wait for backend to start
timeout /t 3 /nobreak >nul

:: Start Next.js Frontend (Port 3000)
echo [2/3] Starting Next.js Frontend on http://localhost:3000
start "Next.js Frontend" cmd /k "cd /d %ROOT_DIR%frontend && npm run dev"

:: Wait a moment
timeout /t 2 /nobreak >nul

:: Start ATS Resume Builder (Port 3001)
echo [3/3] Starting ATS Resume Builder on http://localhost:3001
start "ATS Resume Builder" cmd /k "cd /d %ROOT_DIR%ATS-Resume builder && set PORT=3001 && npm run dev"

echo.
echo ============================================
echo   All Services Starting...
echo ============================================
echo.
echo   Flask API Backend:   http://localhost:5000
echo   Next.js Frontend:    http://localhost:3000
echo   ATS Resume Builder:  http://localhost:3001
echo.
echo   Opening browser in 5 seconds...
timeout /t 5 /nobreak >nul

start http://localhost:3000

echo.
echo   To stop all services, close the terminal windows.
echo.
pause

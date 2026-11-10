@echo off
echo ============================================
echo   Starting All Services
echo ============================================
echo.

:: Start Flask Backend
echo [1/3] Starting Flask Backend (Port 5000)...
start "Flask Backend" cmd /k "cd /d %~dp0 && call venv\Scripts\activate.bat && python app.py"
timeout /t 3 /nobreak >nul

:: Start Next.js Frontend
echo [2/3] Starting Next.js Frontend (Port 3000)...
start "Next.js Frontend" cmd /k "cd /d %~dp0\frontend && npm run dev"
timeout /t 2 /nobreak >nul

:: Start Resume Builder
echo [3/3] Starting Resume Builder (Port 3001)...
start "Resume Builder" cmd /k "cd /d %~dp0\ATS-Resume builder && set PORT=3001 && npm run dev"

echo.
echo ============================================
echo   Services Starting...
echo ============================================
echo.
echo   Flask Backend:    http://localhost:5000
echo   Frontend:         http://localhost:3000
echo   Resume Builder:   http://localhost:3001
echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak >nul
start http://localhost:3000
echo.
echo Close terminal windows to stop services.
pause

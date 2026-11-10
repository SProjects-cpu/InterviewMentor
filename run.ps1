# Interview Mentor - Run All Services (PowerShell)
# Run with: powershell -ExecutionPolicy Bypass -File run.ps1

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Interview Mentor - Starting All Services" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = $PSScriptRoot
if (-not $rootPath) { $rootPath = Get-Location }

# Start Flask API Backend (Port 5000)
Write-Host "[1/3] Starting Flask API Backend on http://localhost:5000" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootPath'; .\venv\Scripts\Activate.ps1; python api_app.py"

Start-Sleep -Seconds 3

# Start Next.js Frontend (Port 3000)
Write-Host "[2/3] Starting Next.js Frontend on http://localhost:3000" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootPath\frontend'; npm run dev"

Start-Sleep -Seconds 2

# Start ATS Resume Builder (Port 3001)
Write-Host "[3/3] Starting ATS Resume Builder on http://localhost:3001" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootPath\ATS-Resume builder'; `$env:PORT='3001'; npm run dev"

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  All Services Starting..." -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Flask API Backend:   http://localhost:5000" -ForegroundColor White
Write-Host "  Next.js Frontend:    http://localhost:3000" -ForegroundColor White
Write-Host "  ATS Resume Builder:  http://localhost:3001" -ForegroundColor White
Write-Host ""

Write-Host "Opening browser in 5 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "To stop all services, close the PowerShell windows." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"

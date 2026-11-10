# Interview Mentor - Complete Setup Script (PowerShell)
# Run with: powershell -ExecutionPolicy Bypass -File setup_and_run.ps1

$ErrorActionPreference = "Continue"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Interview Mentor - Complete Setup Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "[OK] $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Python is not installed" -ForegroundColor Red
    Write-Host "Please install Python from https://python.org"
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Host "[OK] Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org"
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version 2>&1
    Write-Host "[OK] npm $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] npm is not installed" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ============================================
# STEP 1: Setup Python Virtual Environment
# ============================================
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Step 1: Setting up Python Environment" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

if (-not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..."
    python -m venv venv
}

Write-Host "Activating virtual environment..."
& ".\venv\Scripts\Activate.ps1"

Write-Host "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

Write-Host "[OK] Python setup complete!" -ForegroundColor Green
Write-Host ""

# ============================================
# STEP 2: Setup Next.js Frontend
# ============================================
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Step 2: Setting up Next.js Frontend" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

Set-Location frontend
Write-Host "Installing frontend dependencies..."
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to install frontend dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "[OK] Frontend setup complete!" -ForegroundColor Green
Set-Location ..
Write-Host ""

# ============================================
# STEP 3: Setup ATS Resume Builder
# ============================================
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Step 3: Setting up ATS Resume Builder" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

Set-Location "ATS-Resume builder"
Write-Host "Installing Resume Builder dependencies..."
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to install Resume Builder dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "[OK] Resume Builder setup complete!" -ForegroundColor Green
Set-Location ..
Write-Host ""

# ============================================
# STEP 4: Create .env files if not exist
# ============================================
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Step 4: Checking Environment Variables" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "[WARNING] Created .env from example - please update with your API keys!" -ForegroundColor Yellow
    }
} else {
    Write-Host "[OK] .env file exists" -ForegroundColor Green
}

if (-not (Test-Path "frontend\.env.local")) {
    @"
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5000/graphql
"@ | Out-File -FilePath "frontend\.env.local" -Encoding UTF8
    Write-Host "[OK] Created frontend\.env.local" -ForegroundColor Green
}

Write-Host ""

# ============================================
# STEP 5: Start All Services
# ============================================
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Step 5: Starting All Services" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = Get-Location

# Start Flask Backend
Write-Host "[1/3] Starting Flask Backend on http://localhost:5000" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath'; .\venv\Scripts\Activate.ps1; python api_app.py"

Start-Sleep -Seconds 3

# Start Next.js Frontend
Write-Host "[2/3] Starting Next.js Frontend on http://localhost:3000" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\frontend'; npm run dev"

Start-Sleep -Seconds 2

# Start ATS Resume Builder
Write-Host "[3/3] Starting ATS Resume Builder on http://localhost:3001" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\ATS-Resume builder'; `$env:PORT=3001; npm run dev"

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  All Services Started Successfully!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Flask Backend:      http://localhost:5000" -ForegroundColor White
Write-Host "  Next.js Frontend:   http://localhost:3000" -ForegroundColor White
Write-Host "  Resume Builder:     http://localhost:3001" -ForegroundColor White
Write-Host ""

# Wait and open browser
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"

Write-Host "Browser opened to http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "To stop all services, close the PowerShell windows." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit this window"

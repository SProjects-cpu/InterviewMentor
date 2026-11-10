#!/usr/bin/env node

/**
 * Interview Mentor - Comprehensive Error Detection and Fix Script
 * This script checks for common issues and attempts to fix them automatically
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Interview Mentor - Error Detection & Fix Script');
console.log('================================================\n');

const errors = [];
const fixes = [];

// Helper function to check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Helper function to run command safely
function runCommand(command, description) {
  try {
    console.log(`⚡ ${description}...`);
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ ${description} - Success`);
    return { success: true, output };
  } catch (error) {
    console.log(`❌ ${description} - Failed: ${error.message}`);
    errors.push(`${description}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Check 1: Node.js and npm versions
function checkNodeAndNpm() {
  console.log('\n📋 Checking Node.js and npm...');
  
  const nodeCheck = runCommand('node --version', 'Node.js version check');
  const npmCheck = runCommand('npm --version', 'npm version check');
  
  if (nodeCheck.success && npmCheck.success) {
    console.log(`Node.js: ${nodeCheck.output.trim()}`);
    console.log(`npm: ${npmCheck.output.trim()}`);
  }
}

// Check 2: Project structure
function checkProjectStructure() {
  console.log('\n📁 Checking project structure...');
  
  const requiredFiles = [
    'frontend/package.json',
    'backend/package.json',
    'frontend/.env.local',
    'backend/.env',
    'backend/server.js',
    'frontend/src/lib/apollo-client.ts'
  ];
  
  requiredFiles.forEach(file => {
    if (fileExists(file)) {
      console.log(`✅ ${file} - Found`);
    } else {
      console.log(`❌ ${file} - Missing`);
      errors.push(`Missing required file: ${file}`);
    }
  });
}

// Check 3: Dependencies
function checkDependencies() {
  console.log('\n📦 Checking dependencies...');
  
  // Check frontend dependencies
  if (fileExists('frontend/node_modules')) {
    console.log('✅ Frontend node_modules - Found');
  } else {
    console.log('❌ Frontend node_modules - Missing');
    errors.push('Frontend dependencies not installed');
    fixes.push('Run: cd frontend && npm install');
  }
  
  // Check backend dependencies
  if (fileExists('backend/node_modules')) {
    console.log('✅ Backend node_modules - Found');
  } else {
    console.log('❌ Backend node_modules - Missing');
    errors.push('Backend dependencies not installed');
    fixes.push('Run: cd backend && npm install');
  }
}

// Check 4: Environment configuration
function checkEnvironmentConfig() {
  console.log('\n🔧 Checking environment configuration...');
  
  // Check frontend .env.local
  if (fileExists('frontend/.env.local')) {
    const frontendEnv = fs.readFileSync('frontend/.env.local', 'utf8');
    if (frontendEnv.includes('NEXT_PUBLIC_API_URL') && frontendEnv.includes('NEXT_PUBLIC_GRAPHQL_URL')) {
      console.log('✅ Frontend environment - Configured');
    } else {
      console.log('❌ Frontend environment - Incomplete');
      errors.push('Frontend environment variables incomplete');
    }
  }
  
  // Check backend .env
  if (fileExists('backend/.env')) {
    const backendEnv = fs.readFileSync('backend/.env', 'utf8');
    if (backendEnv.includes('MONGODB_URI') && backendEnv.includes('JWT_SECRET_KEY')) {
      console.log('✅ Backend environment - Configured');
    } else {
      console.log('❌ Backend environment - Incomplete');
      errors.push('Backend environment variables incomplete');
    }
  }
}

// Check 5: Port conflicts
function checkPortConflicts() {
  console.log('\n🔌 Checking for port conflicts...');
  
  try {
    // Check if port 3000 is in use
    execSync('netstat -an | findstr :3000', { stdio: 'pipe' });
    console.log('⚠️  Port 3000 may be in use');
  } catch (error) {
    console.log('✅ Port 3000 - Available');
  }
  
  try {
    // Check if port 5000 is in use
    execSync('netstat -an | findstr :5000', { stdio: 'pipe' });
    console.log('⚠️  Port 5000 may be in use');
  } catch (error) {
    console.log('✅ Port 5000 - Available');
  }
}

// Check 6: Build issues
function checkBuildIssues() {
  console.log('\n🏗️  Checking for build issues...');
  
  // Check frontend build
  process.chdir('frontend');
  const frontendBuild = runCommand('npm run build', 'Frontend build test');
  process.chdir('..');
  
  if (!frontendBuild.success) {
    fixes.push('Fix frontend build errors before running the application');
  }
}

// Auto-fix function
function autoFix() {
  console.log('\n🔧 Attempting automatic fixes...');
  
  // Fix 1: Install missing dependencies
  if (errors.some(e => e.includes('Frontend dependencies'))) {
    console.log('📦 Installing frontend dependencies...');
    process.chdir('frontend');
    runCommand('npm install', 'Frontend dependency installation');
    process.chdir('..');
  }
  
  if (errors.some(e => e.includes('Backend dependencies'))) {
    console.log('📦 Installing backend dependencies...');
    process.chdir('backend');
    runCommand('npm install', 'Backend dependency installation');
    process.chdir('..');
  }
  
  // Fix 2: Create missing environment files
  if (!fileExists('frontend/.env.local')) {
    console.log('📝 Creating frontend .env.local...');
    const frontendEnv = `NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5000/graphql
`;
    fs.writeFileSync('frontend/.env.local', frontendEnv);
    console.log('✅ Frontend .env.local created');
  }
}

// Main execution
async function main() {
  checkNodeAndNpm();
  checkProjectStructure();
  checkDependencies();
  checkEnvironmentConfig();
  checkPortConflicts();
  checkBuildIssues();
  
  console.log('\n📊 Summary');
  console.log('==========');
  
  if (errors.length === 0) {
    console.log('🎉 No errors detected! Your application should be ready to run.');
    console.log('\n🚀 To start the application:');
    console.log('1. Backend: cd backend && npm run dev');
    console.log('2. Frontend: cd frontend && npm run dev');
    console.log('3. Open: http://localhost:3000');
  } else {
    console.log(`❌ Found ${errors.length} error(s):`);
    errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
    
    if (fixes.length > 0) {
      console.log('\n🔧 Suggested fixes:');
      fixes.forEach((fix, index) => {
        console.log(`   ${index + 1}. ${fix}`);
      });
    }
    
    // Attempt auto-fix
    autoFix();
  }
}

main().catch(console.error);

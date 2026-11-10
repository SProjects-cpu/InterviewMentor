#!/usr/bin/env node

/**
 * Interview Mentor - Application Health Verification Script
 * This script verifies that all components of the application are working correctly
 */

const http = require('http');
const https = require('https');

console.log('🔍 Interview Mentor - Application Health Check');
console.log('=============================================\n');

// Helper function to make HTTP requests
function makeRequest(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data,
          headers: res.headers
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(timeout, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Test functions
async function testBackendHealth() {
  console.log('🏥 Testing Backend Health...');
  try {
    const response = await makeRequest('http://localhost:5000/api/health');
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log('✅ Backend Health Check: PASSED');
      console.log(`   Status: ${data.status}`);
      console.log(`   Message: ${data.message}`);
      console.log(`   Timestamp: ${data.timestamp}`);
      return true;
    } else {
      console.log(`❌ Backend Health Check: FAILED (Status: ${response.statusCode})`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Backend Health Check: FAILED (${error.message})`);
    return false;
  }
}

async function testFrontend() {
  console.log('\n🌐 Testing Frontend...');
  try {
    const response = await makeRequest('http://localhost:3000');
    if (response.statusCode === 200) {
      console.log('✅ Frontend: ACCESSIBLE');
      console.log(`   Status Code: ${response.statusCode}`);
      console.log(`   Content Type: ${response.headers['content-type']}`);
      return true;
    } else {
      console.log(`❌ Frontend: FAILED (Status: ${response.statusCode})`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Frontend: FAILED (${error.message})`);
    return false;
  }
}

async function testGraphQL() {
  console.log('\n🔗 Testing GraphQL Endpoint...');
  try {
    const response = await makeRequest('http://localhost:5000/graphql');
    if (response.statusCode === 200 || response.statusCode === 400) {
      // 400 is expected for GET request to GraphQL endpoint
      console.log('✅ GraphQL Endpoint: ACCESSIBLE');
      console.log(`   Status Code: ${response.statusCode}`);
      return true;
    } else {
      console.log(`❌ GraphQL Endpoint: FAILED (Status: ${response.statusCode})`);
      return false;
    }
  } catch (error) {
    console.log(`❌ GraphQL Endpoint: FAILED (${error.message})`);
    return false;
  }
}

async function testAPIEndpoints() {
  console.log('\n📡 Testing API Endpoints...');
  
  const endpoints = [
    '/api/quiz/aptitude/categories',
    '/api/coding/challenges',
  ];
  
  let passedCount = 0;
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`http://localhost:5000${endpoint}`);
      if (response.statusCode === 200 || response.statusCode === 401) {
        // 401 is acceptable for protected endpoints
        console.log(`✅ ${endpoint}: ACCESSIBLE`);
        passedCount++;
      } else {
        console.log(`⚠️  ${endpoint}: Status ${response.statusCode}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: FAILED (${error.message})`);
    }
  }
  
  console.log(`   API Endpoints: ${passedCount}/${endpoints.length} accessible`);
  return passedCount > 0;
}

// Main verification function
async function runHealthCheck() {
  console.log('Starting comprehensive health check...\n');
  
  const results = {
    backend: false,
    frontend: false,
    graphql: false,
    api: false
  };
  
  // Run all tests
  results.backend = await testBackendHealth();
  results.frontend = await testFrontend();
  results.graphql = await testGraphQL();
  results.api = await testAPIEndpoints();
  
  // Summary
  console.log('\n📊 Health Check Summary');
  console.log('========================');
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  console.log(`Backend Health: ${results.backend ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Frontend: ${results.frontend ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`GraphQL: ${results.graphql ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`API Endpoints: ${results.api ? '✅ PASS' : '❌ FAIL'}`);
  
  console.log(`\nOverall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL SYSTEMS OPERATIONAL!');
    console.log('The Interview Mentor application is running perfectly.');
    console.log('\n🌐 Access URLs:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend: http://localhost:5000');
    console.log('   GraphQL: http://localhost:5000/graphql');
    console.log('   Health: http://localhost:5000/api/health');
  } else {
    console.log('\n⚠️  Some components are not responding correctly.');
    console.log('Please check that both frontend and backend servers are running.');
  }
  
  return passedTests === totalTests;
}

// Run the health check
runHealthCheck().catch(console.error);

#!/usr/bin/env node

/**
 * Comprehensive Integration Test
 * Tests backend API + Sui blockchain integration
 */

const http = require('http');
const crypto = require('crypto');
require('dotenv').config();

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

// Test configuration
const TEST_USER = {
  email: `test_${Date.now()}@safenet.test`,
  password: 'TestPass123',
  firstName: 'Test',
  lastName: 'User',
  phone: '+233123456789'
};

let accessToken = null;
let refreshToken = null;
let userId = null;
let incidentId = null;
let incidentHash = null;
let blockchainTxId = null;
let blockchainRecordId = null;

// Color output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// HTTP request helper
function makeRequest(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test cases
const tests = [];

// Test 1: Health Check
tests.push({
  name: 'Health Check',
  test: async () => {
    const result = await makeRequest('/health');
    return result.status === 200 && result.data.success === true;
  }
});

// Test 2: Register User
tests.push({
  name: 'Register User',
  test: async () => {
    const result = await makeRequest('/auth/register', 'POST', TEST_USER);
    if (result.status === 201 && result.data.success) {
      accessToken = result.data.data.tokens.accessToken;
      refreshToken = result.data.data.tokens.refreshToken;
      userId = result.data.data.user._id;
      log(`   ✓ User ID: ${userId}`, 'cyan');
      log(`   ✓ Email: ${TEST_USER.email}`, 'cyan');
      return true;
    }
    return false;
  }
});

// Test 3: Login
tests.push({
  name: 'Login User',
  test: async () => {
    const result = await makeRequest('/auth/login', 'POST', {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    if (result.status === 200 && result.data.success) {
      accessToken = result.data.data.tokens.accessToken;
      return true;
    }
    return false;
  }
});

// Test 4: Get Current User
tests.push({
  name: 'Get Current User',
  test: async () => {
    const result = await makeRequest('/auth/me', 'GET', null, accessToken);
    return result.status === 200 && result.data.success;
  }
});

// Test 5: Create Incident (Missing Person)
tests.push({
  name: 'Create Incident - Missing Person',
  test: async () => {
    const incidentData = {
      type: 'missing_person',
      title: 'Test Missing Person - Integration Test',
      description: 'This is a test incident created during integration testing. Person last seen at Accra Mall. Height: 5ft, Age: 25, Wearing blue shirt and jeans.',
      location: {
        address: 'Accra Mall, Spintex Road, Accra, Ghana',
        coordinates: {
          lat: 5.6037,
          lng: -0.1870
        }
      },
      metadata: {
        age: 25,
        gender: 'male',
        height: '5ft',
        clothing: 'blue shirt, jeans',
        testIncident: true
      }
    };

    const result = await makeRequest('/incidents', 'POST', incidentData, accessToken);
    if (result.status === 201 && result.data.success) {
      incidentId = result.data.data.incident._id;
      incidentHash = result.data.data.incident.incidentHash;
      blockchainTxId = result.data.data.incident.blockchainTxId;
      blockchainRecordId = result.data.data.incident.blockchainRecordId;
      
      log(`   ✓ Incident ID: ${incidentId}`, 'cyan');
      log(`   ✓ Incident Hash: ${incidentHash}`, 'cyan');
      if (blockchainTxId) {
        log(`   ✓ Blockchain TX ID: ${blockchainTxId}`, 'cyan');
      }
      if (blockchainRecordId) {
        log(`   ✓ Blockchain Record ID: ${blockchainRecordId}`, 'cyan');
      }
      return true;
    }
    log(`   Response: ${JSON.stringify(result.data)}`, 'yellow');
    return false;
  }
});

// Test 6: Get Incident
tests.push({
  name: 'Get Incident by ID',
  test: async () => {
    if (!incidentId) return false;
    const result = await makeRequest(`/incidents/${incidentId}`, 'GET', null, accessToken);
    return result.status === 200 && result.data.success;
  }
});

// Test 7: List Incidents
tests.push({
  name: 'List Incidents',
  test: async () => {
    const result = await makeRequest('/incidents?page=1&limit=10', 'GET', null, accessToken);
    return result.status === 200 && result.data.success && Array.isArray(result.data.data.incidents);
  }
});

// Test 8: Get Verified Alerts (Public)
tests.push({
  name: 'Get Verified Alerts (Public)',
  test: async () => {
    const result = await makeRequest('/incidents/alerts/verified');
    return result.status === 200 && result.data.success;
  }
});

// Test 9: Refresh Token
tests.push({
  name: 'Refresh Access Token',
  test: async () => {
    if (!refreshToken) return false;
    const result = await makeRequest('/auth/refresh-token', 'POST', { refreshToken });
    if (result.status === 200 && result.data.success) {
      accessToken = result.data.data.accessToken;
      return true;
    }
    return false;
  }
});

// Main test runner
async function runTests() {
  log('\n🧪 SafeNet Backend + Blockchain Integration Test\n', 'blue');
  log('=' .repeat(60), 'blue');
  log(`Testing against: ${API_BASE}`, 'cyan');
  log('=' .repeat(60) + '\n', 'blue');

  let passed = 0;
  let failed = 0;
  const failedTests = [];

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    try {
      log(`[${i + 1}/${tests.length}] ${test.name}...`, 'yellow');
      const result = await test.test();
      
      if (result) {
        log(`✅ ${test.name}`, 'green');
        passed++;
      } else {
        log(`❌ ${test.name}`, 'red');
        failed++;
        failedTests.push(test.name);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        log(`⚠️  ${test.name} - Server not running!`, 'yellow');
        log('   Start server with: npm run dev', 'yellow');
        break;
      } else {
        log(`❌ ${test.name} - Error: ${error.message}`, 'red');
        failed++;
        failedTests.push(test.name);
      }
    }
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  log('\n' + '='.repeat(60), 'blue');
  log('📊 Test Results', 'blue');
  log('='.repeat(60), 'blue');
  log(`✅ Passed: ${passed}`, 'green');
  log(`❌ Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`, 'cyan');

  if (failedTests.length > 0) {
    log('\n❌ Failed Tests:', 'red');
    failedTests.forEach(test => log(`   - ${test}`, 'red'));
  }

  // Blockchain Integration Status
  if (blockchainTxId || blockchainRecordId) {
    log('\n🔗 Blockchain Integration Status:', 'blue');
    if (blockchainTxId) {
      log(`   ✅ Transaction ID: ${blockchainTxId}`, 'green');
      log(`   🔍 View on Sui Explorer: https://suiexplorer.com/txblock/${blockchainTxId}?network=testnet`, 'cyan');
    }
    if (blockchainRecordId) {
      log(`   ✅ Record ID: ${blockchainRecordId}`, 'green');
    }
    if (!blockchainTxId && !blockchainRecordId) {
      log(`   ⚠️  Blockchain submission may be processing asynchronously`, 'yellow');
      log(`   ⚠️  Check server logs for blockchain transaction details`, 'yellow');
    }
  }

  log('\n' + '='.repeat(60) + '\n', 'blue');

  if (failed === 0) {
    log('🎉 All tests passed!', 'green');
    process.exit(0);
  } else {
    log('⚠️  Some tests failed. Check the output above.', 'yellow');
    process.exit(1);
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const result = await makeRequest('/health');
    return result.status === 200;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      log('\n❌ Server is not running!', 'red');
      log('Please start the server first:', 'yellow');
      log('   npm run dev', 'cyan');
      log('\nOr in another terminal:', 'yellow');
      log('   cd /home/phantomx/Videos/SafeNet', 'cyan');
      log('   npm run dev', 'cyan');
      process.exit(1);
    }
    throw error;
  }
}

// Run
(async () => {
  await checkServer();
  await runTests();
})().catch(console.error);

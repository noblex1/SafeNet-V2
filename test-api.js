/**
 * Simple API Test Script
 * Tests basic API endpoints without requiring MongoDB
 * Run: node test-api.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
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

async function runTests() {
  console.log('🧪 SafeNet Backend API Tests\n');
  console.log('⚠️  Note: These tests require the server to be running (npm run dev)\n');

  const tests = [
    {
      name: 'Health Check',
      test: async () => {
        const result = await makeRequest('/api/health');
        return result.status === 200 && result.data.success === true;
      },
    },
    {
      name: 'Register User (Validation Test)',
      test: async () => {
        try {
          const result = await makeRequest('/api/auth/register', 'POST', {
            email: 'invalid-email', // Should fail validation
            password: '123', // Too short
          });
          // Should return 400 for validation errors
          return result.status === 400;
        } catch (e) {
          return false;
        }
      },
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.test();
      if (result) {
        console.log(`✅ ${test.name}`);
        passed++;
      } else {
        console.log(`❌ ${test.name}`);
        failed++;
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`⚠️  ${test.name} - Server not running`);
        console.log('   Start server with: npm run dev');
        break;
      } else {
        console.log(`❌ ${test.name} - Error: ${error.message}`);
        failed++;
      }
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
}

// Run tests
runTests().catch(console.error);

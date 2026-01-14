#!/usr/bin/env node

/**
 * Blockchain Integration Test
 * Directly tests blockchain service integration
 */

require('dotenv').config();
const { BlockchainService } = require('./dist/services/blockchainService');

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

async function testBlockchainService() {
  log('\n🔗 Testing Blockchain Service Integration\n', 'blue');
  log('=' .repeat(60), 'blue');

  // Check configuration
  log('\n📋 Configuration Check:', 'yellow');
  log(`   Network: ${process.env.SUI_NETWORK || 'testnet'}`, 'cyan');
  log(`   Package ID: ${process.env.SUI_PACKAGE_ID ? '✅ Set' : '❌ Missing'}`, process.env.SUI_PACKAGE_ID ? 'green' : 'red');
  log(`   Registry ID: ${process.env.SUI_REGISTRY_ID ? '✅ Set' : '❌ Missing'}`, process.env.SUI_REGISTRY_ID ? 'green' : 'red');
  log(`   Private Key: ${process.env.SUI_PRIVATE_KEY ? '✅ Set' : '❌ Missing'}`, process.env.SUI_PRIVATE_KEY ? 'green' : 'red');

  if (!process.env.SUI_PACKAGE_ID || !process.env.SUI_REGISTRY_ID || !process.env.SUI_PRIVATE_KEY) {
    log('\n❌ Missing required blockchain configuration!', 'red');
    log('   Please check your .env file', 'yellow');
    process.exit(1);
  }

  // Test 1: Generate test hash
  log('\n🧪 Test 1: Generate Test Incident Hash', 'yellow');
  const crypto = require('crypto');
  const testIncidentData = {
    reporterId: 'test_user_123',
    type: 'missing_person',
    title: 'Test Incident',
    description: 'Test description for integration testing',
    location: 'Accra, Ghana',
    timestamp: new Date()
  };
  const testHash = crypto.createHash('sha256')
    .update(JSON.stringify(testIncidentData))
    .digest('hex');
  log(`   ✅ Hash generated: ${testHash.substring(0, 16)}...`, 'green');

  // Test 2: Submit to blockchain
  log('\n🧪 Test 2: Submit Incident Hash to Blockchain', 'yellow');
  try {
    const result = await BlockchainService.submitIncidentHash(testHash, 0);
    if (result && result.txDigest) {
      log(`   ✅ Transaction successful!`, 'green');
      log(`   📝 TX Digest: ${result.txDigest}`, 'cyan');
      log(`   📝 Record ID: ${result.recordId || 'Processing...'}`, 'cyan');
      log(`   🔍 View on Explorer: https://suiexplorer.com/txblock/${result.txDigest}?network=testnet`, 'cyan');
      
      if (result.recordId) {
        // Test 3: Query the record
        log('\n🧪 Test 3: Query Incident Record from Blockchain', 'yellow');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for blockchain to process
        const record = await BlockchainService.getIncidentRecord(result.recordId);
        if (record) {
          log(`   ✅ Record retrieved successfully!`, 'green');
          log(`   📋 Object ID: ${record.objectId}`, 'cyan');
        } else {
          log(`   ⚠️  Record not found yet (may need more time)`, 'yellow');
        }

        // Test 4: Update status
        log('\n🧪 Test 4: Update Incident Status (Verify)', 'yellow');
        const updateResult = await BlockchainService.updateIncidentStatus(result.recordId, 1, 'test_verifier');
        if (updateResult) {
          log(`   ✅ Status updated successfully!`, 'green');
          log(`   📝 TX Digest: ${updateResult}`, 'cyan');
          log(`   🔍 View on Explorer: https://suiexplorer.com/txblock/${updateResult}?network=testnet`, 'cyan');
        } else {
          log(`   ❌ Status update failed`, 'red');
        }
      } else {
        log(`   ⚠️  Record ID not returned (check server logs)`, 'yellow');
      }
    } else {
      log(`   ❌ Submission failed (check server logs)`, 'red');
    }
  } catch (error) {
    log(`   ❌ Error: ${error.message}`, 'red');
    if (error.stack) {
      log(`   Stack: ${error.stack}`, 'yellow');
    }
  }

  // Test 5: Verify transaction
  log('\n🧪 Test 5: Verify Transaction', 'yellow');
  const testTxId = '0x' + '0'.repeat(64); // Placeholder
  log(`   ⚠️  Skipped (need actual transaction ID)`, 'yellow');

  log('\n' + '='.repeat(60), 'blue');
  log('✅ Blockchain Service Tests Complete!', 'green');
  log('='.repeat(60) + '\n', 'blue');
}

// Run tests
(async () => {
  try {
    await testBlockchainService();
  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`, 'red');
    process.exit(1);
  }
})();

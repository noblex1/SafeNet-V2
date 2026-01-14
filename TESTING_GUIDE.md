# SafeNet Testing Guide

## 🧪 Comprehensive Integration Testing

This guide explains how to test the complete SafeNet backend and blockchain integration.

## ✅ Prerequisites

1. **Environment Configured** ✅
   - All variables validated with `node validate-env.js`
   - MongoDB connection string set
   - Sui blockchain credentials configured

2. **Code Compiled** ✅
   - TypeScript compiled: `npm run build`
   - No compilation errors

3. **Dependencies Installed** ✅
   - All npm packages installed
   - Sui SDK configured

## 🚀 Quick Start

### Option 1: Automated Test Runner (Recommended)

```bash
./run-tests.sh
```

This script will:
- ✅ Check if server is running
- ✅ Start server if needed
- ✅ Run integration tests
- ✅ Run blockchain tests
- ✅ Clean up test server

### Option 2: Manual Testing

**Step 1: Start the server**
```bash
npm run dev
```

**Step 2: In another terminal, run tests**
```bash
# Test API endpoints
node test-integration.js

# Test blockchain service directly
node test-blockchain.js
```

## 📋 Test Coverage

### Integration Tests (`test-integration.js`)

Tests the complete API workflow:

1. ✅ **Health Check** - Server is running
2. ✅ **User Registration** - Create test user
3. ✅ **User Login** - Authenticate user
4. ✅ **Get Current User** - Retrieve user profile
5. ✅ **Create Incident** - Submit missing person report
   - Tests blockchain hash generation
   - Tests database storage
   - Verifies blockchain submission (async)
6. ✅ **Get Incident** - Retrieve incident by ID
7. ✅ **List Incidents** - Get paginated incidents
8. ✅ **Get Verified Alerts** - Public endpoint
9. ✅ **Refresh Token** - Token refresh mechanism

### Blockchain Tests (`test-blockchain.js`)

Direct blockchain service testing:

1. ✅ **Configuration Check** - Verify .env variables
2. ✅ **Hash Generation** - Create test incident hash
3. ✅ **Submit to Blockchain** - Submit hash to Sui
4. ✅ **Query Record** - Get incident from blockchain
5. ✅ **Update Status** - Update incident status on-chain
6. ✅ **Transaction Verification** - Verify transactions exist

## 🎯 Test Data

The integration tests use mock data:

- **Test User**:
  - Email: `test_<timestamp>@safenet.test`
  - Password: `TestPass123`
  - Name: Test User
  - Phone: +233123456789

- **Test Incident**:
  - Type: Missing Person
  - Location: Accra Mall, Accra, Ghana
  - Description: Test incident for integration testing

## 📊 Expected Results

### Successful Test Run

```
🧪 SafeNet Backend + Blockchain Integration Test
============================================================
Testing against: http://localhost:3000/api
============================================================

[1/9] Health Check...
✅ Health Check
[2/9] Register User...
   ✓ User ID: 65a1b2c3d4e5f6g7h8i9j0k1
   ✓ Email: test_1234567890@safenet.test
✅ Register User
[3/9] Login User...
✅ Login User
...
✅ All tests passed!

🔗 Blockchain Integration Status:
   ✅ Transaction ID: 0x1234...
   ✅ Record ID: 0xabcd...
```

## 🔍 Troubleshooting

### Server Not Running

**Error**: `ECONNREFUSED`

**Solution**:
```bash
npm run dev
```

### MongoDB Connection Error

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**:
- Check MongoDB connection string in `.env`
- Verify MongoDB is accessible
- Check network/firewall settings

### Blockchain Submission Fails

**Error**: No blockchain transaction ID returned

**Possible Causes**:
1. Invalid private key format
2. Insufficient gas balance
3. Wrong network (testnet/mainnet mismatch)
4. Invalid package/registry IDs

**Solution**:
- Check Sui wallet balance: `sui client gas`
- Verify network: `sui client active-env`
- Check server logs for blockchain errors
- Verify package/registry IDs in `.env`

### Transaction Verification Fails

**Note**: Blockchain operations are asynchronous. The transaction might:
- Still be processing
- Require more time to confirm
- Check server logs for details

## 📝 Test Output

### Successful Integration Test

```
✅ Passed: 9
❌ Failed: 0
📈 Success Rate: 100.0%

🔗 Blockchain Integration Status:
   ✅ Transaction ID: 0x754fbJ2GLBDoAozp5iZVdhsNZ56AhgH1yjcjB61QBMup
   ✅ Record ID: 0x3b0e28ebac3caebdd010657d26d74902db981ab6ffb3ae993bb1f981015bcbf3
   🔍 View on Sui Explorer: https://suiexplorer.com/txblock/0x754fbJ2GLBDoAozp5iZVdhsNZ56AhgH1yjcjB61QBMup?network=testnet

🎉 All tests passed!
```

## 🔗 Verifying Blockchain Transactions

After tests complete, you can verify on Sui Explorer:

1. **Transaction Details**:
   ```
   https://suiexplorer.com/txblock/<TX_DIGEST>?network=testnet
   ```

2. **Package/Contract**:
   ```
   https://suiexplorer.com/object/0x08dc2a934117abd6446b3f06329c9a537f576c7df3a637395018cc37d9d7473c?network=testnet
   ```

3. **Registry Object**:
   ```
   https://suiexplorer.com/object/0x3b0e28ebac3caebdd010657d26d74902db981ab6ffb3ae993bb1f981015bcbf3?network=testnet
   ```

## 🎯 Next Steps After Testing

Once all tests pass:

1. ✅ Backend API is working
2. ✅ Database integration is functional
3. ✅ Blockchain integration is operational
4. ✅ Authentication/authorization works
5. ✅ Incident management flow is complete

**Ready for Frontend Development!** 🎉

## 📚 Additional Resources

- API Documentation: `README.md`
- API Examples: `API_EXAMPLES.md`
- Blockchain Integration: `BLOCKCHAIN_INTEGRATION.md`
- Deployment Info: `DEPLOYMENT_INFO.md`

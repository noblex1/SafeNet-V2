#!/bin/bash

# SafeNet Backend Test Script
echo "🧪 Testing SafeNet Backend..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating minimal .env for testing..."
    cat > .env << EOF
NODE_ENV=test
PORT=3000
MONGODB_URI=mongodb://localhost:27017/safenet_test
JWT_SECRET=test-secret-key-min-32-characters-long-for-testing
JWT_REFRESH_SECRET=test-refresh-secret-key-min-32-characters-long-for-testing
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BLOCKCHAIN_RPC_URL=https://fullnode.testnet.sui.io:443
BLOCKCHAIN_NETWORK=testnet
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
EOF
    echo "✅ Created .env file"
fi

echo "1️⃣  Checking TypeScript compilation..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    exit 1
fi

echo ""
echo "2️⃣  Checking if MongoDB is accessible..."
mongosh --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ MongoDB is accessible"
else
    echo "⚠️  MongoDB is not accessible (server may still work if MongoDB starts later)"
fi

echo ""
echo "3️⃣  Testing server startup (will timeout after 5 seconds)..."
timeout 5s npm run dev > /tmp/safenet-test.log 2>&1 &
SERVER_PID=$!
sleep 3

# Check if server process is still running
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server started successfully"
    kill $SERVER_PID 2>/dev/null
else
    echo "⚠️  Server may have failed to start (check logs)"
    cat /tmp/safenet-test.log
fi

echo ""
echo "4️⃣  Testing API endpoint (if server is running)..."
sleep 1
HEALTH_CHECK=$(curl -s http://localhost:3000/api/health 2>/dev/null)
if [ ! -z "$HEALTH_CHECK" ]; then
    echo "✅ Health check endpoint responded:"
    echo "$HEALTH_CHECK" | head -3
else
    echo "⚠️  Health check endpoint not accessible (server may not be running)"
fi

echo ""
echo "📋 Test Summary:"
echo "   - TypeScript: ✅ Compiled successfully"
echo "   - Server: Check logs above"
echo ""
echo "💡 To start the server: npm run dev"
echo "💡 Make sure MongoDB is running before starting the server"

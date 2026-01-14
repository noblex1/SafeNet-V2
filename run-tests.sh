#!/bin/bash

# Comprehensive Test Runner for SafeNet Backend + Blockchain

echo "🚀 SafeNet Integration Test Suite"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if server is running
echo -e "${CYAN}📡 Checking if server is running...${NC}"
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Server is running${NC}"
    SERVER_RUNNING=true
else
    echo -e "${YELLOW}⚠️  Server is not running${NC}"
    echo -e "${YELLOW}   Starting server in background...${NC}"
    npm run dev > /tmp/safenet-server.log 2>&1 &
    SERVER_PID=$!
    echo -e "${CYAN}   Waiting for server to start...${NC}"
    sleep 5
    
    # Check again
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Server started successfully${NC}"
        SERVER_RUNNING=true
    else
        echo -e "${RED}❌ Server failed to start${NC}"
        echo -e "${YELLOW}   Check logs: tail -f /tmp/safenet-server.log${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${CYAN}🧪 Running Integration Tests...${NC}"
echo ""

# Run integration tests
node test-integration.js
INTEGRATION_RESULT=$?

echo ""
echo -e "${CYAN}🔗 Testing Blockchain Service Directly...${NC}"
echo ""

# Run blockchain tests
node test-blockchain.js
BLOCKCHAIN_RESULT=$?

# Cleanup
if [ ! -z "$SERVER_PID" ]; then
    echo ""
    echo -e "${CYAN}🧹 Cleaning up...${NC}"
    kill $SERVER_PID 2>/dev/null
    echo -e "${GREEN}✅ Test server stopped${NC}"
fi

echo ""
echo "=================================="
echo -e "${CYAN}📊 Final Results:${NC}"
echo "=================================="

if [ $INTEGRATION_RESULT -eq 0 ] && [ $BLOCKCHAIN_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    [ $INTEGRATION_RESULT -ne 0 ] && echo -e "${RED}   - Integration tests failed${NC}"
    [ $BLOCKCHAIN_RESULT -ne 0 ] && echo -e "${RED}   - Blockchain tests failed${NC}"
    exit 1
fi

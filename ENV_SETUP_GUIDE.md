# Environment Variables Setup Guide

## ✅ Current Status

Your `.env` file has most variables configured correctly! However, you need to add the Sui blockchain configuration.

## ❌ Missing Variables

Add these to your `.env` file:

```bash
# Sui Blockchain Configuration
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
SUI_PACKAGE_ID=0x08dc2a934117abd6446b3f06329c9a537f576c7df3a637395018cc37d9d7473c
SUI_REGISTRY_ID=0x3b0e28ebac3caebdd010657d26d74902db981ab6ffb3ae993bb1f981015bcbf3
SUI_PRIVATE_KEY=your_private_key_here
```

## 🔑 Getting Your Sui Private Key

### Option 1: From Sui CLI (if you deployed the contract)

```bash
# List your addresses
sui client addresses

# Get private key for an address
sui client keytool export <address> --json
```

### Option 2: From Sui Wallet

1. Open Sui Wallet extension
2. Go to Settings → Export Private Key
3. Copy the private key (hex format)

### Option 3: Generate New Keypair (for testing)

```bash
# Generate new keypair
sui client new-address ed25519

# Export the private key
sui client keytool export <address> --json
```

## 📝 Complete .env Template

Here's a complete template with all required variables:

```bash
# Server Configuration
NODE_ENV=development
PORT=3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/safenet

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Sui Blockchain Configuration
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
SUI_PACKAGE_ID=0x08dc2a934117abd6446b3f06329c9a537f576c7df3a637395018cc37d9d7473c
SUI_REGISTRY_ID=0x3b0e28ebac3caebdd010657d26d74902db981ab6ffb3ae993bb1f981015bcbf3
SUI_PRIVATE_KEY=your_private_key_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=12
```

## 🔒 Security Notes

1. **Private Key Format**
   - Can be hex string (with or without `0x` prefix)
   - Can be base64 encoded
   - Must be 64 hex characters (32 bytes) for Ed25519

2. **Private Key Security**
   - ⚠️ **NEVER commit private keys to git**
   - Use environment variables or secure key management
   - Consider using a dedicated wallet for backend operations
   - For production, use a hardware wallet or key management service

3. **Network Selection**
   - `testnet` - For development and testing
   - `mainnet` - For production (change RPC URL too)
   - `devnet` - For experimental features

## ✅ Validation

After adding the variables, run:

```bash
node validate-env.js
```

This will verify all variables are correctly configured.

## 🚨 Important

- Replace `your_private_key_here` with your actual private key
- Ensure `SUI_PACKAGE_ID` matches your deployment: `0x08dc2a934117abd6446b3f06329c9a537f576c7df3a637395018cc37d9d7473c`
- Ensure `SUI_REGISTRY_ID` matches your deployment: `0x3b0e28ebac3caebdd010657d26d74902db981ab6ffb3ae993bb1f981015bcbf3`

## 📋 Quick Checklist

- [ ] Added `SUI_NETWORK=testnet`
- [ ] Added `SUI_RPC_URL` (or using default)
- [ ] Added `SUI_PACKAGE_ID` with correct value
- [ ] Added `SUI_REGISTRY_ID` with correct value
- [ ] Added `SUI_PRIVATE_KEY` with your actual private key
- [ ] Verified with `node validate-env.js`
- [ ] Ensured `.env` is in `.gitignore`

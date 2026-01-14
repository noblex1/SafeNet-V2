# Your .env File - What's Missing

## ✅ What You Have (Good!)

- ✅ Server configuration (NODE_ENV, PORT)
- ✅ MongoDB connection
- ✅ JWT secrets (properly configured)
- ✅ Rate limiting
- ✅ Security settings
- ✅ Old blockchain variables (BLOCKCHAIN_RPC_URL, BLOCKCHAIN_NETWORK)

## ❌ What's Missing (Required for Sui Integration)

You need to add these **Sui-specific** variables to your `.env`:

```bash
# Sui Blockchain Configuration (add these lines)
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
SUI_PACKAGE_ID=0x08dc2a934117abd6446b3f06329c9a537f576c7df3a637395018cc37d9d7473c
SUI_REGISTRY_ID=0x3b0e28ebac3caebdd010657d26d74902db981ab6ffb3ae993bb1f981015bcbf3
SUI_PRIVATE_KEY=your_private_key_here
```

## 📝 Complete Updated .env

Here's your complete `.env` with the missing variables added:

```bash
NODE_ENV=test
PORT=3000
MONGODB_URI=mongodb+srv://safenetdb:Safe@000@safenet.x1onqrd.mongodb.net/
JWT_SECRET=M2MAazuwk3CRG@fxE*QWrxvQAN%&TpTH
JWT_REFRESH_SECRET=Wt7wFfS5Kh9qXLPZE9dqa@KYYPHyq&b&
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BLOCKCHAIN_RPC_URL=https://fullnode.testnet.sui.io:443
BLOCKCHAIN_NETWORK=testnet
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12

# Sui Blockchain Configuration (ADD THESE)
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
SUI_PACKAGE_ID=0x08dc2a934117abd6446b3f06329c9a537f576c7df3a637395018cc37d9d7473c
SUI_REGISTRY_ID=0x3b0e28ebac3caebdd010657d26d74902db981ab6ffb3ae993bb1f981015bcbf3
SUI_PRIVATE_KEY=your_private_key_here
```

## 🔑 Getting Your Private Key

If you deployed the contract, you can get your private key:

```bash
# List your addresses
sui client addresses

# Export private key for an address
sui client keytool export <your_address> --json
```

The private key will be in the output. Copy it and replace `your_private_key_here`.

## ⚠️ Important Notes

1. **Private Key Format**: Can be hex (with or without 0x) or base64
2. **Security**: Never commit your private key to git
3. **Package/Registry IDs**: These are from your deployment - they're correct above

## ✅ After Adding Variables

Run validation:
```bash
node validate-env.js
```

You should see all green checkmarks! ✅

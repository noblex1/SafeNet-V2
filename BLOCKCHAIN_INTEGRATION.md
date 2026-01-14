# SafeNet Backend - Sui Blockchain Integration

## ✅ Integration Complete

The backend `BlockchainService` has been updated with full Sui SDK integration.

## 📦 Dependencies Installed

- `@mysten/sui` - Sui TypeScript SDK (v1.0.0+)

## 🔧 Configuration Required

Add these environment variables to your `.env` file:

```bash
# Sui Network Configuration
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Contract Addresses (from deployment)
SUI_PACKAGE_ID=0x08dc2a934117abd6446b3f06329c9a537f576c7df3a637395018cc37d9d7473c
SUI_REGISTRY_ID=0x3b0e28ebac3caebdd010657d26d74902db981ab6ffb3ae993bb1f981015bcbf3

# Wallet Private Key (keep secure!)
# Format: hex string (with or without 0x prefix) or base64
SUI_PRIVATE_KEY=your_private_key_here
```

## 🔄 Updated Components

### 1. BlockchainService (`src/services/blockchainService.ts`)

**Fully implemented with Sui SDK:**

- ✅ `submitIncidentHash()` - Submits incident hash to blockchain
  - Returns: `{ txDigest: string, recordId: string }`
  - Stores IncidentRecord object ID for future updates

- ✅ `updateIncidentStatus()` - Updates incident status on-chain
  - Uses stored IncidentRecord object ID
  - Validates status transitions

- ✅ `getIncidentRecord()` - Queries incident data from blockchain

- ✅ `verifyTransaction()` - Verifies transaction exists

- ✅ `getTransactionDetails()` - Gets full transaction details

### 2. Incident Model (`src/models/Incident.ts`)

**Added field:**
- `blockchainRecordId` - Stores Sui IncidentRecord object ID

### 3. Incident Service (`src/services/incidentService.ts`)

**Updated to:**
- Store `blockchainRecordId` when submitting incidents
- Use `blockchainRecordId` for status updates (instead of hash)

## 🔐 Security Notes

1. **Private Key Storage**
   - Never commit `SUI_PRIVATE_KEY` to git
   - Use environment variables or secure key management
   - Consider using a dedicated wallet for the backend

2. **Error Handling**
   - Blockchain failures don't break the API
   - All blockchain operations are async and non-blocking
   - Errors are logged but don't throw exceptions

3. **Network Configuration**
   - Currently configured for testnet
   - Change `SUI_NETWORK` and `SUI_RPC_URL` for mainnet

## 📝 Usage Examples

### Submitting an Incident

When an incident is created, the backend automatically:
1. Generates SHA256 hash
2. Submits hash to Sui blockchain
3. Stores transaction digest and record ID
4. Continues without blocking the API response

### Updating Status

When an admin verifies an incident:
1. Backend updates database status
2. Asynchronously updates blockchain status
3. Stores new transaction digest

### Querying Blockchain

```typescript
// Get incident record from blockchain
const record = await BlockchainService.getIncidentRecord(incidentRecordId);

// Verify transaction
const isValid = await BlockchainService.verifyTransaction(txDigest);

// Get transaction details
const details = await BlockchainService.getTransactionDetails(txDigest);
```

## 🧪 Testing

### 1. Test Blockchain Connection

```typescript
// In your test or initialization code
const client = new SuiClient({ url: getFullnodeUrl('testnet') });
const chainId = await client.getChainIdentifier();
console.log('Connected to chain:', chainId);
```

### 2. Test Incident Submission

1. Create an incident via API
2. Check logs for blockchain submission
3. Verify transaction on Sui Explorer
4. Check database for `blockchainRecordId`

### 3. Test Status Update

1. Verify an incident via API
2. Check logs for blockchain update
3. Verify transaction on Sui Explorer
4. Query blockchain to confirm status change

## 🐛 Troubleshooting

### Error: "Sui client or keypair not initialized"
- Check `SUI_PRIVATE_KEY` is set in `.env`
- Verify private key format (hex or base64)

### Error: "SUI_PACKAGE_ID or SUI_REGISTRY_ID not configured"
- Add deployment IDs to `.env`
- See `DEPLOYMENT_INFO.md` for correct IDs

### Error: "Invalid hash length"
- Ensure hash is 64 hex characters (32 bytes)
- Check hash generation in `crypto.ts`

### Transaction Fails
- Check gas balance in wallet
- Verify network (testnet/mainnet) matches
- Check contract function signatures

## 📊 Monitoring

### Logs to Watch

- `Submitting incident hash to blockchain` - Submission started
- `Incident hash submitted to blockchain successfully` - Success
- `Failed to submit incident hash to blockchain` - Error
- `Updating incident status on blockchain` - Status update started
- `Incident status updated on blockchain successfully` - Success

### Metrics to Track

- Blockchain submission success rate
- Average transaction time
- Gas costs per transaction
- Failed transaction count

## 🚀 Next Steps

1. **Set Environment Variables**
   - Copy IDs from `DEPLOYMENT_INFO.md`
   - Add `SUI_PRIVATE_KEY` securely

2. **Test Integration**
   - Create test incident
   - Verify blockchain submission
   - Test status updates

3. **Monitor Performance**
   - Watch logs for errors
   - Track transaction success rates
   - Monitor gas costs

4. **Production Deployment**
   - Use mainnet RPC URL
   - Secure private key storage
   - Set up monitoring/alerts

## ✅ Integration Status

- [x] Sui SDK installed
- [x] BlockchainService updated
- [x] Incident model updated
- [x] IncidentService updated
- [x] Error handling implemented
- [x] Logging configured
- [ ] Environment variables configured (user action required)
- [ ] Private key configured (user action required)
- [ ] Testing completed (user action required)

## 📚 References

- Sui SDK Documentation: https://sdk.mystenlabs.com
- Deployment Info: `DEPLOYMENT_INFO.md`
- Contract Examples: `smart-contracts/EXAMPLES.md`

---

**Status**: ✅ **Integration Complete - Ready for Configuration**

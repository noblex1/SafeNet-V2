# How to Check Verified Reports on Blockchain

This guide shows you multiple ways to view and verify incidents on the Sui blockchain.

## Method 1: Web Dashboard (Easiest)

### Steps:
1. Start the web dashboard:
   ```bash
   cd web
   npm run dev
   ```

2. Login with admin credentials:
   - Email: `admin@safenet.app`
   - Password: `Admin123!`

3. Navigate to **"Blockchain Log"** in the navigation menu

4. View all incidents with blockchain data:
   - Transaction IDs
   - Record IDs
   - Incident hashes
   - Status information

## Method 2: Command Line Script

### Check All Blockchain Records

```bash
npm run check-blockchain
```

This script will:
- List all incidents with blockchain data
- Verify each transaction on the blockchain
- Show on-chain status and details
- Display a summary of verified/resolved incidents

### View Specific Transaction

```bash
npm run view-tx <transaction_id>
```

Example:
```bash
npm run view-tx 0x1234567890abcdef...
```

## Method 3: Sui Explorer (Web Interface)

### Steps:

1. **Get Transaction ID** from:
   - Web dashboard (Blockchain Log page)
   - Database (incident.blockchainTxId)
   - Or run: `npm run check-blockchain`

2. **Open Sui Explorer:**
   - Testnet: https://suiexplorer.com/?network=testnet
   - Mainnet: https://suiexplorer.com/?network=mainnet

3. **Paste Transaction ID** in the search box

4. **View Transaction Details:**
   - Transaction status
   - Gas used
   - Events emitted
   - Object changes
   - Timestamp

### View Incident Record Object

If you have the `blockchainRecordId`:

1. Go to Sui Explorer
2. Paste the Record ID (object ID)
3. View the IncidentRecord object:
   - Incident hash
   - Current status
   - Verifier address
   - Timestamps

## Method 4: Direct API/Code Query

### Using BlockchainService

```typescript
import { BlockchainService } from './src/services/blockchainService';

// Get incident record from blockchain
const record = await BlockchainService.getIncidentRecord(incidentRecordId);
console.log(record);

// Verify transaction
const isValid = await BlockchainService.verifyTransaction(txDigest);
console.log('Valid:', isValid);

// Get transaction details
const details = await BlockchainService.getTransactionDetails(txDigest);
console.log(details);
```

## Method 5: Database Query

### Find Verified Incidents with Blockchain Data

```javascript
// In MongoDB shell or via script
db.incidents.find({
  status: 1, // Verified
  blockchainRecordId: { $exists: true, $ne: null }
})
```

### Get All Blockchain Transactions

```javascript
db.incidents.find({
  blockchainTxId: { $exists: true, $ne: null }
}, {
  title: 1,
  status: 1,
  blockchainTxId: 1,
  blockchainRecordId: 1,
  incidentHash: 1,
  verifiedAt: 1
})
```

## What You Can Verify

### On Blockchain:
- ✅ **Incident Hash**: SHA256 hash of incident data
- ✅ **Status**: Current verification status (0-3)
- ✅ **Verifier**: Address that verified the incident
- ✅ **Timestamps**: When submitted and last updated
- ✅ **Transaction History**: All status updates

### In Database:
- ✅ **Full Incident Details**: Title, description, location
- ✅ **Reporter Information**: Name, email, phone
- ✅ **Verification Notes**: Admin notes
- ✅ **Metadata**: Additional incident data

## Example Workflow

1. **Find Verified Incident:**
   ```bash
   npm run check-blockchain
   ```

2. **Get Transaction ID** from output

3. **View on Sui Explorer:**
   - Copy transaction ID
   - Paste in Sui Explorer
   - Verify transaction exists and is valid

4. **Verify Hash Matches:**
   - Compare database hash with blockchain hash
   - Ensure they match (data integrity)

5. **Check Status:**
   - Verify on-chain status matches database status
   - Check timestamps are consistent

## Quick Commands Reference

```bash
# Check all blockchain records
npm run check-blockchain

# View specific transaction
npm run view-tx <transaction_id>

# Create admin user
npm run create-admin
```

## Sui Explorer URLs

- **Testnet Explorer**: https://suiexplorer.com/?network=testnet
- **Mainnet Explorer**: https://suiexplorer.com/?network=mainnet
- **Devnet Explorer**: https://suiexplorer.com/?network=devnet

## Understanding Blockchain Data

### Transaction ID (blockchainTxId)
- Unique identifier for the blockchain transaction
- Can be viewed on Sui Explorer
- Proves the transaction was submitted

### Record ID (blockchainRecordId)
- Object ID of the IncidentRecord on-chain
- Used to query the actual incident data
- Contains hash, status, timestamps

### Incident Hash (incidentHash)
- SHA256 hash of incident data
- Stored on-chain for verification
- Can verify data integrity

## Troubleshooting

### "Transaction not found"
- Check network (testnet vs mainnet)
- Verify transaction ID is correct
- Transaction might be on different network

### "Record not found"
- Record ID might be incorrect
- Object might have been deleted (unlikely)
- Check network configuration

### "Sui client not initialized"
- Check `.env` file has `SUI_RPC_URL`
- Verify `SUI_PRIVATE_KEY` is set
- Ensure network configuration is correct

## Security Notes

- Blockchain only stores hashes, not personal data
- All sensitive data remains in the database
- Blockchain provides immutable audit trail
- Transactions are publicly verifiable

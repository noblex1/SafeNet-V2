# SafeNet Smart Contract - Example Transactions

## Prerequisites

Before running these examples, ensure:
1. Sui CLI is installed and configured
2. You have a wallet with testnet tokens
3. Contract is deployed (get the package ID)

## Example 1: Submit an Incident

### Step 1: Generate Incident Hash (Backend)

The backend generates a SHA256 hash from incident data:

```javascript
// Backend code (Node.js)
const crypto = require('crypto');

const incidentData = {
  reporterId: "user123",
  type: "missing_person",
  title: "Missing Child",
  description: "Last seen at Accra Mall...",
  location: "Accra Mall, Accra, Ghana",
  timestamp: new Date()
};

const hashString = JSON.stringify(incidentData);
const hash = crypto.createHash('sha256').update(hashString).digest('hex');
// hash = "a1b2c3d4e5f6..." (64 hex characters)

// Convert to bytes for Sui
const hashBytes = Buffer.from(hash, 'hex');
// hashBytes = [161, 178, 195, ...] (32 bytes)
```

### Step 2: Submit to Blockchain

```bash
# Using Sui CLI
sui client call \
  --package <PACKAGE_ID> \
  --module incident_registry \
  --function submit_incident \
  --args <REGISTRY_OBJECT_ID> <HASH_BYTES> \
  --gas-budget 10000000
```

### Step 3: Get Transaction Result

```bash
# Get transaction details
sui client transaction <TX_DIGEST>

# Extract IncidentRecord object ID from the response
# Store this in your backend database
```

## Example 2: Update Incident Status (Verify)

### Step 1: Get IncidentRecord Object ID

From the previous transaction, you should have stored the `IncidentRecord` object ID.

### Step 2: Update Status to Verified

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module incident_registry \
  --function update_status \
  --args <REGISTRY_OBJECT_ID> <INCIDENT_RECORD_OBJECT_ID> 1 \
  --gas-budget 10000000
```

Status values:
- `1` = Verified
- `2` = False
- `3` = Resolved

## Example 3: Query Incident Status

### Using Sui CLI

```bash
# Get object details
sui client object <INCIDENT_RECORD_OBJECT_ID>

# The response will show:
# - incident_hash
# - status
# - verifier
# - submitted_at
# - updated_at
# - version
```

### Using Sui SDK (TypeScript/JavaScript)

```typescript
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

// Get incident record
const incidentRecord = await client.getObject({
  id: '<INCIDENT_RECORD_OBJECT_ID>',
  options: {
    showContent: true,
  },
});

// Parse the data
const data = incidentRecord.data?.content as any;
console.log('Status:', data.fields.status);
console.log('Hash:', data.fields.incident_hash);
console.log('Verifier:', data.fields.verifier);
```

## Example 4: Listen to Events

### Using Sui SDK

```typescript
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

// Subscribe to IncidentSubmitted events
const unsubscribe = await client.subscribeEvent({
  filter: {
    Package: '<PACKAGE_ID>',
  },
  onMessage: (event) => {
    if (event.type.includes('IncidentSubmitted')) {
      console.log('New incident submitted:', event.parsedJson);
    }
    if (event.type.includes('IncidentStatusUpdated')) {
      console.log('Status updated:', event.parsedJson);
    }
  },
});

// Later, unsubscribe
await unsubscribe();
```

## Example 5: Complete Workflow (Backend Integration)

### Backend Service Implementation

```typescript
// src/services/blockchainService.ts (updated)

import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { IncidentStatus } from '../types';

export class BlockchainService {
  private client: SuiClient;
  private keypair: Ed25519Keypair;
  private packageId: string;
  private registryId: string;

  constructor() {
    this.client = new SuiClient({ 
      url: getFullnodeUrl(process.env.BLOCKCHAIN_NETWORK || 'testnet') 
    });
    
    // Load keypair from environment
    const privateKey = process.env.SUI_PRIVATE_KEY!;
    this.keypair = Ed25519Keypair.fromSecretKey(privateKey);
    
    this.packageId = process.env.SUI_PACKAGE_ID!;
    this.registryId = process.env.SUI_REGISTRY_ID!;
  }

  async submitIncidentHash(
    incidentHash: string, // Hex string (64 chars)
    status: IncidentStatus
  ): Promise<string | null> {
    try {
      // Convert hex string to bytes
      const hashBytes = Buffer.from(incidentHash, 'hex');
      
      // Create transaction
      const txb = new TransactionBlock();
      
      txb.moveCall({
        target: `${this.packageId}::incident_registry::submit_incident`,
        arguments: [
          txb.object(this.registryId),
          txb.pure(hashBytes),
        ],
      });
      
      // Sign and execute
      const result = await this.client.signAndExecuteTransactionBlock({
        signer: this.keypair,
        transactionBlock: txb,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });
      
      // Extract IncidentRecord object ID from events
      const event = result.events?.find(e => 
        e.type.includes('IncidentSubmitted')
      );
      
      // Store object ID in database for future updates
      // ...
      
      return result.digest;
    } catch (error) {
      console.error('Failed to submit to blockchain:', error);
      return null;
    }
  }

  async updateIncidentStatus(
    incidentRecordId: string,
    status: IncidentStatus,
    verifierAddress: string
  ): Promise<string | null> {
    try {
      if (status === IncidentStatus.PENDING) {
        return null; // Can't set to pending
      }
      
      const txb = new TransactionBlock();
      
      txb.moveCall({
        target: `${this.packageId}::incident_registry::update_status`,
        arguments: [
          txb.object(this.registryId),
          txb.object(incidentRecordId),
          txb.pure(status),
        ],
      });
      
      const result = await this.client.signAndExecuteTransactionBlock({
        signer: this.keypair,
        transactionBlock: txb,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });
      
      return result.digest;
    } catch (error) {
      console.error('Failed to update blockchain status:', error);
      return null;
    }
  }

  async getIncidentStatus(incidentRecordId: string): Promise<any> {
    try {
      const object = await this.client.getObject({
        id: incidentRecordId,
        options: {
          showContent: true,
        },
      });
      
      return object.data?.content;
    } catch (error) {
      console.error('Failed to get incident status:', error);
      return null;
    }
  }
}
```

## Example 6: Testing with Sui CLI

### 1. Build the contract

```bash
cd /home/phantomx/Videos/SafeNet
sui move build
```

### 2. Run tests

```bash
sui move test
```

### 3. Deploy to testnet

```bash
sui client publish --gas-budget 100000000
```

### 4. Set environment variables

After deployment, note the:
- Package ID
- Registry Object ID

```bash
export SUI_PACKAGE_ID="0x..."
export SUI_REGISTRY_ID="0x..."
```

### 5. Submit test incident

```bash
# Convert hash to bytes format
# Hash: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"
# Bytes: [0xa1, 0xb2, 0xc3, ...]

sui client call \
  --package $SUI_PACKAGE_ID \
  --module incident_registry \
  --function submit_incident \
  --args $SUI_REGISTRY_ID "[0xa1,0xb2,0xc3,0xd4,0xe5,0xf6,0x78,0x90,0x12,0x34,0x56,0x78,0x90,0x12,0x34,0x56,0x78,0x90,0xab,0xcd,0xef,0x12,0x34,0x56,0x78,0x90,0xab,0xcd,0xef,0x12,0x34,0x56]" \
  --gas-budget 10000000
```

### 6. Verify incident

```bash
# Get the IncidentRecord object ID from previous transaction
sui client call \
  --package $SUI_PACKAGE_ID \
  --module incident_registry \
  --function update_status \
  --args $SUI_REGISTRY_ID <INCIDENT_RECORD_ID> 1 \
  --gas-budget 10000000
```

## Troubleshooting

### Error: Object not found
- Ensure the object ID is correct
- Check that the object exists on the network you're using

### Error: Invalid status transition
- Check the current status of the incident
- Ensure you're following valid transition rules

### Error: Hash length invalid
- Ensure hash is exactly 32 bytes (64 hex characters)
- Convert hex string to bytes properly

### Error: Insufficient gas
- Increase gas budget: `--gas-budget 100000000`

## Next Steps

1. Integrate with backend `BlockchainService`
2. Store object IDs in database
3. Set up event listeners
4. Test on testnet thoroughly
5. Deploy to mainnet when ready

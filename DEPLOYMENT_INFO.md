# SafeNet Smart Contract - Deployment Information

## ✅ Deployment Status: SUCCESS

**Transaction Digest**: `754fbJ2GLBDoAozp5iZVdhsNZ56AhgH1yjcjB61QBMup`  
**Network**: Sui Testnet  
**Deployment Date**: Successfully deployed  
**Status**: ✅ Live and operational

## 📋 Critical IDs for Backend Integration

### Package ID (Contract Address)
```
0x08dc2a934117abd6446b3f06329c9a537f576c7df3a637395018cc37d9d7473c
```

**Usage**: This is the main contract address. Use this in all function calls.

### IncidentRegistry Object ID (Shared Object)
```
0x3b0e28ebac3caebdd010657d26d74902db981ab6ffb3ae993bb1f981015bcbf3
```

**Usage**: This is the shared registry object. Required as first parameter in all contract calls.

### UpgradeCap Object ID
```
0x183ea2f0792ccf6a6996a6d216447f1ba9b50d60f7eada4205271b16442c2b47
```

**Usage**: Keep this secure! Needed for future contract upgrades.

## 🔧 Backend Configuration

Add these to your `.env` file:

```bash
# Sui Blockchain Configuration
SUI_NETWORK=testnet
SUI_PACKAGE_ID=0x08dc2a934117abd6446b3f06329c9a537f576c7df3a637395018cc37d9d7473c
SUI_REGISTRY_ID=0x3b0e28ebac3caebdd010657d26d74902db981ab6ffb3ae993bb1f981015bcbf3
SUI_UPGRADE_CAP_ID=0x183ea2f0792ccf6a6996a6d216447f1ba9b50d60f7eada4205271b16442c2b47

# Sui RPC URL (testnet)
SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Your wallet private key (keep secure!)
SUI_PRIVATE_KEY=your_private_key_here
```

## 📝 Contract Functions

### Submit Incident
```typescript
// Function: submit_incident
// Package: 0x08dc2a934117abd6446b3f06329c9a537f576c7df3a637395018cc37d9d7473c
// Module: incident_registry
// Parameters:
//   - registry: 0x3b0e28ebac3caebdd010657d26d74902db981ab6ffb3ae993bb1f981015bcbf3
//   - incident_hash: vector<u8> (32 bytes)
```

### Update Status
```typescript
// Function: update_status
// Package: 0x08dc2a934117abd6446b3f06329c9a537f576c7df3a637395018cc37d9d7473c
// Module: incident_registry
// Parameters:
//   - registry: 0x3b0e28ebac3caebdd010657d26d74902db981ab6ffb3ae993bb1f981015bcbf3
//   - incident: IncidentRecord object ID
//   - new_status: u8 (1=Verified, 2=False, 3=Resolved)
```

## 🔗 View on Sui Explorer

**Transaction**: https://suiexplorer.com/txblock/754fbJ2GLBDoAozp5iZVdhsNZ56AhgH1yjcjB61QBMup?network=testnet

**Package**: https://suiexplorer.com/object/0x08dc2a934117abd6446b3f06329c9a537f576c7df3a637395018cc37d9d7473c?network=testnet

**Registry**: https://suiexplorer.com/object/0x3b0e28ebac3caebdd010657d26d74902db981ab6ffb3ae993bb1f981015bcbf3?network=testnet

## 💰 Gas Costs

- **Storage Cost**: 21,918,400 MIST
- **Computation Cost**: 1,000,000 MIST
- **Storage Rebate**: 978,120 MIST
- **Total Cost**: ~21.94 SUI (testnet)

## ✅ Next Steps

1. **Update Backend Environment Variables**
   - Add the IDs above to your `.env` file
   - Configure Sui SDK in `BlockchainService`

2. **Test Contract Interaction**
   ```bash
   # Test submitting an incident
   sui client call \
     --package 0x08dc2a934117abd6446b3f06329c9a537f576c7df3a637395018cc37d9d7473c \
     --module incident_registry \
     --function submit_incident \
     --args 0x3b0e28ebac3caebdd010657d26d74902db981ab6ffb3ae993bb1f981015bcbf3 <HASH_BYTES> \
     --gas-budget 10000000
   ```

3. **Integrate with Backend**
   - Update `src/services/blockchainService.ts`
   - Use Sui SDK to interact with contract
   - Test end-to-end workflow

4. **Monitor Events**
   - Set up event listeners for `IncidentSubmitted`
   - Set up event listeners for `IncidentStatusUpdated`

## 🔒 Security Notes

- ⚠️ **Keep UpgradeCap secure** - Only you can upgrade the contract
- ⚠️ **Protect private key** - Never commit to git
- ⚠️ **Test thoroughly** - Test all functions before production use
- ⚠️ **Monitor gas costs** - Optimize if needed

## 📊 Contract Statistics

- **Modules**: 1 (incident_registry)
- **Functions**: 2 entry functions, 9 view functions
- **Events**: 2 (IncidentSubmitted, IncidentStatusUpdated)
- **Status**: ✅ Deployed and operational

## 🎉 Deployment Complete!

Your SafeNet Incident Registry is now live on Sui testnet and ready for integration!

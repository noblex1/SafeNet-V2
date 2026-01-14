# SafeNet Incident Registry - Contract Explanation

## Overview

The SafeNet Incident Registry is a Sui Move smart contract designed to provide an **immutable, on-chain audit trail** for incident verification. It follows a privacy-by-design approach, storing **only cryptographic hashes and verification metadata** - no personal data.

## Design Philosophy

### Privacy First
- ✅ Stores only SHA256 hashes (32 bytes)
- ✅ No personal information on-chain
- ✅ No incident descriptions
- ✅ No location coordinates
- ✅ No reporter details

### Immutability
- ✅ Once submitted, incident hash is permanently recorded
- ✅ Status changes are tracked with timestamps
- ✅ Version numbers track all updates
- ✅ Events provide complete audit trail

### Security
- ✅ Status transition validation prevents invalid changes
- ✅ Final states (False, Resolved) cannot be modified
- ✅ Only valid status values accepted (0-3)

## Contract Workflow

### 1. Incident Submission

```
Backend → Generate SHA256 Hash → Submit to Blockchain
                                    ↓
                            IncidentRecord Created
                                    ↓
                            Event Emitted
                                    ↓
                            Object ID Returned
```

**What happens:**
- Backend generates hash from incident data
- Calls `submit_incident` with 32-byte hash
- Contract creates `IncidentRecord` object
- Object is owned by the submitter
- Event `IncidentSubmitted` is emitted
- Backend stores object ID for future updates

### 2. Status Verification

```
Admin Verifies → Backend Updates Status → Blockchain Update
                                          ↓
                                    Status Changed
                                          ↓
                                    Event Emitted
                                          ↓
                                    Version Incremented
```

**What happens:**
- Admin verifies incident in backend
- Backend calls `update_status` with new status (1, 2, or 3)
- Contract validates transition is allowed
- Updates status, verifier, timestamp, version
- Event `IncidentStatusUpdated` is emitted

### 3. Status Resolution

```
Incident Resolved → Backend Updates Status → Final State
                                            ↓
                                    Status = Resolved (3)
                                            ↓
                                    No Further Changes
```

**What happens:**
- Incident is resolved
- Backend calls `update_status` with status=3
- Contract sets final state
- No further modifications allowed

## Data Structures Explained

### IncidentRecord (Owned Object)

Each incident gets its own owned object that can be transferred:

```move
struct IncidentRecord {
    id: UID,                    // Unique object identifier
    incident_hash: vector<u8>,  // SHA256 hash (32 bytes)
    status: u8,                  // 0-3 (Pending, Verified, False, Resolved)
    verifier: Option<address>,  // Who verified it (if verified)
    submitted_at: u64,          // Submission timestamp (ms)
    updated_at: u64,            // Last update timestamp (ms)
    version: u64,                // Version number (increments on each update)
}
```

**Why owned?**
- Allows transfer of ownership if needed
- Enables direct updates by owner
- Provides clear ownership model

### IncidentRegistry (Shared Object)

The registry is a shared object accessible by all:

```move
struct IncidentRegistry {
    id: UID,
    incidents: Table<vector<u8>, ID>,  // Hash → IncidentRecord ID mapping
    total_incidents: u64,               // Total count
}
```

**Why shared?**
- Accessible by all users
- No ownership required to query
- Centralized registry

## Status Transition Logic

The contract enforces strict status transition rules:

### Valid Transitions

```
Pending (0) ──→ Verified (1)     ✅ Initial verification
Pending (0) ──→ False (2)         ✅ Marked as false alarm
Pending (0) ──→ Resolved (3)       ✅ Directly resolved
Verified (1) ──→ Resolved (3)      ✅ Verified then resolved
```

### Invalid Transitions

```
❌ Any → Pending (0)              Can't go backwards
❌ False (2) → Any                Final state
❌ Resolved (3) → Any              Final state
❌ Verified (1) → False (2)        Must go through Resolved
❌ Verified (1) → Verified (1)     No self-transitions
```

### Implementation

```move
fun is_valid_transition(old_status: u8, new_status: u8): bool {
    // Can't set to Pending
    if (new_status == STATUS_PENDING) return false;
    
    // From Pending, can go to Verified, False, or Resolved
    if (old_status == STATUS_PENDING) {
        return new_status == STATUS_VERIFIED || 
               new_status == STATUS_FALSE || 
               new_status == STATUS_RESOLVED
    };
    
    // From Verified, can only go to Resolved
    if (old_status == STATUS_VERIFIED) {
        return new_status == STATUS_RESOLVED
    };
    
    // From False or Resolved, no transitions (final states)
    false
}
```

## Events for Audit Trail

### IncidentSubmitted Event

Emitted when a new incident is registered:

```move
struct IncidentSubmitted {
    incident_hash: vector<u8>,  // The hash that was submitted
    submitted_by: address,        // Who submitted it
    timestamp: u64,               // When it was submitted
}
```

**Use cases:**
- Track all submissions
- Monitor registry activity
- Build analytics dashboards

### IncidentStatusUpdated Event

Emitted when status changes:

```move
struct IncidentStatusUpdated {
    incident_hash: vector<u8>,  // Which incident
    old_status: u8,              // Previous status
    new_status: u8,              // New status
    verifier: address,            // Who made the change
    timestamp: u64,               // When it changed
}
```

**Use cases:**
- Track verification workflow
- Audit who verified what
- Monitor status changes over time

## Integration Points

### Backend Integration

The backend's `BlockchainService` integrates with this contract:

1. **Hash Generation**
   ```typescript
   const hash = crypto.createHash('sha256')
     .update(JSON.stringify(incidentData))
     .digest('hex');
   ```

2. **Submission**
   ```typescript
   const hashBytes = Buffer.from(hash, 'hex');
   await submitIncident(hashBytes);
   ```

3. **Status Updates**
   ```typescript
   await updateStatus(incidentRecordId, newStatus);
   ```

4. **Querying**
   ```typescript
   const status = await getIncidentStatus(incidentRecordId);
   ```

## Security Considerations

### On-Chain Security
- ✅ Input validation (hash length, status values)
- ✅ Transition validation (prevents invalid changes)
- ✅ Type safety (Move's type system)
- ✅ Ownership checks (only owner can update)

### Off-Chain Security
- ⚠️ Backend must validate data before hashing
- ⚠️ Backend must store object IDs securely
- ⚠️ Backend must handle blockchain failures gracefully
- ⚠️ Backend must verify on-chain status matches database

## Gas Optimization

The contract is optimized for:
- Minimal storage (only 32-byte hashes)
- Efficient lookups (Table structure)
- Event-based queries (no storage reads needed)
- Batch operations (can submit multiple incidents)

## Future Enhancements

Potential additions (not in current scope):
- Multi-signature verification
- Time-based expiration
- Batch status updates
- Query by verifier address
- Statistics aggregation

## Testing Strategy

1. **Unit Tests**: Test each function in isolation
2. **Integration Tests**: Test full workflows
3. **Edge Cases**: Test invalid inputs, transitions
4. **Gas Tests**: Measure gas costs
5. **Load Tests**: Test with many incidents

## Deployment Checklist

- [ ] Build contract: `sui move build`
- [ ] Run tests: `sui move test`
- [ ] Deploy to testnet
- [ ] Verify deployment
- [ ] Test all functions
- [ ] Update backend with package/registry IDs
- [ ] Deploy to mainnet (when ready)
- [ ] Monitor events and transactions

## Conclusion

The SafeNet Incident Registry provides a **secure, private, and immutable** way to track incident verification on the Sui blockchain. By storing only hashes and metadata, it maintains privacy while providing the transparency and auditability needed for public safety applications.

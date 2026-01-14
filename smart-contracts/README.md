# SafeNet Smart Contracts - Sui Move

## Overview

The SafeNet Incident Registry is a Sui Move smart contract that provides an immutable, on-chain registry for incident verification. It stores only cryptographic hashes and verification metadata - **no personal data is stored on-chain**.

## Contract Architecture

### Data Structures

#### `IncidentRecord`
An owned object that stores a single incident's verification data:
- `incident_hash`: SHA256 hash (32 bytes) of the incident data
- `status`: Current verification status (0-3)
- `verifier`: Address of the verifier (if verified)
- `submitted_at`: Timestamp when incident was submitted
- `updated_at`: Timestamp when status was last updated
- `version`: Version number for tracking updates

#### `IncidentRegistry`
A shared object that maintains the registry:
- `incidents`: Table mapping incident hash to IncidentRecord ID
- `total_incidents`: Total count of registered incidents

### Status Enum

Matches the backend enum exactly:
- `0` = Pending (initial state)
- `1` = Verified
- `2` = False (false alarm)
- `3` = Resolved

### Status Transition Rules

The contract enforces valid status transitions:

```
Pending (0) → Verified (1) ✅
Pending (0) → False (2) ✅
Pending (0) → Resolved (3) ✅
Verified (1) → Resolved (3) ✅
False (2) → [No transitions] ❌ (final state)
Resolved (3) → [No transitions] ❌ (final state)
Any → Pending (0) ❌ (can't go backwards)
```

## Functions

### Entry Functions (Public)

#### `submit_incident`
Submit a new incident hash to the registry.

**Parameters:**
- `registry: &mut IncidentRegistry` - Shared registry object
- `incident_hash: vector<u8>` - SHA256 hash as 32 bytes
- `ctx: &TxContext` - Transaction context

**Aborts if:**
- Hash length is not 32 bytes
- Incident with this hash already exists

**Events:**
- `IncidentSubmitted` - Emitted when incident is registered

#### `update_status`
Update the verification status of an incident.

**Parameters:**
- `registry: &mut IncidentRegistry` - Shared registry object
- `incident: &mut IncidentRecord` - Incident record (must be owned by caller)
- `new_status: u8` - New status (1, 2, or 3)
- `ctx: &TxContext` - Transaction context

**Aborts if:**
- Status is invalid (not 1, 2, or 3)
- Status transition is invalid
- Trying to set status to Pending (0)

**Events:**
- `IncidentStatusUpdated` - Emitted when status changes

### View Functions (Public)

- `get_incident_details(incident: &IncidentRecord)` - Get all incident details
- `get_incident_hash(incident: &IncidentRecord)` - Get hash
- `get_incident_status(incident: &IncidentRecord)` - Get status
- `get_verifier(incident: &IncidentRecord)` - Get verifier address
- `get_submitted_at(incident: &IncidentRecord)` - Get submission timestamp
- `get_updated_at(incident: &IncidentRecord)` - Get update timestamp
- `get_version(incident: &IncidentRecord)` - Get version number
- `get_total_incidents(registry: &IncidentRegistry)` - Get total count
- `has_incident(registry: &IncidentRegistry, incident_hash: vector<u8>)` - Check if hash exists

## Security & Privacy

✅ **What is stored on-chain:**
- Incident hash (SHA256, 32 bytes)
- Verification status
- Verifier address
- Timestamps
- Version number

❌ **What is NOT stored on-chain:**
- Personal information
- Incident descriptions
- Location details
- Reporter information
- Any sensitive data

## Events

### `IncidentSubmitted`
Emitted when a new incident is submitted.

```move
struct IncidentSubmitted {
    incident_hash: vector<u8>,
    submitted_by: address,
    timestamp: u64,
}
```

### `IncidentStatusUpdated`
Emitted when incident status is updated.

```move
struct IncidentStatusUpdated {
    incident_hash: vector<u8>,
    old_status: u8,
    new_status: u8,
    verifier: address,
    timestamp: u64,
}
```

## Deployment

### Prerequisites

1. Install Sui CLI:
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch devnet sui
```

2. Set up Sui wallet:
```bash
sui client new-address ed25519
```

3. Get testnet tokens:
```bash
sui client faucet
```

### Build Contract

```bash
sui move build
```

### Test Contract

```bash
sui move test
```

### Deploy to Testnet

```bash
sui client publish --gas-budget 100000000
```

### Deploy to Mainnet

```bash
sui client publish --gas-budget 100000000 --network mainnet
```

## Integration with Backend

The backend's `BlockchainService` should:

1. **Submit Incident Hash:**
   - Convert incident hash from hex string to bytes (32 bytes)
   - Call `submit_incident` function
   - Store returned transaction ID

2. **Update Status:**
   - Get the IncidentRecord object ID from previous transaction
   - Call `update_status` function with new status
   - Store returned transaction ID

3. **Query Status:**
   - Use view functions to check incident status
   - Listen to events for status updates

## Example Workflow

1. **Backend creates incident** → Generates SHA256 hash
2. **Backend calls `submit_incident`** → IncidentRecord created on-chain
3. **Admin verifies incident** → Backend calls `update_status` with status=1
4. **Incident resolved** → Backend calls `update_status` with status=3
5. **Query on-chain** → Use view functions to verify status

## Error Codes

- `E_INVALID_STATUS` (0): Invalid status value
- `E_INVALID_TRANSITION` (1): Invalid status transition
- `E_INCIDENT_NOT_FOUND` (2): Incident not found
- `E_INVALID_HASH_LENGTH` (3): Hash must be 32 bytes
- `E_UNAUTHORIZED` (4): Unauthorized operation
- `E_INCIDENT_ALREADY_EXISTS` (5): Incident already registered

## Best Practices

1. **Always validate hash length** before calling `submit_incident`
2. **Store transaction IDs** in backend database for reference
3. **Listen to events** for real-time status updates
4. **Handle errors gracefully** - blockchain failures shouldn't break API
5. **Use testnet** for development and testing

## Testing

See `tests/` directory for test cases.

## License

ISC

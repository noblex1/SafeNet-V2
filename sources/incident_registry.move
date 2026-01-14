/// SafeNet Incident Registry
/// 
/// This module provides an immutable, on-chain registry for incident verification.
/// It stores only cryptographic hashes and verification metadata - no personal data.
/// 
/// Key Features:
/// - Store incident hashes (SHA256)
/// - Track verification status (Pending, Verified, False, Resolved)
/// - Record verifier address and timestamp
/// - Immutable audit trail
/// - Status transition validation
/// 
/// Status Enum (matches backend):
/// 0 = Pending
/// 1 = Verified
/// 2 = False
/// 3 = Resolved

module safenet::incident_registry;

use sui::object;
use sui::tx_context;
use sui::transfer;
use sui::event;
use sui::table::{Self, Table};

// ============================================================================
// Constants
// ============================================================================

/// Incident status: Pending (initial state)
const STATUS_PENDING: u8 = 0;

/// Incident status: Verified
const STATUS_VERIFIED: u8 = 1;

/// Incident status: False (false alarm)
const STATUS_FALSE: u8 = 2;

/// Incident status: Resolved
const STATUS_RESOLVED: u8 = 3;

/// Error codes
const E_INVALID_STATUS: u64 = 0;
const E_INVALID_TRANSITION: u64 = 1;
const E_INVALID_HASH_LENGTH: u64 = 3;
const E_INCIDENT_ALREADY_EXISTS: u64 = 5;

// ============================================================================
// Data Structures
// ============================================================================

/// Incident record stored on-chain
/// Contains only hash and verification metadata - no personal data
public struct IncidentRecord has key, store {
    id: UID,
    /// SHA256 hash of the incident data (64 hex characters)
    incident_hash: vector<u8>,
    /// Current verification status (0-3)
    status: u8,
    /// Address of the verifier (if verified)
    verifier: Option<address>,
    /// Timestamp when incident was submitted (in milliseconds)
    submitted_at: u64,
    /// Timestamp when status was last updated (in milliseconds)
    updated_at: u64,
    /// Version number for tracking updates
    version: u64,
}

/// Registry that holds all incident records
/// Uses a Table to map incident hash to IncidentRecord
public struct IncidentRegistry has key {
    id: UID,
    /// Map from incident hash (as vector<u8>) to IncidentRecord ID
    incidents: Table<vector<u8>, ID>,
    /// Total number of incidents registered
    total_incidents: u64,
}

// ============================================================================
// Events
// ============================================================================

/// Emitted when a new incident is submitted
public struct IncidentSubmitted has copy, drop {
    incident_hash: vector<u8>,
    submitted_by: address,
    timestamp: u64,
}

/// Emitted when incident status is updated
public struct IncidentStatusUpdated has copy, drop {
    incident_hash: vector<u8>,
    old_status: u8,
    new_status: u8,
    verifier: address,
    timestamp: u64,
}

// ============================================================================
// Module Initialization
// ============================================================================

/// Initialize the Incident Registry
/// Creates and transfers the registry object to the module publisher
fun init(ctx: &mut tx_context::TxContext) {
    let registry = IncidentRegistry {
        id: object::new(ctx),
        incidents: table::new(ctx),
        total_incidents: 0,
    };
    
    transfer::share_object(registry);
}

// ============================================================================
// Public Entry Functions
// ============================================================================

/// Submit a new incident hash to the registry
/// 
/// # Arguments:
/// - `registry`: Shared IncidentRegistry object
/// - `incident_hash`: SHA256 hash as bytes (32 bytes)
/// - `ctx`: Transaction context
/// 
/// # Aborts:
/// - If hash length is invalid (not 32 bytes for SHA256)
/// - If incident with this hash already exists
/// 
/// # Events:
/// - Emits `IncidentSubmitted` event
public entry fun submit_incident(
    registry: &mut IncidentRegistry,
    incident_hash: vector<u8>,
    ctx: &mut tx_context::TxContext
) {
    // Validate hash length (SHA256 = 32 bytes)
    assert!(std::vector::length(&incident_hash) == 32, E_INVALID_HASH_LENGTH);
    
    // Check if incident already exists
    assert!(!table::contains(&registry.incidents, incident_hash), E_INCIDENT_ALREADY_EXISTS);
    
    // Create incident record
    let incident = IncidentRecord {
        id: object::new(ctx),
        incident_hash: incident_hash,
        status: STATUS_PENDING,
        verifier: option::none(),
        submitted_at: tx_context::epoch_timestamp_ms(ctx),
        updated_at: tx_context::epoch_timestamp_ms(ctx),
        version: 1,
    };
    
    let incident_id = object::id(&incident);
    let submitted_by = tx_context::sender(ctx);
    let timestamp = tx_context::epoch_timestamp_ms(ctx);
    
    // Add to registry
    table::add(&mut registry.incidents, incident_hash, incident_id);
    registry.total_incidents = registry.total_incidents + 1;
    
    // Transfer incident to sender (they own it)
    transfer::transfer(incident, submitted_by);
    
    // Emit event
    event::emit(IncidentSubmitted {
        incident_hash: incident_hash,
        submitted_by: submitted_by,
        timestamp: timestamp,
    });
}

/// Update the status of an existing incident
/// 
/// # Arguments:
/// - `registry`: Shared IncidentRegistry object
/// - `incident`: IncidentRecord owned by caller
/// - `new_status`: New status (1=Verified, 2=False, 3=Resolved)
/// 
/// # Aborts:
/// - If status is invalid (not 1, 2, or 3)
/// - If status transition is invalid (can't go from Resolved/False back to Pending)
/// - If trying to set status to Pending (0)
/// 
/// # Events:
/// - Emits `IncidentStatusUpdated` event
public entry fun update_status(
    _registry: &mut IncidentRegistry,
    incident: &mut IncidentRecord,
    new_status: u8,
    ctx: &mut tx_context::TxContext
) {
    // Validate new status (must be 1, 2, or 3 - not 0)
    assert!(new_status == STATUS_VERIFIED || new_status == STATUS_FALSE || new_status == STATUS_RESOLVED, E_INVALID_STATUS);
    
    // Validate status transition
    let old_status = incident.status;
    assert!(is_valid_transition(old_status, new_status), E_INVALID_TRANSITION);
    
    // Update incident
    incident.status = new_status;
    incident.verifier = option::some(tx_context::sender(ctx));
    incident.updated_at = tx_context::epoch_timestamp_ms(ctx);
    incident.version = incident.version + 1;
    
    // Emit event
    event::emit(IncidentStatusUpdated {
        incident_hash: *&incident.incident_hash,
        old_status,
        new_status,
        verifier: tx_context::sender(ctx),
        timestamp: tx_context::epoch_timestamp_ms(ctx),
    });
}

// ============================================================================
// Public View Functions
// ============================================================================

/// Get incident record details
/// 
/// # Arguments:
/// - `incident`: IncidentRecord to query
/// 
/// # Returns:
/// Tuple of (hash, status, verifier, submitted_at, updated_at, version)
public fun get_incident_details(incident: &IncidentRecord): (vector<u8>, u8, Option<address>, u64, u64, u64) {
    (
        *&incident.incident_hash,
        incident.status,
        incident.verifier,
        incident.submitted_at,
        incident.updated_at,
        incident.version
    )
}

/// Get incident hash
public fun get_incident_hash(incident: &IncidentRecord): vector<u8> {
    *&incident.incident_hash
}

/// Get incident status
public fun get_incident_status(incident: &IncidentRecord): u8 {
    incident.status
}

/// Get verifier address (if verified)
public fun get_verifier(incident: &IncidentRecord): Option<address> {
    incident.verifier
}

/// Get submission timestamp
public fun get_submitted_at(incident: &IncidentRecord): u64 {
    incident.submitted_at
}

/// Get last update timestamp
public fun get_updated_at(incident: &IncidentRecord): u64 {
    incident.updated_at
}

/// Get version number
public fun get_version(incident: &IncidentRecord): u64 {
    incident.version
}

/// Get total number of incidents in registry
public fun get_total_incidents(registry: &IncidentRegistry): u64 {
    registry.total_incidents
}

/// Check if an incident hash exists in the registry
public fun has_incident(registry: &IncidentRegistry, incident_hash: vector<u8>): bool {
    // Validate hash length first
    if (std::vector::length(&incident_hash) != 32) {
        return false
    };
    table::contains(&registry.incidents, incident_hash)
}

// ============================================================================
// Internal Helper Functions
// ============================================================================

/// Validate if status transition is allowed
/// 
/// Rules:
/// - Pending (0) -> Verified (1), False (2), or Resolved (3): ✅ Allowed
/// - Verified (1) -> Resolved (3): ✅ Allowed
/// - False (2) -> No transitions: ❌ Not allowed (final state)
/// - Resolved (3) -> No transitions: ❌ Not allowed (final state)
/// - Any -> Pending (0): ❌ Not allowed (can't go backwards)
fun is_valid_transition(old_status: u8, new_status: u8): bool {
    // Can't set status to Pending
    if (new_status == STATUS_PENDING) {
        return false
    };
    
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
    
    // From False or Resolved, no transitions allowed (final states)
    false
}


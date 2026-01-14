import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromHEX } from '@mysten/sui/utils';
import { IncidentStatus, BlockchainSubmission } from '../types';
import logger from '../utils/logger';

/**
 * Blockchain Service - Sui SDK Integration
 * 
 * This service handles all blockchain interactions with the Sui network.
 * 
 * IMPORTANT: Only incident hashes and verification metadata are stored on-chain.
 * No personal data is ever stored on the blockchain.
 */
export class BlockchainService {
  private static client: SuiClient | null = null;
  private static keypair: Ed25519Keypair | null = null;
  private static packageId: string = process.env.SUI_PACKAGE_ID || '';
  private static registryId: string = process.env.SUI_REGISTRY_ID || '';
  private static network: string = process.env.SUI_NETWORK || 'testnet';

  /**
   * Initialize the Sui client and keypair
   */
  private static initialize(): void {
    if (!this.client) {
      const rpcUrl = process.env.SUI_RPC_URL || getFullnodeUrl(this.network as 'testnet' | 'mainnet' | 'devnet' | 'localnet');
      this.client = new SuiClient({ url: rpcUrl });

      // Initialize keypair from private key
      const privateKey = process.env.SUI_PRIVATE_KEY;
      if (privateKey) {
        try {
          // Handle both hex string (with or without 0x prefix) and base64
          let keyBytes: Uint8Array;
          if (privateKey.startsWith('0x')) {
            keyBytes = fromHEX(privateKey.slice(2));
          } else if (privateKey.length === 64) {
            // Assume hex without prefix
            keyBytes = fromHEX(privateKey);
          } else {
            // Try base64
            keyBytes = Uint8Array.from(Buffer.from(privateKey, 'base64'));
          }
          this.keypair = Ed25519Keypair.fromSecretKey(keyBytes);
        } catch (error) {
          logger.error('Failed to initialize Sui keypair:', error);
          throw new Error('Invalid SUI_PRIVATE_KEY format');
        }
      } else {
        logger.warn('SUI_PRIVATE_KEY not set. Blockchain operations will fail.');
      }
    }
  }

  /**
   * Convert hex string to bytes (for incident hash)
   */
  private static hexToBytes(hex: string): Uint8Array {
    // Remove 0x prefix if present
    const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
    
    // Validate length (SHA256 = 64 hex chars = 32 bytes)
    if (cleanHex.length !== 64) {
      throw new Error(`Invalid hash length: expected 64 hex characters, got ${cleanHex.length}`);
    }

    return fromHEX(cleanHex);
  }

  /**
   * Submit incident hash to blockchain
   * @param incidentHash - SHA256 hash of incident data (hex string, 64 chars)
   * @param status - Initial status (should be PENDING)
   * @returns Object with txDigest and recordId, or null if failed
   */
  static async submitIncidentHash(
    incidentHash: string,
    status: IncidentStatus
  ): Promise<{ txDigest: string; recordId: string } | null> {
    try {
      this.initialize();

      if (!this.client || !this.keypair) {
        logger.error('Sui client or keypair not initialized');
        return null;
      }

      if (!this.packageId || !this.registryId) {
        logger.error('SUI_PACKAGE_ID or SUI_REGISTRY_ID not configured');
        return null;
      }

      logger.info('Submitting incident hash to blockchain', {
        hash: incidentHash,
        status,
        network: this.network,
        packageId: this.packageId,
      });

      // Convert hash to bytes
      const hashBytes = this.hexToBytes(incidentHash);

      // Create transaction
      const tx = new Transaction();

      // Call submit_incident function
      tx.moveCall({
        target: `${this.packageId}::incident_registry::submit_incident`,
        arguments: [
          tx.object(this.registryId), // Registry shared object
          tx.pure(hashBytes), // Incident hash as bytes
        ],
      });

      // Sign and execute transaction
      const result = await this.client.signAndExecuteTransaction({
        signer: this.keypair,
        transaction: tx,
        options: {
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
        },
      });

      if (result.effects?.status?.status === 'success') {
        const txDigest = result.digest;
        
        // Extract IncidentRecord object ID from events or object changes
        let incidentRecordId: string | null = null;
        
        if (result.objectChanges) {
          const createdObject = result.objectChanges.find(
            (change: any) => change.type === 'created' && 
            change.objectType?.includes('IncidentRecord')
          );
          if (createdObject && 'objectId' in createdObject) {
            incidentRecordId = createdObject.objectId;
          }
        }

        logger.info('Incident hash submitted to blockchain successfully', {
          hash: incidentHash,
          txDigest,
          incidentRecordId,
        });

        if (!incidentRecordId) {
          logger.warn('IncidentRecord ID not found in transaction result', {
            hash: incidentHash,
            txDigest,
          });
          // Still return txDigest even if recordId is missing
          return { txDigest, recordId: '' };
        }

        // Return both transaction digest and record ID
        return { txDigest, recordId: incidentRecordId };
      } else {
        logger.error('Transaction failed', {
          hash: incidentHash,
          effects: result.effects,
        });
        return null;
      }
    } catch (error) {
      logger.error('Failed to submit incident hash to blockchain:', error);
      // Don't throw - blockchain failures shouldn't break the API
      return null;
    }
  }

  /**
   * Update incident status on blockchain
   * @param incidentRecordId - Object ID of the IncidentRecord on-chain
   * @param status - New status (VERIFIED, FALSE, or RESOLVED)
   * @param verifierAddress - Address/ID of the verifier (not used in contract, but logged)
   * @returns Transaction digest or null if failed
   */
  static async updateIncidentStatus(
    incidentRecordId: string,
    status: IncidentStatus,
    verifierAddress: string
  ): Promise<string | null> {
    try {
      if (status === IncidentStatus.PENDING) {
        logger.warn('Cannot update blockchain with PENDING status');
        return null;
      }

      this.initialize();

      if (!this.client || !this.keypair) {
        logger.error('Sui client or keypair not initialized');
        return null;
      }

      if (!this.packageId || !this.registryId) {
        logger.error('SUI_PACKAGE_ID or SUI_REGISTRY_ID not configured');
        return null;
      }

      logger.info('Updating incident status on blockchain', {
        incidentRecordId,
        status,
        verifier: verifierAddress,
        network: this.network,
      });

      // Create transaction
      const tx = new Transaction();

      // Call update_status function
      tx.moveCall({
        target: `${this.packageId}::incident_registry::update_status`,
        arguments: [
          tx.object(this.registryId), // Registry shared object
          tx.object(incidentRecordId), // IncidentRecord object
          tx.pure.u8(status), // New status (1, 2, or 3)
        ],
      });

      // Sign and execute transaction
      const result = await this.client.signAndExecuteTransaction({
        signer: this.keypair,
        transaction: tx,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      if (result.effects?.status?.status === 'success') {
        const txDigest = result.digest;

        logger.info('Incident status updated on blockchain successfully', {
          incidentRecordId,
          status,
          txDigest,
        });

        return txDigest;
      } else {
        logger.error('Transaction failed', {
          incidentRecordId,
          status,
          effects: result.effects,
        });
        return null;
      }
    } catch (error) {
      logger.error('Failed to update incident status on blockchain:', error);
      return null;
    }
  }

  /**
   * Get incident record from blockchain
   * @param incidentRecordId - Object ID of the IncidentRecord
   * @returns Incident data or null if not found
   */
  static async getIncidentRecord(incidentRecordId: string): Promise<any | null> {
    try {
      this.initialize();

      if (!this.client) {
        logger.error('Sui client not initialized');
        return null;
      }

      const object = await this.client.getObject({
        id: incidentRecordId,
        options: {
          showContent: true,
          showType: true,
        },
      });

      if (object.data) {
        return {
          objectId: object.data.objectId,
          type: object.data.type,
          content: object.data.content,
        };
      }

      return null;
    } catch (error) {
      logger.error('Failed to get incident record from blockchain:', error);
      return null;
    }
  }

  /**
   * Get blockchain audit log for an incident
   * @param incidentHash - SHA256 hash of incident data
   * @returns Array of blockchain submissions/updates
   */
  static async getAuditLog(incidentHash: string): Promise<BlockchainSubmission[]> {
    try {
      this.initialize();

      if (!this.client) {
        logger.error('Sui client not initialized');
        return [];
      }

      logger.info('Fetching blockchain audit log', {
        hash: incidentHash,
      });

      // Note: Event querying by hash would require filtering events
      // This is a simplified version - in production, you might want to
      // store event data in your database for easier querying
      
      // For now, return empty array - can be enhanced with event queries
      return [];
    } catch (error) {
      logger.error('Failed to fetch blockchain audit log:', error);
      return [];
    }
  }

  /**
   * Verify transaction exists on blockchain
   * @param txDigest - Transaction digest
   * @returns True if transaction exists and is valid
   */
  static async verifyTransaction(txDigest: string): Promise<boolean> {
    try {
      this.initialize();

      if (!this.client) {
        logger.error('Sui client not initialized');
        return false;
      }

      logger.info('Verifying blockchain transaction', {
        txDigest,
      });

      const tx = await this.client.getTransactionBlock({
        digest: txDigest,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      if (tx && tx.effects?.status?.status === 'success') {
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Failed to verify blockchain transaction:', error);
      return false;
    }
  }

  /**
   * Get transaction details
   * @param txDigest - Transaction digest
   * @returns Transaction details or null
   */
  static async getTransactionDetails(txDigest: string): Promise<any | null> {
    try {
      this.initialize();

      if (!this.client) {
        return null;
      }

      const tx = await this.client.getTransactionBlock({
        digest: txDigest,
        options: {
          showEffects: true,
          showEvents: true,
          showInput: true,
        },
      });

      return tx;
    } catch (error) {
      logger.error('Failed to get transaction details:', error);
      return null;
    }
  }
}

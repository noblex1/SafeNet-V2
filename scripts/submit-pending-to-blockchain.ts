/**
 * Submit Pending Incidents to Blockchain
 * Manually submit incidents that have hashes but no blockchain transaction
 */

// IMPORTANT: Load dotenv FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

// Now import other modules
import { connectDatabase } from '../src/config/database';
import { BlockchainService } from '../src/services/blockchainService';
import Incident from '../src/models/Incident';
import { IncidentStatus } from '../src/types';
import mongoose from 'mongoose';

// Verify blockchain config
console.log('Blockchain Configuration:');
console.log('  SUI_NETWORK:', process.env.SUI_NETWORK || 'NOT SET');
console.log('  SUI_RPC_URL:', process.env.SUI_RPC_URL || 'NOT SET');
console.log('  SUI_PACKAGE_ID:', process.env.SUI_PACKAGE_ID ? 'SET' : 'NOT SET');
console.log('  SUI_REGISTRY_ID:', process.env.SUI_REGISTRY_ID ? 'SET' : 'NOT SET');
console.log('  SUI_PRIVATE_KEY:', process.env.SUI_PRIVATE_KEY ? 'SET' : 'NOT SET');
console.log('');

async function submitPending() {
  try {
    // Connect to database
    await connectDatabase();
    console.log('Connected to MongoDB\n');

    // Find incidents with hash but no blockchain transaction
    const pendingIncidents = await Incident.find({
      incidentHash: { $exists: true, $ne: null },
      $or: [
        { blockchainTxId: { $exists: false } },
        { blockchainTxId: null },
      ],
    }).limit(10);

    console.log(`Found ${pendingIncidents.length} incidents to submit to blockchain\n`);

    if (pendingIncidents.length === 0) {
      console.log('No pending incidents found. All incidents are already on blockchain or missing hashes.');
      await mongoose.disconnect();
      return;
    }

    for (const incident of pendingIncidents) {
      console.log(`\n📋 Processing: ${incident.title}`);
      console.log(`   ID: ${incident._id}`);
      console.log(`   Hash: ${incident.incidentHash}`);

      if (!incident.incidentHash) {
        console.log('   ⚠️  No hash found, skipping...');
        continue;
      }

      try {
        const result = await BlockchainService.submitIncidentHash(
          incident.incidentHash,
          incident.status as IncidentStatus
        );

        if (result) {
          incident.blockchainTxId = result.txDigest;
          incident.blockchainRecordId = result.recordId;
          await incident.save();

          console.log(`   ✅ Submitted to blockchain!`);
          console.log(`   Transaction ID: ${result.txDigest}`);
          console.log(`   Record ID: ${result.recordId}`);
        } else {
          console.log(`   ❌ Failed to submit (check blockchain config)`);
        }
      } catch (error: any) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }

    console.log('\n✅ Done!\n');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

submitPending();

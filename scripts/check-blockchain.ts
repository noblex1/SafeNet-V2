/**
 * Check Blockchain Records Script
 * Query and display verified incidents on the blockchain
 */

// IMPORTANT: Load dotenv FIRST
import dotenv from 'dotenv';
dotenv.config();

// Now import other modules
import { connectDatabase } from '../src/config/database';
import { BlockchainService } from '../src/services/blockchainService';
import Incident from '../src/models/Incident';
import User from '../src/models/User';
import mongoose from 'mongoose';

async function checkBlockchain() {
  try {
    // Connect to database
    await connectDatabase();
    console.log('Connected to MongoDB\n');

    // Get all incidents with blockchain data
    const incidents = await Incident.find({
      $or: [
        { blockchainTxId: { $exists: true, $ne: null } },
        { blockchainRecordId: { $exists: true, $ne: null } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(50);

    console.log(`Found ${incidents.length} incidents with blockchain data\n`);
    console.log('='.repeat(80));

    for (const incident of incidents) {
      console.log(`\n📋 Incident: ${incident.title}`);
      console.log(`   ID: ${incident._id}`);
      console.log(`   Status: ${incident.status} (${getStatusLabel(incident.status)})`);
      console.log(`   Hash: ${incident.incidentHash || 'N/A'}`);
      
      if (incident.blockchainTxId) {
        console.log(`   Transaction ID: ${incident.blockchainTxId}`);
        
        // Verify transaction
        const isValid = await BlockchainService.verifyTransaction(incident.blockchainTxId);
        console.log(`   Transaction Valid: ${isValid ? '✅' : '❌'}`);
        
        if (isValid) {
          const txDetails = await BlockchainService.getTransactionDetails(incident.blockchainTxId);
          if (txDetails) {
            console.log(`   Transaction Status: ${txDetails.effects?.status?.status || 'Unknown'}`);
          }
        }
      }

      if (incident.blockchainRecordId) {
        console.log(`   Record ID: ${incident.blockchainRecordId}`);
        
        // Get blockchain record
        const record = await BlockchainService.getIncidentRecord(incident.blockchainRecordId);
        if (record) {
          console.log(`   ✅ Record found on blockchain`);
          if (record.content && 'fields' in record.content) {
            const fields = record.content.fields as any;
            console.log(`   On-chain Status: ${fields.status || 'N/A'}`);
            console.log(`   On-chain Hash: ${fields.incident_hash ? 'Present' : 'Missing'}`);
            if (fields.submitted_at) {
              console.log(`   Submitted At: ${new Date(Number(fields.submitted_at)).toLocaleString()}`);
            }
            if (fields.updated_at) {
              console.log(`   Updated At: ${new Date(Number(fields.updated_at)).toLocaleString()}`);
            }
          }
        } else {
          console.log(`   ❌ Record not found on blockchain`);
        }
      }

      console.log(`   Created: ${incident.createdAt?.toLocaleString()}`);
      if (incident.verifiedAt) {
        console.log(`   Verified: ${incident.verifiedAt.toLocaleString()}`);
      }
      console.log('-'.repeat(80));
    }

    // Summary
    const verified = incidents.filter((inc) => inc.status === 1).length;
    const resolved = incidents.filter((inc) => inc.status === 3).length;
    const falseAlarms = incidents.filter((inc) => inc.status === 2).length;
    const pending = incidents.filter((inc) => inc.status === 0).length;

    console.log('\n📊 Summary:');
    console.log(`   Total with blockchain data: ${incidents.length}`);
    console.log(`   Verified: ${verified}`);
    console.log(`   Resolved: ${resolved}`);
    console.log(`   False: ${falseAlarms}`);
    console.log(`   Pending: ${pending}`);

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error checking blockchain:', error);
    process.exit(1);
  }
}

function getStatusLabel(status: number): string {
  const labels: Record<number, string> = {
    0: 'Pending',
    1: 'Verified',
    2: 'False',
    3: 'Resolved',
  };
  return labels[status] || 'Unknown';
}

checkBlockchain();

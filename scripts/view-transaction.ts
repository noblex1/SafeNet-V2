/**
 * View Blockchain Transaction Details
 * Usage: ts-node scripts/view-transaction.ts <transaction_id>
 */

import dotenv from 'dotenv';
import { BlockchainService } from '../src/services/blockchainService';

dotenv.config();

const txDigest = process.argv[2];

if (!txDigest) {
  console.error('Usage: ts-node scripts/view-transaction.ts <transaction_id>');
  process.exit(1);
}

async function viewTransaction() {
  try {
    console.log(`\n🔍 Viewing transaction: ${txDigest}\n`);

    // Verify transaction
    const isValid = await BlockchainService.verifyTransaction(txDigest);
    console.log(`Transaction Valid: ${isValid ? '✅' : '❌'}\n`);

    if (!isValid) {
      console.log('Transaction not found or invalid.');
      return;
    }

    // Get transaction details
    const details = await BlockchainService.getTransactionDetails(txDigest);
    
    if (details) {
      console.log('Transaction Details:');
      console.log('='.repeat(80));
      console.log(JSON.stringify(details, null, 2));
      console.log('='.repeat(80));
      
      // Extract useful info
      if (details.effects) {
        console.log('\n📊 Effects:');
        console.log(`   Status: ${details.effects.status?.status || 'Unknown'}`);
        if (details.effects.gasUsed) {
          console.log(`   Gas Used: ${details.effects.gasUsed.computationCost || 'N/A'}`);
        }
      }

      if (details.events && details.events.length > 0) {
        console.log('\n📢 Events:');
        details.events.forEach((event: any, index: number) => {
          console.log(`   Event ${index + 1}:`, JSON.stringify(event, null, 2));
        });
      }

      if (details.objectChanges && details.objectChanges.length > 0) {
        console.log('\n🔄 Object Changes:');
        details.objectChanges.forEach((change: any, index: number) => {
          console.log(`   Change ${index + 1}:`, JSON.stringify(change, null, 2));
        });
      }
    } else {
      console.log('Could not retrieve transaction details.');
    }
  } catch (error) {
    console.error('❌ Error viewing transaction:', error);
    process.exit(1);
  }
}

viewTransaction();

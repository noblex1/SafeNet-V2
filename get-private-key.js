#!/usr/bin/env node

/**
 * Script to extract private key from Sui keystore
 * For Sui CLI version 1.62.0+
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const keystorePath = path.join(os.homedir(), '.sui', 'sui_config', 'sui.keystore');
const address = process.argv[2] || '0x1921640b972fe6f71f520a22456eab46928836df024c963f51b1ced156207c26';

console.log('🔑 Extracting Sui Private Key...\n');

if (!fs.existsSync(keystorePath)) {
  console.error('❌ Keystore file not found at:', keystorePath);
  process.exit(1);
}

try {
  const keystoreContent = fs.readFileSync(keystorePath, 'utf8');
  const keys = keystoreContent.trim().split('\n').filter(line => line.trim());
  
  console.log(`Found ${keys.length} key(s) in keystore\n`);
  
  // Try to find the key for the given address
  // The keystore format is typically: <key_scheme><base64_key>
  // We need to decode and check
  
  for (let i = 0; i < keys.length; i++) {
    const keyEntry = keys[i].trim();
    if (!keyEntry) continue;
    
    try {
      // Sui keystore format: <scheme><base64_key>
      // Schemes: 0 = Ed25519, 1 = Secp256k1, 2 = Secp256r1
      const scheme = keyEntry[0];
      const base64Key = keyEntry.slice(1);
      
      // Decode base64 to get the key bytes
      const keyBytes = Buffer.from(base64Key, 'base64');
      
      // For Ed25519, the private key is 32 bytes
      if (scheme === '0' && keyBytes.length >= 32) {
        const privateKeyBytes = keyBytes.slice(0, 32);
        const privateKeyHex = privateKeyBytes.toString('hex');
        
        console.log(`✅ Found Ed25519 key (entry ${i + 1}):`);
        console.log(`   Private Key (hex): 0x${privateKeyHex}`);
        console.log(`   Private Key (hex, no prefix): ${privateKeyHex}`);
        console.log(`\n📋 Add this to your .env file:`);
        console.log(`SUI_PRIVATE_KEY=0x${privateKeyHex}`);
        console.log(`\n⚠️  Keep this private key secure!`);
        break;
      }
    } catch (err) {
      // Skip invalid entries
      continue;
    }
  }
  
  // If we didn't find a match, show all keys
  if (keys.length > 0) {
    console.log('\n💡 Note: If multiple keys exist, use the one matching your address.');
    console.log('   Your address:', address);
  }
  
} catch (error) {
  console.error('❌ Error reading keystore:', error.message);
  console.error('\n💡 Alternative: You can manually check the keystore file:');
  console.error('   cat ~/.sui/sui_config/sui.keystore');
  process.exit(1);
}

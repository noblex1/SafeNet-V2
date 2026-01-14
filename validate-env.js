#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * Checks if all required environment variables are set correctly
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const requiredVars = {
  // Server
  PORT: { required: false, default: '3000', description: 'Server port' },
  NODE_ENV: { required: false, default: 'development', description: 'Environment' },
  
  // MongoDB
  MONGODB_URI: { required: true, description: 'MongoDB connection string' },
  
  // JWT
  JWT_SECRET: { required: true, minLength: 32, description: 'JWT secret key (min 32 chars)' },
  JWT_REFRESH_SECRET: { required: true, minLength: 32, description: 'JWT refresh secret (min 32 chars)' },
  JWT_EXPIRES_IN: { required: false, default: '15m', description: 'JWT expiration' },
  JWT_REFRESH_EXPIRES_IN: { required: false, default: '7d', description: 'Refresh token expiration' },
  
  // Sui Blockchain
  SUI_NETWORK: { required: false, default: 'testnet', validValues: ['testnet', 'mainnet', 'devnet', 'localnet'], description: 'Sui network' },
  SUI_RPC_URL: { required: false, default: 'https://fullnode.testnet.sui.io:443', description: 'Sui RPC URL' },
  SUI_PACKAGE_ID: { required: true, format: 'hex', length: 66, description: 'Deployed contract package ID' },
  SUI_REGISTRY_ID: { required: true, format: 'hex', length: 66, description: 'IncidentRegistry object ID' },
  SUI_PRIVATE_KEY: { required: true, description: 'Sui wallet private key' },
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: { required: false, default: '900000', description: 'Rate limit window' },
  RATE_LIMIT_MAX_REQUESTS: { required: false, default: '100', description: 'Max requests per window' },
  
  // Security
  BCRYPT_ROUNDS: { required: false, default: '12', description: 'Bcrypt rounds' },
};

const expectedPackageId = '0x08dc2a934117abd6446b3f06329c9a537f576c7df3a637395018cc37d9d7473c';
const expectedRegistryId = '0x3b0e28ebac3caebdd010657d26d74902db981ab6ffb3ae993bb1f981015bcbf3';

console.log('🔍 Validating SafeNet Environment Variables...\n');

let hasErrors = false;
let hasWarnings = false;

// Check each required variable
for (const [varName, config] of Object.entries(requiredVars)) {
  const value = process.env[varName];
  
  if (!value) {
    if (config.required) {
      console.error(`❌ ${varName}: MISSING (Required)`);
      console.error(`   ${config.description}`);
      hasErrors = true;
    } else {
      console.warn(`⚠️  ${varName}: Not set (using default: ${config.default || 'none'})`);
      hasWarnings = true;
    }
    continue;
  }
  
  // Validate format
  if (config.format === 'hex') {
    if (!value.startsWith('0x')) {
      console.error(`❌ ${varName}: Invalid format (must start with 0x)`);
      hasErrors = true;
      continue;
    }
    if (config.length && value.length !== config.length) {
      console.error(`❌ ${varName}: Invalid length (expected ${config.length}, got ${value.length})`);
      hasErrors = true;
      continue;
    }
    // Check if it's a valid hex string
    const hexPart = value.slice(2);
    if (!/^[0-9a-fA-F]+$/.test(hexPart)) {
      console.error(`❌ ${varName}: Invalid hex format`);
      hasErrors = true;
      continue;
    }
  }
  
  // Validate length
  if (config.minLength && value.length < config.minLength) {
    console.error(`❌ ${varName}: Too short (min ${config.minLength} chars, got ${value.length})`);
    hasErrors = true;
    continue;
  }
  
  // Validate values
  if (config.validValues && !config.validValues.includes(value)) {
    console.error(`❌ ${varName}: Invalid value (must be one of: ${config.validValues.join(', ')})`);
    hasErrors = true;
    continue;
  }
  
  // Check for placeholder values
  if (value.includes('your_') || value.includes('change_') || value === 'your_private_key_here' || value === 'test-secret-key') {
    console.warn(`⚠️  ${varName}: Contains placeholder value - please update!`);
    hasWarnings = true;
    continue;
  }
  
  // Special checks
  if (varName === 'SUI_PACKAGE_ID' && value !== expectedPackageId) {
    console.warn(`⚠️  ${varName}: Value doesn't match expected deployment ID`);
    console.warn(`   Expected: ${expectedPackageId}`);
    console.warn(`   Got:      ${value}`);
    hasWarnings = true;
  }
  
  if (varName === 'SUI_REGISTRY_ID' && value !== expectedRegistryId) {
    console.warn(`⚠️  ${varName}: Value doesn't match expected registry ID`);
    console.warn(`   Expected: ${expectedRegistryId}`);
    console.warn(`   Got:      ${value}`);
    hasWarnings = true;
  }
  
  // Mask sensitive values in output
  let displayValue = value;
  if (varName.includes('SECRET') || varName.includes('KEY') || varName.includes('PASSWORD')) {
    displayValue = value.length > 10 ? `${value.substring(0, 6)}...${value.substring(value.length - 4)}` : '***';
  }
  
  console.log(`✅ ${varName}: ${displayValue}`);
}

console.log('\n' + '='.repeat(60));

// Summary
if (hasErrors) {
  console.error('\n❌ Validation FAILED - Please fix the errors above');
  process.exit(1);
} else if (hasWarnings) {
  console.warn('\n⚠️  Validation passed with warnings - Please review');
  process.exit(0);
} else {
  console.log('\n✅ All environment variables are properly configured!');
  process.exit(0);
}

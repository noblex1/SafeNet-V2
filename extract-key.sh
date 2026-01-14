#!/bin/bash

# Extract Sui private key from keystore
# This script reads the keystore and converts the key to hex format

KEYSTORE_FILE="$HOME/.sui/sui_config/sui.keystore"
ADDRESS="0x1921640b972fe6f71f520a22456eab46928836df024c963f51b1ced156207c26"

echo "🔑 Extracting Sui Private Key..."
echo ""

if [ ! -f "$KEYSTORE_FILE" ]; then
    echo "❌ Keystore file not found: $KEYSTORE_FILE"
    exit 1
fi

# Read the keystore (it's a JSON array)
KEYS=$(cat "$KEYSTORE_FILE" | grep -o '"[^"]*"' | tr -d '"')

echo "Found key in keystore"
echo ""
echo "Converting to hex format..."
echo ""

# Convert the key using sui keytool
PRIVATE_KEY=$(sui keytool convert "AMQ3bpQ8hOzvcBEX0ERUirfd2wsIM5RMniy7Lusm27db" 2>&1)

if [ $? -eq 0 ]; then
    echo "✅ Private Key Extracted:"
    echo ""
    echo "$PRIVATE_KEY"
    echo ""
    echo "📋 Add this to your .env file:"
    echo "SUI_PRIVATE_KEY=$PRIVATE_KEY"
    echo ""
    echo "⚠️  Keep this private key secure and never commit it to git!"
else
    echo "❌ Failed to convert key"
    echo "$PRIVATE_KEY"
    exit 1
fi

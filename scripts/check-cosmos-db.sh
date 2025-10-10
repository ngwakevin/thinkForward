#!/bin/bash
# Script to check if Cosmos DB is properly configured

# Source environment variables if available
if [ -f ".env.local" ]; then
  source .env.local
fi

# Check for required Cosmos DB variables
echo "Checking Cosmos DB configuration..."
echo ""

# Check COSMOS_ENDPOINT
if [ -z "$COSMOS_ENDPOINT" ]; then
  echo "❌ COSMOS_ENDPOINT is not set"
  COSMOS_DB_OK=false
elif [[ "$COSMOS_ENDPOINT" == *"example"* ]] || [[ "$COSMOS_ENDPOINT" == *"placeholder"* ]]; then
  echo "❌ COSMOS_ENDPOINT contains a placeholder value: $COSMOS_ENDPOINT"
  COSMOS_DB_OK=false
else
  echo "✅ COSMOS_ENDPOINT is set: ${COSMOS_ENDPOINT:0:30}..."
  COSMOS_DB_OK=true
fi

# Check COSMOS_KEY
if [ -z "$COSMOS_KEY" ]; then
  echo "❌ COSMOS_KEY is not set"
  COSMOS_DB_OK=false
elif [[ "$COSMOS_KEY" == *"placeholder"* ]]; then
  echo "❌ COSMOS_KEY contains a placeholder value"
  COSMOS_DB_OK=false
else
  echo "✅ COSMOS_KEY is set (value hidden)"
  COSMOS_DB_OK=$COSMOS_DB_OK
fi

# Check COSMOS_DATABASE
if [ -z "$COSMOS_DATABASE" ]; then
  echo "❌ COSMOS_DATABASE is not set"
  COSMOS_DB_OK=false
else
  echo "✅ COSMOS_DATABASE is set: $COSMOS_DATABASE"
  COSMOS_DB_OK=$COSMOS_DB_OK
fi

echo ""
if [ "$COSMOS_DB_OK" = true ]; then
  echo "✅ Cosmos DB appears to be properly configured."
  echo "Note: This script only checks if the configuration values are set,"
  echo "but does not verify connectivity to the actual Cosmos DB instance."
else
  echo "⚠️  Cosmos DB is not properly configured."
  echo "The application will use in-memory fallback storage."
  echo "User data will not persist between application restarts."
  echo ""
  echo "To properly configure Cosmos DB:"
  echo "1. Create a Cosmos DB account in Azure"
  echo "2. Update COSMOS_ENDPOINT, COSMOS_KEY, and COSMOS_DATABASE in .env.local"
  echo "3. Run this script again to verify configuration"
  echo ""
  echo "See docs/cosmos-db-setup.md for detailed setup instructions."
fi
#!/bin/bash

# Check if required Azure environment variables are set

echo "Checking required Azure environment variables..."
echo "================================================"

# List of required variables
REQUIRED_VARS=(
  "AZURE_TENANT_ID"
  "AZURE_SUBSCRIPTION_ID"
  "AZURE_CLIENT_ID"
  "AZURE_CLIENT_SECRET"
  "COSMOS_DB_ENDPOINT"
  "COSMOS_DB_KEY"
  "KEY_VAULT_URI"
  "APP_INSIGHTS_CONNECTION_STRING"
)

# Count missing variables
MISSING=0

# Check each variable
for VAR in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!VAR}" ]; then
    echo "❌ $VAR is not set"
    MISSING=$((MISSING+1))
  else
    echo "✅ $VAR is set"
  fi
done

# Summary
echo "================================================"
if [ $MISSING -eq 0 ]; then
  echo "All required environment variables are set! ✅"
  exit 0
else
  echo "Missing $MISSING environment variables! ❌"
  echo "Please set the missing variables before deploying."
  exit 1
fi
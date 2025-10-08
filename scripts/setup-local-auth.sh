#!/bin/bash

# Script to set up Azure AD credentials for local development
echo "Setting up Azure AD credentials for local development..."

# Create or update .env.local file with Azure AD credentials
# Prompt for Azure AD credentials
echo "Enter Azure AD Client ID: "
read CLIENT_ID

echo "Enter Azure AD Client Secret: "
read -s CLIENT_SECRET
echo ""

echo "Enter Azure AD Object ID (optional, press Enter to skip): "
read OBJECT_ID

# Create or update .env.local file with Azure AD credentials
cat > /Users/kngwa/Desktop/ThinkFoward/thinkForward/.env.local << EOF
# Azure AD credentials
AZURE_AD_CLIENT_ID="${CLIENT_ID}"
AZURE_AD_CLIENT_SECRET="${CLIENT_SECRET}"
AZURE_AD_TENANT_ID="common"
${OBJECT_ID:+AZURE_AD_OBJECT_ID=\"$OBJECT_ID\"}
# Using 'common' for multi-tenant support

# NextAuth settings
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=$(openssl rand -base64 32)
EOF

echo "Azure AD credentials have been set up in .env.local file!"
echo "You can now start your application with these credentials."
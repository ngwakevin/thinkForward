#!/bin/bash
# Script to create a temporary diagnostic endpoint to check environment variables at runtime

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Creating a temporary diagnostic endpoint to check environment variables...${NC}"

# Create a temporary route.ts file to check environment variables
mkdir -p ./app/api/diag
cat > ./app/api/diag/route.ts << 'EOF'
import { NextResponse } from 'next/server';

// Simple diagnostic endpoint to check environment variables
export async function GET(request: Request) {
  // Check all environment variables related to authentication
  const envVars = {
    AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID || 'Not set',
    AZURE_AD_TENANT_ID: process.env.AZURE_AD_TENANT_ID || 'Not set',
    AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET ? 'Set (hidden)' : 'Not set',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set (hidden)' : 'Not set',
    NODE_ENV: process.env.NODE_ENV || 'Not set',
    // Include path to show where the app is running from
    APP_PATH: process.cwd(),
  };
  
  return NextResponse.json({
    status: 'ok',
    message: 'Diagnostic endpoint for checking environment variables',
    timestamp: new Date().toISOString(),
    environment: envVars,
  });
}
EOF

echo -e "${GREEN}Created diagnostic endpoint at /app/api/diag/route.ts${NC}"
echo -e "Adding and committing changes..."

# Add and commit the changes
git add ./app/api/diag/route.ts
git commit -m "Add temporary diagnostic endpoint to check environment variables"

# Push changes to the repository
echo -e "Pushing changes to the repository..."
git push

echo -e "\n${YELLOW}Waiting for deployment to complete...${NC}"
echo -e "This may take a few minutes."
echo -e "You can check the deployment status with: az webapp deployment source show --name \"thinkforward-dev\" --resource-group \"thinkforward-dev-rg\""

echo -e "\n${GREEN}Diagnostic endpoint created!${NC}"
echo -e "After deployment completes, you can access the endpoint at:"
HOSTNAME=$(az webapp show --name "thinkforward-dev" --resource-group "thinkforward-dev-rg" --query "defaultHostName" -o tsv)
echo -e "${GREEN}https://$HOSTNAME/api/diag${NC}"
echo -e "This will show the actual environment variables as seen by the application at runtime."
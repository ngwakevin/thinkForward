#!/bin/bash
# prepare-azure-deployment.sh - Complete script for preparing and fixing Azure deployment issues
# Created by GitHub Copilot

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== ThinkForward Azure Deployment Preparation ===${NC}"

# Check working directory
if [[ ! -f "next.config.mjs" || ! -f "package.json" ]]; then
    echo -e "${RED}Error: This script must be run from the project root directory.${NC}"
    exit 1
fi

# Run all the fix scripts in sequence

# Ensure critical scripts are executable
echo -e "${GREEN}Making critical scripts executable...${NC}"
chmod +x scripts/minimal-next-starter.js || echo -e "${YELLOW}Warning: Could not set permissions on minimal-next-starter.js${NC}"
chmod +x scripts/emergency-server.js || echo -e "${YELLOW}Warning: Could not set permissions on emergency-server.js${NC}"
chmod +x scripts/comprehensive-nextjs-diagnostics.js || echo -e "${YELLOW}Warning: Could not set permissions on comprehensive-nextjs-diagnostics.js${NC}"
chmod +x scripts/create-direct-startup.sh || echo -e "${YELLOW}Warning: Could not set permissions on create-direct-startup.sh${NC}"

# Create a scripts directory in public (will be included in deployment)
echo -e "${GREEN}Creating backup directory in public folder...${NC}"
mkdir -p public/azure-backup/scripts
echo "Created backup directory at public/azure-backup/scripts"

# Copy critical scripts to public directory so they're always included
echo -e "${GREEN}Copying critical scripts to public directory for backup...${NC}"
cp scripts/minimal-next-starter.js public/azure-backup/scripts/
cp scripts/emergency-server.js public/azure-backup/scripts/
cp scripts/comprehensive-nextjs-diagnostics.js public/azure-backup/scripts/
cp scripts/create-direct-startup.sh public/azure-backup/scripts/

echo "Copied critical files to public/azure-backup/scripts/"
ls -la public/azure-backup/scripts/

# Create a simple script in the public directory that can copy files back if needed
echo -e "${GREEN}Creating emergency restore script...${NC}"
cat > public/azure-backup/restore.js << 'EOL'
#!/usr/bin/env node
/**
 * Emergency restore script for Azure deployment
 * This script copies backup files from the public directory to their proper locations
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== ThinkForward Emergency File Restore ===');

// Define paths
const publicBackupDir = path.join(__dirname, 'scripts');
const scriptsDir = path.join(__dirname, '..', '..', 'scripts');
const tempDir = '/home/site/temp';

// Ensure directories exist
try {
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
    console.log(`Created scripts directory: ${scriptsDir}`);
  }
  
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    console.log(`Created temp directory: ${tempDir}`);
  }
} catch (err) {
  console.error(`Error creating directories: ${err.message}`);
}

// Copy files from backup to scripts directory
const criticalFiles = [
  'minimal-next-starter.js',
  'emergency-server.js',
  'comprehensive-nextjs-diagnostics.js',
  'create-direct-startup.sh'
];

console.log('Restoring files from backup...');
criticalFiles.forEach(file => {
  try {
    const srcPath = path.join(publicBackupDir, file);
    const destPath = path.join(scriptsDir, file);
    const tempPath = path.join(tempDir, file);
    
    if (fs.existsSync(srcPath)) {
      // Copy to scripts directory
      fs.copyFileSync(srcPath, destPath);
      fs.chmodSync(destPath, 0o755); // Make executable
      console.log(`Restored ${file} to scripts directory`);
      
      // Also copy to temp directory for immediate use
      fs.copyFileSync(srcPath, tempPath);
      fs.chmodSync(tempPath, 0o755); // Make executable
      console.log(`Copied ${file} to temp directory`);
    } else {
      console.error(`Backup file not found: ${srcPath}`);
    }
  } catch (err) {
    console.error(`Error restoring ${file}: ${err.message}`);
  }
});

console.log('File restoration complete.');

// Run the create-direct-startup.sh script if it was restored successfully
try {
  const scriptPath = path.join(scriptsDir, 'create-direct-startup.sh');
  if (fs.existsSync(scriptPath)) {
    console.log('Running create-direct-startup.sh...');
    execSync(`bash ${scriptPath}`, { stdio: 'inherit' });
    console.log('Startup script created successfully.');
  }
} catch (err) {
  console.error(`Error running startup script: ${err.message}`);
}
EOL

chmod +x public/azure-backup/restore.js
echo -e "${GREEN}Created emergency restore script at public/azure-backup/restore.js${NC}"
echo -e "${YELLOW}Step 1: Standardizing environment variables...${NC}"
if [[ -f "scripts/standardize-env-vars.sh" ]]; then
    chmod +x scripts/standardize-env-vars.sh
    ./scripts/standardize-env-vars.sh
else
    echo -e "${RED}Error: standardize-env-vars.sh script not found.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 2: Fixing Cosmos DB key issues...${NC}"
if [[ -f "scripts/fix-cosmos-key.sh" ]]; then
    chmod +x scripts/fix-cosmos-key.sh
    ./scripts/fix-cosmos-key.sh
else
    echo -e "${RED}Error: fix-cosmos-key.sh script not found.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 3: Fixing Azure App Service file system issues...${NC}"
if [[ -f "scripts/fix-azure-fs-issues.sh" ]]; then
    chmod +x scripts/fix-azure-fs-issues.sh
    ./scripts/fix-azure-fs-issues.sh
else
    echo -e "${RED}Error: fix-azure-fs-issues.sh script not found.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 4: Setting up the automated Azure environment...${NC}"
if [[ -f "scripts/automate-azure-setup.sh" ]]; then
    chmod +x scripts/automate-azure-setup.sh
    ./scripts/automate-azure-setup.sh
else
    echo -e "${RED}Error: automate-azure-setup.sh script not found.${NC}"
    exit 1
fi

echo -e "${BLUE}=== All preparation scripts completed! ===${NC}"
echo -e "${GREEN}Your Azure environment is now set up and fixed for deployment.${NC}"
echo -e "${GREEN}You can now deploy using GitHub Actions or manually.${NC}"

exit 0
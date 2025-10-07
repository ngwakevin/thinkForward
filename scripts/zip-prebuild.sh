#!/usr/bin/env bash
set -euo pipefail

# This script is used by GitHub Actions for Azure Web App deployment
# It builds the application and creates the deployment package

# Clean up any existing deployment artifacts
rm -f deploy.zip
rm -f startup.sh

# When running in GitHub Actions, we don't need these steps as they're already done in the workflow
# But we'll keep checking for critical files

# Verify that critical Next.js files exist
if [ ! -d "node_modules/next/dist/server" ]; then
  echo "ERROR: Next.js server directory is missing. Build may be corrupted."
  exit 1
fi

# Remove unnecessary files to reduce zip size
echo "Removing unnecessary files to reduce package size..."
find ./node_modules -type d -name "test" -o -name "tests" | xargs rm -rf
find ./node_modules -type d -name ".git" | xargs rm -rf
find ./node_modules -type f -name ".gitignore" -o -name "*.md" -o -name "LICENSE" | xargs rm -f

# Create startup command file for Azure App Service
echo "#!/bin/sh
cd /home/site/wwwroot
export NODE_ENV=production
# Default to port 8080 if PORT is not set by Azure
export PORT=\${PORT:-8080}

# Debug information to help troubleshoot
echo \"Starting app with:\"
echo \"- NODE_ENV: \$NODE_ENV\"
echo \"- PORT: \$PORT\"
echo \"- PWD: \$(pwd)\"
echo \"- Node version: \$(node -v)\"
echo \"- Next.js version: \$(cat package.json | grep \\\"next\\\":)\"
echo \"- NPM version: \$(npm -v)\"
echo \"- Memory info: \$(free -m || echo 'free command not available')\"
echo \"- Disk space: \$(df -h / || echo 'df command not available')\"
echo \"- Files in .next/server: \$(ls -la .next/server 2>/dev/null || echo '.next/server not found')\"

# Create temp directories if they don't exist (with error handling)
echo \"Creating temp directories if needed...\"
mkdir -p /tmp/nextjs-cache 2>/dev/null || echo \"Warning: Could not create /tmp/nextjs-cache. Using default temp directory.\"
mkdir -p /tmp/nextjs-server 2>/dev/null || echo \"Warning: Could not create /tmp/nextjs-server. Using default temp directory.\"

# Set Node.js options for better performance in containerized environment
export NODE_OPTIONS=\"\${NODE_OPTIONS:---max_old_space_size=512 --expose-gc}\"
echo \"- NODE_OPTIONS: \$NODE_OPTIONS\"

# Use the custom server.js instead of the next binary with ESM support
echo \"Starting with custom server: node server.js\"
node --experimental-specifier-resolution=node server.js || {
    echo \"ERROR: Failed to start server. Retrying in 5 seconds...\"
    sleep 5
    echo \"Retrying server start...\"
    node --experimental-specifier-resolution=node server.js
}

# Log successful startup
echo \"App started successfully at: \$(date)\"
echo \"Health check available at: http://localhost:\$PORT/api/health\"" > startup.sh
chmod +x startup.sh

# Add a note about the deployment package
echo "Creating deployment zip..."

# Ensure Azure placeholder files exist
echo "Ensuring Azure placeholder files exist..."
mkdir -p lib/azure
if [ ! -f "lib/azure/appinsights-config.js" ]; then
  echo "Creating placeholder for appinsights-config.js"
  cat > lib/azure/appinsights-config.js << EOL
// This is a placeholder for Application Insights configuration
// It ensures the server can start even if the actual configuration is missing
console.log('Using placeholder Application Insights configuration');

// Export an empty configuration
export const appInsightsClient = null;
export const setup = () => console.log('Application Insights setup skipped (placeholder)');
export default { 
  appInsightsClient: null,
  setup: () => console.log('Application Insights setup skipped (placeholder)')
};
EOL
fi

if [ ! -f "lib/azure/initialize-services.js" ]; then
  echo "Creating placeholder for initialize-services.js"
  cat > lib/azure/initialize-services.js << EOL
// This is a placeholder for Azure services initialization
// It ensures the server can start even if the actual implementation is missing
console.log('Using placeholder Azure services initialization');

// Export an empty initialization function
export const initializeAzureServices = async () => {
  console.log('Azure services initialization skipped (placeholder)');
  return { status: 'skipped', message: 'Using placeholder implementation' };
};

export default { 
  initializeAzureServices 
};
EOL
fi

# Create deployment package including all necessary files with maximum compression
# Make sure to include next.js specific directories (.next, public) and our custom server
echo "Creating optimized deployment package with maximum compression..."
zip -9 -r deploy.zip package.json package-lock.json next.config.mjs node_modules .next public scripts config lib app components data content startup.sh server.js tailwind.config.mjs postcss.config.mjs

# Check the size of the deployment package
PACKAGE_SIZE=$(du -h deploy.zip | cut -f1)
echo "Created deploy.zip (${PACKAGE_SIZE}) for GitHub Actions deployment"

# Check the size of the deployment package
PACKAGE_SIZE=$(du -h deploy.zip | cut -f1)
echo "Created deploy.zip (${PACKAGE_SIZE}) for GitHub Actions deployment"

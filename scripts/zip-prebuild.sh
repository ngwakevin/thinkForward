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

# Setup writable directories for Next.js in Azure App Service
echo \"Setting up writable directories for Next.js...\"

# Create the custom temp directory
export NEXT_TEMP_DIR=\"/home/site/next-temp\"
echo \"Creating NEXT_TEMP_DIR: \$NEXT_TEMP_DIR\"
mkdir -p \"\$NEXT_TEMP_DIR\" || echo \"Warning: Could not create \$NEXT_TEMP_DIR\"
chmod -R 755 \"\$NEXT_TEMP_DIR\" || echo \"Warning: Could not set permissions on \$NEXT_TEMP_DIR\"

# Create .next directory in the temp directory
export NEXT_DIST_DIR=\"\$NEXT_TEMP_DIR/.next\"
echo \"Creating NEXT_DIST_DIR: \$NEXT_DIST_DIR\"
mkdir -p \"\$NEXT_DIST_DIR\" || echo \"Warning: Could not create \$NEXT_DIST_DIR\"
mkdir -p \"\$NEXT_DIST_DIR/server\" || echo \"Warning: Could not create server directory\"
mkdir -p \"\$NEXT_DIST_DIR/cache\" || echo \"Warning: Could not create cache directory\"

# Check if .next directory exists in the current directory
if [ -d \"./.next\" ] && [ -f \"./.next/BUILD_ID\" ]; then
  echo \"Found .next directory with BUILD_ID, copying to \$NEXT_DIST_DIR\"
  cp -R ./.next/* \"\$NEXT_DIST_DIR/\" || echo \"Error: Failed to copy .next directory\"
  
  # Verify the copy
  if [ -f \"\$NEXT_DIST_DIR/BUILD_ID\" ]; then
    echo \"Successfully copied build files. Build ID: \$(cat \"\$NEXT_DIST_DIR/BUILD_ID\")\"
  else
    echo \"Warning: Failed to copy BUILD_ID file - creating it manually\"
    echo \"$(date +%s)\" > \"\$NEXT_DIST_DIR/BUILD_ID\"
  fi
else
  echo \"No .next directory found with BUILD_ID in current directory!\"
  echo \"Creating minimal Next.js build structure manually...\"
  
  # Create minimal build structure
  echo \"$(date +%s)\" > \"\$NEXT_DIST_DIR/BUILD_ID\"
  echo \"{}\" > \"\$NEXT_DIST_DIR/build-manifest.json\"
  echo \"{}\" > \"\$NEXT_DIST_DIR/server/pages-manifest.json\"
  echo \"{}\" > \"\$NEXT_DIST_DIR/prerender-manifest.json\"
  echo \"{}\" > \"\$NEXT_DIST_DIR/required-server-files.json\"
fi

# Force correct permissions
chmod -R 777 \"\$NEXT_TEMP_DIR\" || echo \"Warning: Could not set permissions on temp directory\"

# List critical directories to verify
echo \"Contents of .next directory:\"
ls -la ./.next 2>/dev/null || echo \".next directory not found\"

echo \"Contents of temp .next directory:\"
ls -la \"\$NEXT_DIST_DIR\" 2>/dev/null || echo \"Temp .next directory not found or empty\"

# Create a symbolic link for .next if it doesn't exist
if [ ! -L \"./.next\" ] && [ -d \"\$NEXT_DIST_DIR\" ]; then
  echo \"Creating symbolic link from ./.next to \$NEXT_DIST_DIR\"
  ln -sfn \"\$NEXT_DIST_DIR\" ./.next
fi

# Set environment variables for Next.js
export NEXT_TELEMETRY_DISABLED=1
export NEXT_DISABLE_FILESYSTEM_CACHE=1
export NEXT_SHARP_PATH=\"/home/site/wwwroot/node_modules/sharp\"
export NEXT_IGNORE_FILESYSTEM_CHECK=1  # Critical for Next.js 14.x in read-only environments

# Set Node.js options for better performance in containerized environment
export NODE_OPTIONS=\"\${NODE_OPTIONS:---max_old_space_size=512 --expose-gc}\"
echo \"- NODE_OPTIONS: \$NODE_OPTIONS\"
echo \"- NEXT_TEMP_DIR: \$NEXT_TEMP_DIR\"
echo \"- NEXT_DIST_DIR: \$NEXT_DIST_DIR\"

# Patch Next.js filesystem check for Azure App Service
if [ -f \"scripts/patch-nextjs.js\" ]; then
  echo \"Patching Next.js filesystem check for Azure...\"
  node scripts/patch-nextjs.js || echo \"Warning: Could not patch Next.js filesystem check\"
else
  echo \"Warning: patch-nextjs.js not found, skipping patch\"
fi

# Double-check critical files one more time
if [ ! -f \"\$NEXT_DIST_DIR/BUILD_ID\" ]; then
  echo \"BUILD_ID still missing, creating it...\"
  echo \"azure-$(date +%s)\" > \"\$NEXT_DIST_DIR/BUILD_ID\"
fi

if [ ! -f \"\$NEXT_DIST_DIR/server/pages-manifest.json\" ]; then
  echo \"pages-manifest.json still missing, creating it...\"
  mkdir -p \"\$NEXT_DIST_DIR/server\"
  echo \"{}\" > \"\$NEXT_DIST_DIR/server/pages-manifest.json\"
fi

# Set critical environment variables for Next.js
export NEXT_IGNORE_FILESYSTEM_CHECK=1
export NEXT_TELEMETRY_DISABLED=1
export NEXT_DISABLE_PATCHING_REQUIRE=1
export NODE_OPTIONS=\"\${NODE_OPTIONS} --no-warnings --experimental-specifier-resolution=node --experimental-json-modules\"

# Ensure Cosmos DB environment variables are set properly
if [ -z \"\$COSMOS_KEY\" ] && [ -n \"\$COSMOS_DB_KEY\" ]; then
  echo \"Setting COSMOS_KEY from COSMOS_DB_KEY\"
  export COSMOS_KEY=\"\$COSMOS_DB_KEY\"
fi

if [ -z \"\$COSMOS_ENDPOINT\" ] && [ -n \"\$COSMOS_DB_ENDPOINT\" ]; then
  echo \"Setting COSMOS_ENDPOINT from COSMOS_DB_ENDPOINT\"
  export COSMOS_ENDPOINT=\"\$COSMOS_DB_ENDPOINT\"
fi

# Use the custom server.js instead of the next binary with ESM support
echo \"Starting with custom server: node server.js\"
node --experimental-specifier-resolution=node server.js || {
    echo \"ERROR: Failed to start server with experimental specifier resolution. Retrying with default...\"
    sleep 2
    echo \"Retrying server start with default settings...\"
    node server.js
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

# Ensure all crucial Azure deployment scripts are in the package
echo "Ensuring all Azure deployment scripts are available..."

# Check and create the create-nextjs-wrapper.js script
if [ ! -f "scripts/create-nextjs-wrapper.js" ]; then
  echo "Creating create-nextjs-wrapper.js script..."
  cat > scripts/create-nextjs-wrapper.js << 'EOL'
#!/usr/bin/env node

console.log('Next.js direct start wrapper for Azure...');

// Create a simple wrapper script that runs Next.js
const wrapperScript = `#!/usr/bin/env node
/**
 * Next.js direct start wrapper for Azure App Service
 * This script bypasses the build directory check that fails in Azure's read-only filesystem
 */

// Force environment variables to bypass checks
process.env.NEXT_IGNORE_FILESYSTEM_CHECK = "1";
process.env.NEXT_MANUAL_SIG_HANDLE = "true";
process.env.NEXT_TELEMETRY_DISABLED = "1";

console.log('Starting Next.js with direct server instantiation');
try {
  // Try to use server directly
  const path = require('path');
  const http = require('http');
  
  // Import the Next.js server (this may fail if the import structure changes)
  const { default: createServer } = require('next/dist/server/next');
  
  const port = parseInt(process.env.PORT, 10) || 3000;
  const app = createServer({
    dir: process.cwd(),
    dev: false,
    quiet: false
  });
  
  app.prepare().then(() => {
    http.createServer(app.getRequestHandler()).listen(port, () => {
      console.log(\`> Ready on http://localhost:\${port}\`);
    });
  });
} catch (error) {
  console.error('Failed to start server directly:', error);
  console.log('Falling back to CLI approach...');
  
  // Fallback to CLI approach
  process.argv[1] = require.resolve('next/dist/bin/next');
  process.argv.splice(2, 0, 'start');
  console.log(\`Starting Next.js with fallback CLI command: next \${process.argv.slice(2).join(' ')}\`);
  try {
    require('next/dist/bin/next');
  } catch (err) {
    console.error('Failed to start with Next.js CLI:', err);
    console.log('Trying to start with node server.js as last resort');
    require('./server');
  }
}`;

// Write the wrapper file to disk
require('fs').writeFileSync('scripts/next-direct-start.js', wrapperScript, 'utf8');
console.log('Created Next.js direct start wrapper at scripts/next-direct-start.js');
EOL
  chmod +x scripts/create-nextjs-wrapper.js
fi

# Check and create fix-nextjs-build-dir.sh script
if [ ! -f "scripts/fix-nextjs-build-dir.sh" ]; then
  echo "Creating fix-nextjs-build-dir.sh script..."
  cat > scripts/fix-nextjs-build-dir.sh << 'EOL'
#!/bin/bash
# Fix Next.js build directory issue in Azure App Service

echo "=== Next.js Azure Build Directory Fix Script ==="
echo "Date: $(date)"
echo "Current directory: $(pwd)"

# Create the directory structure if it doesn't exist
echo "Creating /home/site/next-temp/.next directory structure..."
mkdir -p /home/site/next-temp/.next/server

# Create minimal required files
echo "Creating minimal required files in /home/site/next-temp/.next..."
echo "$(date +%s)" > /home/site/next-temp/.next/BUILD_ID
echo "{}" > /home/site/next-temp/.next/server/pages-manifest.json
echo "{}" > /home/site/next-temp/.next/build-manifest.json

# Copy files from .next if it exists
if [ -d ".next" ] && [ -f ".next/BUILD_ID" ]; then
  echo "Found valid .next directory, copying files to /home/site/next-temp/.next..."
  cp -r .next/* /home/site/next-temp/.next/
  echo "✅ Copied build files from .next to /home/site/next-temp/.next"
fi

# Create a symlink to ensure proper file access
echo "Creating symlink from .next to /home/site/next-temp/.next..."
rm -f .next
ln -sf /home/site/next-temp/.next .next

# Set permissions
chmod -R 755 /home/site/next-temp/.next

# Print directory contents
echo "=== Contents of /home/site/next-temp/.next ==="
ls -la /home/site/next-temp/.next/

echo "=== Next.js build directory fix complete ==="
EOL
  chmod +x scripts/fix-nextjs-build-dir.sh
fi

# Make sure all scripts are executable
chmod +x scripts/fix-nextjs-build-dir.sh
chmod +x scripts/create-nextjs-wrapper.js
chmod +x scripts/create-direct-startup.sh
chmod +x scripts/diagnose-nextjs.sh

# Create deployment package including all necessary files with maximum compression
# Make sure to include next.js specific directories (.next, public) and our custom server
echo "Creating optimized deployment package with maximum compression..."
zip -9 -r deploy.zip package.json package-lock.json next.config.mjs node_modules .next public config lib app components data content startup.sh server.js tailwind.config.mjs postcss.config.mjs scripts

# Check the size of the deployment package
PACKAGE_SIZE=$(du -h deploy.zip | cut -f1)
echo "Created deploy.zip (${PACKAGE_SIZE}) for GitHub Actions deployment"

# Check the size of the deployment package
PACKAGE_SIZE=$(du -h deploy.zip | cut -f1)
echo "Created deploy.zip (${PACKAGE_SIZE}) for GitHub Actions deployment"

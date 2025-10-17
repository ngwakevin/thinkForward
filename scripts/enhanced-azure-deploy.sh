#!/bin/bash
# Enhanced Azure deployment script for Next.js standalone mode
# This script addresses common issues with Next.js standalone deployment in Azure App Service

set -e  # Exit immediately if any command fails

echo "🚀 Enhanced Next.js Azure Deployment Process"
echo "----------------------------------------"

# Step 1: Environment setup
echo "✅ Setting up environment..."
export NODE_ENV=production
export PORT=8080
export HOSTNAME=0.0.0.0

# Step 2: Clean previous build artifacts
echo "✅ Cleaning previous builds..."
rm -rf .next || true
rm -rf standalone || true
rm -rf .output || true

# Step 3: Install dependencies if needed
if [ ! -d "node_modules" ] || [ "$1" == "--force-install" ]; then
  echo "✅ Installing dependencies..."
  npm ci --production=false
else
  echo "✅ Using existing node_modules..."
fi

# Step 4: Build the application with standalone output
echo "✅ Building Next.js application in standalone mode..."
npx next build

# Step 5: Verify the build output
if [ ! -d ".next/standalone" ]; then
  echo "❌ ERROR: Next.js standalone build failed. .next/standalone directory not found!"
  echo "Make sure your next.config.mjs has output: 'standalone' set."
  exit 1
fi

echo "✅ Verifying standalone build structure..."
find .next/standalone -type f | grep -q "server.js" || { echo "❌ ERROR: server.js not found in standalone output!"; exit 1; }

# Step 6: Prepare for Azure App Service
echo "✅ Preparing files for Azure App Service..."

# Create startup.sh script for Azure
cat > startup.sh << 'EOL'
#!/bin/bash
echo "Starting ThinkForward on Azure App Service"
echo "- NODE_ENV: $NODE_ENV"
echo "- PORT: $PORT"
echo "- HOSTNAME: $HOSTNAME"
echo "- Node version: $(node -v)"

echo "Verifying supporting assets..."
ls -la
ls -la .next/static
ls -la public

echo "Preparing writable runtime directory at /home/site/temp/thinkforward-runtime"
mkdir -p /home/site/temp/thinkforward-runtime

echo "Copying standalone server into runtime directory"
cp -r .next/standalone/* /home/site/temp/thinkforward-runtime/
mkdir -p /home/site/temp/thinkforward-runtime/.next

echo "Syncing static assets into runtime directory (.next/static)"
mkdir -p /home/site/temp/thinkforward-runtime/.next/static
cp -r .next/static /home/site/temp/thinkforward-runtime/.next/

echo "Syncing public assets into runtime directory"
mkdir -p /home/site/temp/thinkforward-runtime/public
cp -r public/* /home/site/temp/thinkforward-runtime/public/

echo "Copying required app routes to runtime"
mkdir -p /home/site/temp/thinkforward-runtime/.next/server/app
cp -r .next/server/app /home/site/temp/thinkforward-runtime/.next/server/

echo "Copying required pages to runtime"
mkdir -p /home/site/temp/thinkforward-runtime/.next/server/pages
cp -r .next/server/pages /home/site/temp/thinkforward-runtime/.next/server/

# Additional debugging - list contents to verify
echo "Verifying runtime directory contents:"
find /home/site/temp/thinkforward-runtime/.next -type d | sort

echo "Launching Next.js standalone server from writable runtime..."
cd /home/site/temp/thinkforward-runtime
NODE_ENV=production PORT=$PORT node server.js
EOL

chmod +x startup.sh

# Step 7: Create web.config for IIS (Azure's Windows-based App Service)
echo "✅ Creating web.config for Azure App Service..."
cat > web.config << 'EOL'
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="startup.sh" verb="*" modules="iisnode" />
    </handlers>

    <rewrite>
      <rules>
        <rule name="NextJsStandalone">
          <match url="/*" />
          <action type="Rewrite" url="startup.sh" />
        </rule>
      </rules>
    </rewrite>

    <iisnode 
      nodeProcessCommandLine="bash"
      watchedFiles="web.config;*.js;*.json;*.sh"
      loggingEnabled="true" 
      logDirectory="iisnode" 
      debuggingEnabled="true" 
      debugHeaderEnabled="false"
      flushResponse="true" />

    <staticContent>
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <mimeMap fileExtension=".woff" mimeType="application/font-woff" />
      <mimeMap fileExtension=".woff2" mimeType="application/font-woff2" />
    </staticContent>

    <security>
      <requestFiltering removeServerHeader="true">
        <requestLimits maxAllowedContentLength="1073741824" />
      </requestFiltering>
    </security>
  </system.webServer>
</configuration>
EOL

# Step 8: Ensure Next.js config has standalone output mode
echo "✅ Verifying Next.js configuration..."
if ! grep -q "'standalone'" next.config.mjs && ! grep -q '"standalone"' next.config.mjs; then
  echo "⚠️ Warning: Standalone output mode might not be configured in next.config.mjs"
  echo "Please ensure your next.config.mjs contains: output: 'standalone'"
fi

# Step 9: Create a dotenv file for production (if it doesn't exist)
if [ ! -f ".env.production" ]; then
  echo "✅ Creating sample .env.production file..."
  cat > .env.production << 'EOL'
# Production environment variables
NODE_ENV=production
EOL
  echo "⚠️ Warning: Created a basic .env.production file. Please update with your actual values."
fi

echo "✅ Deployment preparation complete!"
echo ""
echo "To deploy to Azure App Service:"
echo "1. Commit these changes to your repository"
echo "2. Push to Azure App Service using:"
echo "   git push azure main"
echo ""
echo "Or deploy via Azure Portal or GitHub Actions"
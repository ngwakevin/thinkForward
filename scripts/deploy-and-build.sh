#!/bin/bash
# deploy-and-build.sh
# Handles the Next.js build process for Azure App Service deployment

set -e # Exit on error

echo "=== ThinkForward Next.js Build and Deploy Script ==="
echo "Starting deployment at $(date)"

# Check if running in Azure DevOps pipeline
if [ -n "$AGENT_WORKFOLDER" ]; then
  echo "Running in Azure DevOps pipeline environment"
  IS_PIPELINE=true
else
  echo "Running in local or other environment"
  IS_PIPELINE=false
fi

# Make sure we're in the project directory
if [ -f "package.json" ]; then
  echo "Found package.json in current directory"
else
  echo "Error: package.json not found in current directory"
  echo "Make sure you're running this script from the project root"
  exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm ci || npm install
else
  echo "Node modules already installed"
fi

# Build the application
echo "Building Next.js application..."
npm run build

# Verify the build
if [ -d ".next" ]; then
  echo "Build successful, .next directory created"
  
  if [ -f ".next/BUILD_ID" ]; then
    BUILD_ID=$(cat .next/BUILD_ID)
    echo "Build ID: $BUILD_ID"
  else
    echo "Warning: .next/BUILD_ID not found"
  fi
  
  # Count files in build directory
  FILE_COUNT=$(find .next -type f | wc -l)
  echo "Build contains $FILE_COUNT files"
  
  # Check for critical files
  for file in "build-manifest.json" "server/pages-manifest.json" "BUILD_ID"; do
    if [ -f ".next/$file" ]; then
      echo "Found critical file: $file"
    else
      echo "Warning: Missing critical file: $file"
    fi
  done
else
  echo "Error: Build failed, .next directory not found"
  exit 1
fi

# If we're deploying to Azure, prepare the files for deployment
if [ "$IS_PIPELINE" = true ] || [ "$1" = "--prepare-azure" ]; then
  echo "Preparing files for Azure App Service deployment..."
  
  # Create the standalone build if using Next.js standalone output
  if grep -q '"output": *"standalone"' next.config.mjs || grep -q '"output": *"standalone"' next.config.js; then
    echo "Creating standalone build..."
    
    # Make sure the .next/standalone directory exists
    if [ -d ".next/standalone" ]; then
      echo "Standalone build found at .next/standalone"
    else
      echo "Error: Standalone build directory not found at .next/standalone"
      echo "Check your next.config.js output configuration"
      exit 1
    fi
    
    # Copy the standalone build to the deployment directory
    mkdir -p .azure-deploy
    cp -R .next/standalone/* .azure-deploy/
    cp -R .next/static .azure-deploy/.next/
    
    echo "Standalone build copied to .azure-deploy directory"
  else
    echo "Not using standalone output, copying full project for deployment"
    mkdir -p .azure-deploy
    
    # Copy essential files and directories
    cp -R .next .azure-deploy/
    cp -R node_modules .azure-deploy/
    cp -R public .azure-deploy/
    cp package.json .azure-deploy/
    cp server.js .azure-deploy/
    cp startup.sh .azure-deploy/
    
    echo "Project files copied to .azure-deploy directory"
  fi
  
  # Create a web.config file for Azure
  cat > .azure-deploy/web.config << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<!--
     This configuration file is required if iisnode is used to run node processes behind
     IIS or IIS Express. For more information, visit:
     https://github.com/tjanczuk/iisnode/blob/master/src/samples/configuration/web.config
-->

<configuration>
  <system.webServer>
    <webSocket enabled="false" />
    <handlers>
      <!-- Indicates that the server.js file is a node.js site to be handled by the iisnode module -->
      <add name="iisnode" path="startup.sh" verb="*" modules="iisnode" />
    </handlers>
    <rewrite>
      <rules>
        <!-- Do not interfere with requests for node-inspector debugging -->
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^server.js\/debug[\/]?" />
        </rule>

        <!-- First we consider whether the incoming URL matches a physical file in the /public folder -->
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}" />
        </rule>

        <!-- All other URLs are mapped to the node.js site entry point -->
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True" />
          </conditions>
          <action type="Rewrite" url="startup.sh" />
        </rule>
      </rules>
    </rewrite>

    <!-- 'bin' directory has no special meaning in node.js and apps can be placed in it -->
    <security>
      <requestFiltering>
        <hiddenSegments>
          <remove segment="bin" />
        </hiddenSegments>
      </requestFiltering>
    </security>

    <!-- Make sure error responses are left untouched -->
    <httpErrors existingResponse="PassThrough" />

    <!--
      You can control how Node is hosted within IIS using the following options:
        * watchedFiles: semi-colon separated list of files that will be watched for changes to restart the server
        * node_env: will be propagated to node as NODE_ENV environment variable
        * debuggingEnabled - controls whether the built-in debugger is enabled
      See https://github.com/tjanczuk/iisnode/blob/master/src/samples/configuration/web.config for a full list of options
    -->
    <iisnode watchedFiles="web.config;*.js;*.mjs" node_env="%node_env%" />
  </system.webServer>
</configuration>
EOF
  
  echo "Created web.config for Azure App Service"
  
  # Create a deployment script that will ensure proper setup on Azure
  cat > .azure-deploy/deploy.sh << 'EOF'
#!/bin/bash
echo "Running ThinkForward deployment script..."

# Create necessary directories
mkdir -p /home/site/next-temp
mkdir -p /home/site/next-temp/.next
mkdir -p /home/site/next-temp/cache
chmod -R 755 /home/site/next-temp

# Copy the build to the temp directory
if [ -d ".next" ]; then
  echo "Copying .next to /home/site/next-temp/.next"
  cp -R .next/* /home/site/next-temp/.next/
fi

# Set up environment
echo "Setting up environment variables"
export NEXT_TEMP_DIR="/home/site/next-temp"
export NEXT_CACHE_DIR="/home/site/next-temp/cache"
export NEXT_DIST_DIR="/home/site/next-temp/.next"
export NEXT_DISABLE_FILESYSTEM_CACHE=1

echo "Deployment script complete"
EOF
  
  chmod +x .azure-deploy/deploy.sh
  echo "Created deploy.sh script"
  
  echo "Deployment preparation complete"
fi

echo "Next.js build and deployment script completed successfully!"
exit 0
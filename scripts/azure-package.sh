#!/bin/bash
# azure-package.sh - Create a deployment package for Azure App Service

echo "=== Creating Azure App Service Deployment Package ==="
echo "Starting at: $(date)"

# Ensure we're in the project root directory
if [ ! -f "package.json" ]; then
  echo "Error: package.json not found. Make sure you're running this script from the project root."
  exit 1
fi

# Create a deployment directory
DEPLOY_DIR="azure-deploy"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"
echo "Created deployment directory: $DEPLOY_DIR"

# Build the Next.js application if not already built
if [ ! -d ".next" ]; then
  echo "Building Next.js application..."
  npm run build
else
  echo "Using existing Next.js build"
fi

# Check for build output
if [ ! -d ".next" ]; then
  echo "Error: Next.js build failed or .next directory not found"
  exit 1
fi

echo "Next.js build found at .next"
echo "BUILD_ID: $(cat .next/BUILD_ID)"

# Determine if we're using standalone output
if [ -d ".next/standalone" ]; then
  echo "Detected standalone output mode"
  USE_STANDALONE=true
else
  echo "Not using standalone output mode"
  USE_STANDALONE=false
fi

# Copy files to deployment directory
if [ "$USE_STANDALONE" = true ]; then
  echo "Copying standalone build..."
  
  # Copy the standalone build
  cp -R .next/standalone/* "$DEPLOY_DIR/"
  
  # Copy static files which aren't included in standalone
  mkdir -p "$DEPLOY_DIR/.next/static"
  cp -R .next/static "$DEPLOY_DIR/.next/"
  
  echo "Copied standalone build to $DEPLOY_DIR"
else
  echo "Copying regular build..."
  
  # Copy essential files for a regular build
  cp -R .next "$DEPLOY_DIR/"
  cp -R node_modules "$DEPLOY_DIR/"
  cp package.json "$DEPLOY_DIR/"
  cp package-lock.json "$DEPLOY_DIR/" 2>/dev/null || echo "No package-lock.json found"
  
  # Copy public directory if it exists
  if [ -d "public" ]; then
    cp -R public "$DEPLOY_DIR/"
  fi
  
  echo "Copied regular build to $DEPLOY_DIR"
fi

# Copy our special Azure files
cp azure-startup.sh "$DEPLOY_DIR/startup.sh"
cp azure-server.js "$DEPLOY_DIR/server.js"
cp next.config.azure.js "$DEPLOY_DIR/next.config.js"

echo "Copied Azure-specific configuration files"

# Create a web.config file for Azure App Service
cat > "$DEPLOY_DIR/web.config" << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <webSocket enabled="false" />
    <handlers>
      <add name="iisnode" path="startup.sh" verb="*" modules="iisnode" />
    </handlers>
    <rewrite>
      <rules>
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}" />
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True" />
          </conditions>
          <action type="Rewrite" url="startup.sh" />
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering>
        <hiddenSegments>
          <remove segment="bin" />
        </hiddenSegments>
      </requestFiltering>
    </security>
    <httpErrors existingResponse="PassThrough" />
    <iisnode watchedFiles="web.config;*.js" node_env="production" />
  </system.webServer>
</configuration>
EOF

echo "Created web.config for Azure App Service"

# Create a README file with instructions
cat > "$DEPLOY_DIR/AZURE-DEPLOYMENT-README.md" << 'EOF'
# Azure App Service Deployment Package

This is a specially prepared deployment package for Azure App Service. It includes:

1. The Next.js application build
2. A custom startup script (`startup.sh`) that handles Azure's read-only filesystem
3. A simplified server.js file optimized for Azure
4. A web.config file for Azure App Service

## Deployment Instructions

### Using the Azure Portal

1. Go to your Azure App Service in the Azure Portal
2. Navigate to Configuration > General Settings
3. Set the Startup Command to: `./startup.sh`
4. Save the configuration
5. Go to Deployment Center
6. Upload this deployment package as a ZIP file

### Using Azure CLI

```bash
# Zip the deployment package
cd azure-deploy
zip -r ../azure-deploy.zip *

# Deploy to Azure
az webapp deployment source config-zip --resource-group YOUR_RESOURCE_GROUP --name YOUR_APP_NAME --src ../azure-deploy.zip
```

## Troubleshooting

If you encounter issues:

1. Check the application logs in the Azure Portal
2. Look for "Next.js build directory exists" in the logs
3. Verify the startup command is set to `./startup.sh`
EOF

echo "Created deployment instructions README"

# Zip up the deployment package
echo "Creating deployment ZIP file..."
cd "$DEPLOY_DIR"
zip -r "../$DEPLOY_DIR.zip" * -q
cd ..

echo "✅ Azure deployment package created successfully!"
echo "- Deployment directory: $DEPLOY_DIR"
echo "- Deployment ZIP: $DEPLOY_DIR.zip"
echo "Completed at: $(date)"
echo ""
echo "Next steps:"
echo "1. Set the startup command to './startup.sh' in Azure App Service Configuration"
echo "2. Deploy the $DEPLOY_DIR.zip file to your Azure App Service"
echo ""
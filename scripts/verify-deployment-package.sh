#!/bin/bash
# This script verifies the content of a deployment package (ZIP file)
# before it is uploaded to Azure App Service.
# It checks for the presence of critical files needed for the application to start.

set -e

# Check if a deployment package was provided
if [ -z "$1" ]; then
  echo "Usage: $0 <path-to-deploy.zip>"
  echo "Example: $0 deploy.zip"
  exit 1
fi

DEPLOY_ZIP="$1"

# Check if the deployment package exists
if [ ! -f "$DEPLOY_ZIP" ]; then
  echo "ERROR: Deployment package not found: $DEPLOY_ZIP"
  exit 1
fi

echo "=== ThinkForward Deployment Package Verification ==="
echo "Date: $(date)"
echo "Verifying package: $DEPLOY_ZIP"

# Define critical files that must be present
CRITICAL_FILES=(
  "scripts/minimal-next-starter.js"
  "scripts/emergency-server.js"
  "scripts/comprehensive-nextjs-diagnostics.js"
  "scripts/create-direct-startup.sh"
  "scripts/fix-nextjs-build-dir.sh"
  "scripts/resolve-next-modules.js"
  "scripts/copy-critical-files-to-temp.sh"
  "server.js"
  "next.config.mjs"
  "package.json"
  "startup.sh"
)

# Check if unzip is available
if ! command -v unzip &> /dev/null; then
  echo "ERROR: unzip command not found. Please install it to verify the package."
  exit 1
fi

# Create a temp directory for verification
TEMP_DIR=$(mktemp -d)
echo "Using temp directory: $TEMP_DIR"

# Function to clean up temp directory
cleanup() {
  echo "Cleaning up temporary files..."
  rm -rf "$TEMP_DIR"
}

# Register cleanup function on script exit
trap cleanup EXIT

# Get basic info about the package
PACKAGE_SIZE=$(du -h "$DEPLOY_ZIP" | cut -f1)
TOTAL_FILES=$(unzip -l "$DEPLOY_ZIP" | tail -1 | awk '{print $2}')

echo "Package size: $PACKAGE_SIZE"
echo "Total files: $TOTAL_FILES"

# Check for critical files
echo "Checking for critical files..."
MISSING_FILES=0
WARNING_COLOR="\033[1;33m"
ERROR_COLOR="\033[1;31m"
SUCCESS_COLOR="\033[1;32m"
RESET_COLOR="\033[0m"

for file in "${CRITICAL_FILES[@]}"; do
  if unzip -l "$DEPLOY_ZIP" "$file" > /dev/null 2>&1; then
    echo -e "${SUCCESS_COLOR}✓${RESET_COLOR} Found $file"
    
    # Extract the file to temp directory to check its content
    unzip -q -o "$DEPLOY_ZIP" "$file" -d "$TEMP_DIR"
    
    # Check if the file is empty or too small
    FILE_SIZE=$(wc -c < "$TEMP_DIR/$file")
    if [ "$FILE_SIZE" -lt 10 ]; then
      echo -e "${WARNING_COLOR}⚠${RESET_COLOR} WARNING: $file is suspiciously small ($FILE_SIZE bytes)"
    fi
  else
    echo -e "${ERROR_COLOR}✗${RESET_COLOR} MISSING: $file"
    MISSING_FILES=$((MISSING_FILES + 1))
  fi
done

# Check startup.sh specifically for references to critical files
if unzip -l "$DEPLOY_ZIP" "startup.sh" > /dev/null 2>&1; then
  echo "Checking startup.sh for references to critical scripts..."
  unzip -q -o "$DEPLOY_ZIP" "startup.sh" -d "$TEMP_DIR"
  
  # Check for references to minimal-next-starter.js
  if grep -q "minimal-next-starter.js" "$TEMP_DIR/startup.sh"; then
    echo -e "${SUCCESS_COLOR}✓${RESET_COLOR} startup.sh references minimal-next-starter.js"
  else
    echo -e "${WARNING_COLOR}⚠${RESET_COLOR} WARNING: startup.sh does not reference minimal-next-starter.js"
  fi
  
  # Check for references to emergency-server.js
  if grep -q "emergency-server.js" "$TEMP_DIR/startup.sh"; then
    echo -e "${SUCCESS_COLOR}✓${RESET_COLOR} startup.sh references emergency-server.js"
  else
    echo -e "${WARNING_COLOR}⚠${RESET_COLOR} WARNING: startup.sh does not reference emergency-server.js"
  fi
fi

# Check if node_modules/next is present
if unzip -l "$DEPLOY_ZIP" "node_modules/next/package.json" > /dev/null 2>&1; then
  echo -e "${SUCCESS_COLOR}✓${RESET_COLOR} Next.js package found in node_modules"
else
  echo -e "${WARNING_COLOR}⚠${RESET_COLOR} WARNING: Next.js package not found in node_modules"
fi

# Check if critical Next.js files are present
if unzip -l "$DEPLOY_ZIP" "node_modules/next/dist/server/next.js" > /dev/null 2>&1; then
  echo -e "${SUCCESS_COLOR}✓${RESET_COLOR} Next.js server module found"
else
  echo -e "${WARNING_COLOR}⚠${RESET_COLOR} WARNING: Next.js server module not found"
fi

# Provide summary
echo "=== Verification Summary ==="
if [ $MISSING_FILES -eq 0 ]; then
  echo -e "${SUCCESS_COLOR}✓ All critical files are present in the deployment package${RESET_COLOR}"
  echo "The package appears to be ready for deployment to Azure App Service."
else
  echo -e "${ERROR_COLOR}✗ $MISSING_FILES critical files are missing from the deployment package${RESET_COLOR}"
  echo "The package may not deploy successfully to Azure App Service."
  echo "Please fix the issues before deploying."
  exit 1
fi

echo "Verification completed successfully at $(date)"
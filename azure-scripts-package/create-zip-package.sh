#!/bin/bash
#
# create-zip-package.sh
#
# Creates a zip file of the Azure scripts for easy upload
#

echo "Creating Azure scripts package..."

# Ensure we're in the right directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Make scripts executable
chmod +x *.js *.sh

# Create the zip file
ZIP_FILE="../azure-scripts.zip"
zip -r "$ZIP_FILE" .

# Output success message
if [ $? -eq 0 ]; then
  echo "Success! Package created at: $ZIP_FILE"
  echo "Upload this file to Azure using the Kudu console or App Service Editor"
  echo "Then extract it using: unzip azure-scripts.zip -d /home/site/temp/"
else
  echo "Failed to create zip file."
  exit 1
fi
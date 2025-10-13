#!/bin/bash
#
# test-minimal-starter.sh
#
# This script tests the minimal-next-starter.js locally
#

echo "=== Testing minimal-next-starter.js ==="

# Set PORT environment variable if not set
if [ -z "$PORT" ]; then
  export PORT=3000
  echo "Setting PORT to $PORT"
fi

# Force development environment for testing
export NODE_ENV=development

# Run the script
echo "Starting minimal-next-starter.js..."
node ./minimal-next-starter.js

# This script will keep running until Ctrl+C is pressed
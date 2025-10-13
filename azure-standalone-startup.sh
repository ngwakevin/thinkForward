#!/bin/bash
# Azure App Service startup script for Next.js standalone mode

echo "Starting Next.js application in standalone mode"
echo "Node version: $(node --version)"
echo "Current directory: $(pwd)"

# Set PORT from environment or use default
PORT=${PORT:-8080}
echo "Using PORT: $PORT"

# Set the host binding to 0.0.0.0 to listen on all interfaces
export HOSTNAME="0.0.0.0"

# Check if we're in the standalone directory
if [ -f ".next/standalone/server.js" ]; then
  # Run the standalone server
  exec node .next/standalone/server.js
elif [ -f "server.js" ]; then
  # Try using the server.js in the root directory
  echo "Standalone server not found, using root server.js"
  exec node server.js
else
  # Fallback to minimal-next-starter.js in /home/site/temp if available
  if [ -f "/home/site/temp/minimal-next-starter.js" ]; then
    echo "Using emergency minimal-next-starter.js"
    exec node /home/site/temp/minimal-next-starter.js
  else
    echo "ERROR: No server script found. Creating a simple HTTP server."
    # Create a simple HTTP server as a last resort
    exec node -e "
      const http = require('http');
      const port = process.env.PORT || 8080;
      http.createServer((req, res) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<html><body><h1>ThinkForward</h1><p>Server starting up. Please check logs for issues.</p></body></html>');
      }).listen(port, () => console.log('Emergency server listening on port ' + port));
    "
  fi
fi
#!/bin/bash
#
# ensure-critical-files.sh
# 
# This script creates emergency versions of critical files if they don't exist
# It uses the /home/site/temp directory, which is writable in Azure App Service
#

# Set up logging
LOG_FILE="/home/site/temp/ensure-critical-files.log"
mkdir -p /home/site/temp

echo "======= Running ensure-critical-files.sh =======" >> "$LOG_FILE"
echo "Started at: $(date)" >> "$LOG_FILE"
echo "Current directory: $(pwd)" >> "$LOG_FILE"

# Make sure the temp directory exists
TEMP_DIR="/home/site/temp"
mkdir -p "$TEMP_DIR"
echo "Created temp directory: $TEMP_DIR" >> "$LOG_FILE"

# Check if minimal-next-starter.js exists anywhere, if not create it
MINIMAL_NEXT_STARTER="minimal-next-starter.js"
FOUND_STARTER=false

# Check common locations
for LOCATION in "/home/site/wwwroot" "/home/site" "$TEMP_DIR" "."
do
  if [ -f "$LOCATION/$MINIMAL_NEXT_STARTER" ]; then
    echo "Found $MINIMAL_NEXT_STARTER at $LOCATION/$MINIMAL_NEXT_STARTER" >> "$LOG_FILE"
    FOUND_STARTER=true
    # Copy to temp directory for safety
    cp "$LOCATION/$MINIMAL_NEXT_STARTER" "$TEMP_DIR/" >> "$LOG_FILE" 2>&1
    break
  fi
done

if [ "$FOUND_STARTER" = false ]; then
  echo "Creating emergency $MINIMAL_NEXT_STARTER in $TEMP_DIR" >> "$LOG_FILE"
  cat > "$TEMP_DIR/$MINIMAL_NEXT_STARTER" << 'EOL'
#!/usr/bin/env node
/**
 * ThinkForward Minimal Next.js Starter - Emergency Version
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Log environment info
console.log('=== ThinkForward Next.js Emergency Starter ===');
console.log('Starting at:', new Date().toISOString());
console.log('Current directory:', process.cwd());
console.log('Files in current directory:', fs.readdirSync('.').join(', '));

// Force critical environment variables
process.env.NEXT_IGNORE_FILESYSTEM_CHECK = '1';
process.env.NEXT_MANUAL_SIG_HANDLE = 'true'; 
process.env.NEXT_TELEMETRY_DISABLED = '1';

// Create a basic HTTP server for fallback
const port = parseInt(process.env.PORT, 10) || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>ThinkForward - Emergency Mode</title>
        <style>
          body { font-family: system-ui, sans-serif; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 2rem; }
          h1 { color: #0070f3; }
          .card { border: 1px solid #ddd; padding: 1rem; margin: 1rem 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <h1>ThinkForward Application</h1>
        <div class="card">
          <h2>Emergency Mode</h2>
          <p>The application is running in emergency mode.</p>
          <p>Server time: ${new Date().toISOString()}</p>
        </div>
        <script>setTimeout(() => window.location.reload(), 10000);</script>
      </body>
    </html>
  `);
});

server.listen(port, () => {
  console.log(`Emergency server running at http://localhost:${port}`);
});
EOL

  # Make it executable
  chmod +x "$TEMP_DIR/$MINIMAL_NEXT_STARTER" >> "$LOG_FILE" 2>&1
fi

# Check if server.js exists, if not create a simple version
if [ ! -f "/home/site/wwwroot/server.js" ] && [ ! -f "$TEMP_DIR/server.js" ]; then
  echo "Creating emergency server.js in $TEMP_DIR" >> "$LOG_FILE"
  cat > "$TEMP_DIR/server.js" << 'EOL'
#!/usr/bin/env node
/**
 * ThinkForward Emergency Server
 */

console.log('ThinkForward Emergency Server starting...');

try {
  // Try to use the minimal starter from various locations
  const possiblePaths = [
    './minimal-next-starter.js',
    '/home/site/temp/minimal-next-starter.js',
    '/home/site/wwwroot/minimal-next-starter.js'
  ];

  let started = false;
  
  for (const starterPath of possiblePaths) {
    try {
      console.log(`Trying to require ${starterPath}...`);
      require(starterPath);
      started = true;
      console.log(`Started using ${starterPath}`);
      break;
    } catch (err) {
      console.error(`Failed to load ${starterPath}:`, err.message);
    }
  }

  if (!started) {
    // Create a basic HTTP server
    const http = require('http');
    const port = parseInt(process.env.PORT, 10) || 3000;
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<html><body><h1>ThinkForward</h1><p>Emergency fallback server running.</p></body></html>');
    });
    
    server.listen(port, () => {
      console.log(`Fallback server running on port ${port}`);
    });
  }
} catch (err) {
  console.error('Fatal error:', err);
}
EOL

  # Make it executable
  chmod +x "$TEMP_DIR/server.js" >> "$LOG_FILE" 2>&1
fi

# Copy any existing server.js to temp dir for safety
if [ -f "/home/site/wwwroot/server.js" ]; then
  cp "/home/site/wwwroot/server.js" "$TEMP_DIR/" >> "$LOG_FILE" 2>&1
  echo "Copied existing server.js to $TEMP_DIR" >> "$LOG_FILE"
fi

# Create a startup script that will choose the right file to run
cat > "$TEMP_DIR/startup.sh" << 'EOL'
#!/bin/bash

echo "ThinkForward Startup Script"
echo "Date: $(date)"
echo "Current directory: $(pwd)"
echo "Files in current dir: $(ls -la)"

# Run ensure-critical-files.sh first if it exists
if [ -f "/home/site/temp/ensure-critical-files.sh" ]; then
  echo "Running ensure-critical-files.sh"
  bash /home/site/temp/ensure-critical-files.sh
fi

# Determine which server script to use
if [ -f "/home/site/wwwroot/server.js" ]; then
  echo "Using main server.js"
  cd /home/site/wwwroot
  node server.js
elif [ -f "/home/site/temp/server.js" ]; then
  echo "Using emergency server.js"
  cd /home/site/wwwroot
  node /home/site/temp/server.js
elif [ -f "/home/site/temp/minimal-next-starter.js" ]; then
  echo "Using minimal-next-starter.js"
  cd /home/site/wwwroot
  node /home/site/temp/minimal-next-starter.js
else
  echo "No server script found, starting basic Node HTTP server"
  cd /home/site/wwwroot
  node -e "const http=require('http');const port=process.env.PORT||3000;http.createServer((req,res)=>{res.end('<h1>ThinkForward</h1><p>No server scripts found.</p>')}).listen(port,()=>console.log('Basic server on port '+port))"
fi
EOL

# Make it executable
chmod +x "$TEMP_DIR/startup.sh" >> "$LOG_FILE" 2>&1
echo "Created startup.sh in $TEMP_DIR" >> "$LOG_FILE"

echo "Completed at: $(date)" >> "$LOG_FILE"
echo "======= ensure-critical-files.sh finished =======" >> "$LOG_FILE"

# Output success
echo "Critical files have been created in $TEMP_DIR"
echo "Log file at: $LOG_FILE"
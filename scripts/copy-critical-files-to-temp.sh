#!/bin/bash
# This script copies critical files to the /home/site/temp directory
# which is writable in Azure App Service environments.
# It runs during the application startup to ensure these files are available.

set -e

TEMP_DIR="/home/site/temp"
mkdir -p "$TEMP_DIR"

echo "=== Copying Critical Files to Writable Directory ==="
echo "Date: $(date)"
echo "Source directory: $(pwd)"
echo "Target directory: $TEMP_DIR"

# Define critical files
CRITICAL_FILES=(
  "scripts/minimal-next-starter.js"
  "scripts/emergency-server.js"
  "scripts/comprehensive-nextjs-diagnostics.js"
  "scripts/create-direct-startup.sh"
  "scripts/fix-nextjs-build-dir.sh"
  "scripts/resolve-next-modules.js"
  "server.js"
)

# Copy each critical file
for file in "${CRITICAL_FILES[@]}"; do
  if [ -f "$file" ]; then
    # Create target directory if it doesn't exist
    target_dir="$TEMP_DIR/$(dirname "$file")"
    mkdir -p "$target_dir"
    
    # Copy the file
    cp "$file" "$TEMP_DIR/$file"
    chmod +x "$TEMP_DIR/$file" 2>/dev/null || true
    
    echo "✅ Copied $file to $TEMP_DIR/$file"
  else
    echo "❌ WARNING: $file not found, cannot copy!"
    
    # Create placeholder
    target_dir="$TEMP_DIR/$(dirname "$file")"
    mkdir -p "$target_dir"
    
    cat > "$TEMP_DIR/$file" << EOF
// THIS IS A PLACEHOLDER FILE
// The original $file was missing during startup
// This placeholder was created to prevent runtime failures
// but will likely not function correctly.
console.error('ERROR: This is a placeholder for $file that was missing during startup');
EOF
    
    chmod +x "$TEMP_DIR/$file" 2>/dev/null || true
    echo "   Created placeholder for $file in $TEMP_DIR/$file"
  fi
done

# Create a simple verification file in the temp directory
cat > "$TEMP_DIR/critical-files.txt" << EOF
Critical files copied to temp directory at: $(date)
Source directory: $(pwd)
Files:
$(ls -la $TEMP_DIR/scripts/ 2>/dev/null || echo "No scripts directory found")

Verification completed at: $(date)
EOF

echo "=== Completed copying critical files ==="
echo "Verification file created at: $TEMP_DIR/critical-files.txt"
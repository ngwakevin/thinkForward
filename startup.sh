#!/bin/sh
set -eu

cd /home/site/wwwroot

export NODE_ENV=production
export PORT=${PORT:-8080}
export HOSTNAME=0.0.0.0
export NEXT_TELEMETRY_DISABLED=1
export NEXT_MANUAL_SIG_HANDLE=1
export NEXT_IGNORE_FILESYSTEM_CHECK=1
export NEXT_DISABLE_FILE_SYSTEM_CACHE=1
export NODE_OPTIONS="${NODE_OPTIONS:---max_old_space_size=512 --no-warnings}"

echo "Starting ThinkForward on Azure App Service"
echo "- NODE_ENV: $NODE_ENV"
echo "- PORT: $PORT"
echo "- HOSTNAME: $HOSTNAME"
echo "- Node version: $(node -v)"

if [ ! -d ".next" ]; then
  echo "ERROR: .next directory not found. Did you include the build output in the deployment artifact?"
  ls -la
  exit 1
fi

if [ ! -f ".next/standalone/server.js" ]; then
  echo "ERROR: .next/standalone/server.js is missing. Ensure 'next build' ran with output=standalone." >&2
  ls -R .next | head -100
  exit 2
fi

if [ ! -d ".next/static" ]; then
  echo "ERROR: .next/static directory missing."
  exit 3
fi

echo "Verifying supporting assets..."
ls -la .next/standalone || true
ls -la .next/static || true
ls -la public || true

RUNTIME_ROOT="/home/site/temp/thinkforward-runtime"
STANDALONE_DIR=".next/standalone"
RUNTIME_STANDALONE_DIR="$RUNTIME_ROOT/standalone"

echo "Preparing writable runtime directory at $RUNTIME_ROOT"
rm -rf "$RUNTIME_STANDALONE_DIR"
mkdir -p "$RUNTIME_STANDALONE_DIR"

echo "Copying standalone server into runtime directory"
cp -R "$STANDALONE_DIR/." "$RUNTIME_STANDALONE_DIR/"

echo "Syncing static assets into runtime directory"
rm -rf "$RUNTIME_STANDALONE_DIR/static"
cp -R .next/static "$RUNTIME_STANDALONE_DIR/static"

echo "Syncing public assets into runtime directory"
rm -rf "$RUNTIME_STANDALONE_DIR/public"
cp -R public "$RUNTIME_STANDALONE_DIR/public"

# Provide emergency scripts from backups if needed
BACKUP_DIR="public/azure-backup/scripts"
ensure_helper_script() {
  target="$1"
  if [ -f "$target" ]; then
    chmod +x "$target" 2>/dev/null || true
    return
  fi
  base=$(basename "$target")
  if [ -f "$BACKUP_DIR/$base" ]; then
    echo "Restoring $base from backup"
    mkdir -p "$(dirname "$target")"
    cp "$BACKUP_DIR/$base" "$target"
    chmod +x "$target" 2>/dev/null || true
  fi
}

ensure_helper_script "scripts/minimal-next-starter.js"
ensure_helper_script "scripts/emergency-server.js"
ensure_helper_script "scripts/comprehensive-nextjs-diagnostics.js"

echo "Launching Next.js standalone server from writable runtime..."
cd "$RUNTIME_STANDALONE_DIR"
exec node server.js
    echo "Direct start wrapper failed, trying custom server..."
    sleep 2
    echo "Starting with custom server: node server.js"
    node --experimental-specifier-resolution=node server.js || {
        echo "ERROR: Failed to start server with experimental specifier resolution. Retrying with default..."
        sleep 2
        echo "Retrying server start with default settings..."
        node server.js
    }
}

# Log successful startup
echo "App started successfully at: $(date)"
echo "Health check available at: http://localhost:$PORT/api/health"

#!/usr/bin/env bash
set -euo pipefail

# This script is used by GitHub Actions for Azure Web App deployment
# It assumes `npm run build` has already been executed.

ROOT_DIR=$(pwd)
BACKUP_DIR="public/azure-backup/scripts"

echo "Ensuring startup.sh is present and executable..."
if [ ! -f "startup.sh" ]; then
  echo "ERROR: startup.sh not found. Commit the curated startup script before packaging." >&2
  exit 1
fi
chmod +x startup.sh

echo "Verifying Next.js build output (.next)..."
if [ ! -d ".next" ] || [ ! -f ".next/BUILD_ID" ]; then
  echo "ERROR: .next build output missing. Run 'npm run build' first." >&2
  exit 1
fi

ensure_script() {
  local target="$1"
  local backup="$BACKUP_DIR/$(basename "$target")"

  if [ -f "$target" ]; then
    chmod +x "$target" 2>/dev/null || true
    return
  fi

  if [ -f "$backup" ]; then
    echo "Recovering missing $target from backup..."
    mkdir -p "$(dirname "$target")"
    cp "$backup" "$target"
    chmod +x "$target" 2>/dev/null || true
    return
  fi

  echo "WARNING: $target is missing and no backup was found." >&2
}

CRITICAL_SCRIPTS=(
  "scripts/minimal-next-starter.js"
  "scripts/emergency-server.js"
  "scripts/comprehensive-nextjs-diagnostics.js"
  "scripts/create-direct-startup.sh"
  "scripts/resolve-next-modules.js"
  "scripts/diagnose-nextjs.sh"
)

echo "Ensuring critical helper scripts are available..."
for script in "${CRITICAL_SCRIPTS[@]}"; do
  ensure_script "$script"
done

echo "Collecting file list for deployment package..."
INCLUDE_PATHS=(
  "app"
  "components"
  "config"
  "content"
  "data"
  "lib"
  "public"
  "scripts"
  ".next"
  "node_modules"
  "package.json"
  "package-lock.json"
  "next.config.mjs"
  "postcss.config.mjs"
  "tailwind.config.mjs"
  "tsconfig.json"
  "server.js"
  "startup.sh"
)

echo "Creating deploy.zip with $((${#INCLUDE_PATHS[@]})) root items..."
rm -f deploy.zip
zip -9 -r deploy.zip "${INCLUDE_PATHS[@]}" \
  -x "node_modules/.cache/*" \
     "**/.DS_Store" \
     "**/Thumbs.db"

echo "Validating that critical assets made it into the archive..."
for path in ".next/BUILD_ID" "server.js" "startup.sh" "scripts/minimal-next-starter.js"; do
  if unzip -l deploy.zip "$path" > /dev/null 2>&1; then
    echo "✓ $path found in deploy.zip"
  else
    echo "ERROR: $path missing from deploy.zip" >&2
    exit 2
  fi
done

PACKAGE_SIZE=$(du -h deploy.zip | cut -f1)
echo "Created deploy.zip (${PACKAGE_SIZE}) for Azure deployment"

echo "Listing top-level entries in deploy.zip:"
unzip -l deploy.zip | sed -n '1,10p'

#!/usr/bin/env bash
set -euo pipefail
rm -f source.zip
# Exclude build and dependencies so remote build runs
zip -r source.zip package.json package-lock.json next.config.mjs tsconfig.json tailwind.config.mjs postcss.config.mjs scripts config lib app components data content public -x "**/node_modules/*" -x "**/.next/*"
echo "Created source.zip (remote build)"

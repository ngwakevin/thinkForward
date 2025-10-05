#!/usr/bin/env bash
set -euo pipefail
rm -f deploy.zip
npm ci
npm run build
npm prune --production
zip -r deploy.zip package.json package-lock.json next.config.mjs node_modules .next public scripts config lib app components data content
echo "Created deploy.zip (prebuilt)"

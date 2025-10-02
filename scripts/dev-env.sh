#!/usr/bin/env bash
set -euo pipefail

PORT=3006

# Resolve script directory and project root (one level up from scripts)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo "[dev-env] Working directory: $(pwd)"

echo "[dev-env] Killing any existing process on port $PORT ..."
if lsof -tiTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; then
  lsof -tiTCP:$PORT -sTCP:LISTEN | xargs kill -9 || true
fi

echo "[dev-env] Ensuring dependencies (package.json present) ..."
if [ ! -f package.json ]; then
  echo "[dev-env] ERROR: package.json not found in $(pwd)" >&2
  exit 1
fi

echo "[dev-env] Prisma generate (idempotent) ..."
npx prisma generate >/dev/null 2>&1 || true

if [ -f prisma/schema.prisma ]; then
  echo "[dev-env] Prisma db push ..."
  npx prisma db push --accept-data-loss >/dev/null 2>&1 || echo "[dev-env] Warning: db push failed (continuing)"
fi

echo "[dev-env] Starting Next.js dev server on :$PORT" 
exec npm run dev --silent

#!/bin/bash
# Azure Next.js Startup Script (Updated for October 2025 read-only container changes)
# This script handles Next.js standalone mode in Azure App Service's new read-only container environment

# Enable debugging and exit on error
set -e

# Print diagnostic information
echo "ThinkForward Next.js Startup - Azure Read-Only Container Version"
echo "Node version: $(node --version)"
echo "Current directory: $(pwd)"
echo "Directory listing:"
ls -la

# Define critical paths
SITE_ROOT="/home/site/wwwroot"
DATA_ROOT="/home/data"  # Always writable in Azure's new container model
RUNTIME_DIR="${DATA_ROOT}/nextjs-runtime"
TEMP_DIR="${DATA_ROOT}/temp"
LOG_DIR="${DATA_ROOT}/logs"

# Create required directories
mkdir -p "${RUNTIME_DIR}" "${TEMP_DIR}" "${LOG_DIR}"

# Set up logging
LOGFILE="${LOG_DIR}/nextjs-startup-$(date +%Y%m%d-%H%M%S).log"
exec > >(tee -a "${LOGFILE}") 2>&1

echo "=========== STARTUP LOG: $(date) ==========="
echo "Filesystem status:"
echo "- SITE_ROOT (${SITE_ROOT}): $(ls -ld ${SITE_ROOT})"
echo "- DATA_ROOT (${DATA_ROOT}): $(ls -ld ${DATA_ROOT})"

# Detect read-only filesystem
if touch "${SITE_ROOT}/test-write.tmp" 2>/dev/null; then
    echo "DETECTION: Standard writable filesystem mode"
    rm "${SITE_ROOT}/test-write.tmp"
    READONLY_MODE=false
else
    echo "DETECTION: Read-only container filesystem mode"
    READONLY_MODE=true
fi

# Display Next.js files
echo "Next.js file structure:"
if [ -d "${SITE_ROOT}/.next" ]; then
    ls -la "${SITE_ROOT}/.next"
    if [ -d "${SITE_ROOT}/.next/standalone" ]; then
        ls -la "${SITE_ROOT}/.next/standalone"
    else
        echo "WARNING: No .next/standalone directory found"
    fi
else
    echo "WARNING: No .next directory found"
fi

# Function to prepare runtime environment
prepare_runtime() {
    echo "Preparing runtime environment in ${RUNTIME_DIR}..."
    
    # Copy standalone server files
    if [ -d "${SITE_ROOT}/.next/standalone" ]; then
        echo "Copying standalone server files..."
        cp -r "${SITE_ROOT}/.next/standalone/"* "${RUNTIME_DIR}/"
    else
        echo "ERROR: Standalone server files not found"
        return 1
    fi
    
    # Create next directory structure
    mkdir -p "${RUNTIME_DIR}/.next"
    
    # Copy static files
    if [ -d "${SITE_ROOT}/.next/static" ]; then
        echo "Copying static assets..."
        cp -r "${SITE_ROOT}/.next/static" "${RUNTIME_DIR}/.next/"
    else
        echo "WARNING: No static assets found"
    fi
    
    # Copy public directory
    if [ -d "${SITE_ROOT}/public" ]; then
        echo "Copying public assets..."
        cp -r "${SITE_ROOT}/public" "${RUNTIME_DIR}/"
    fi
    
    # Patch server.js for read-only environment if needed
    if [ "${READONLY_MODE}" = true ] && [ -f "${RUNTIME_DIR}/server.js" ]; then
        echo "Patching server.js for read-only environment..."
        sed -i "s|process.cwd()|'${RUNTIME_DIR}'|g" "${RUNTIME_DIR}/server.js"
        
        # Add patch for Next.js temp directory issues
        echo "Adding NEXT_RUNTIME_DIR environment override..."
        echo "
// Read-only environment patch
process.env.NEXT_RUNTIME_DIR = '${RUNTIME_DIR}';
process.env.NEXT_DIST_DIR = '${RUNTIME_DIR}/.next';
" >> "${RUNTIME_DIR}/read-only-patch.js"
        
        # Inject the patch at the beginning of server.js
        mv "${RUNTIME_DIR}/server.js" "${RUNTIME_DIR}/server.js.orig"
        cat <(echo "require('./read-only-patch.js');") "${RUNTIME_DIR}/server.js.orig" > "${RUNTIME_DIR}/server.js"
        rm "${RUNTIME_DIR}/server.js.orig"
    fi
    
    return 0
}

# Setup environment variables
export PORT=${PORT:-8080}
export HOSTNAME=${HOSTNAME:-"0.0.0.0"}
export NODE_ENV=${NODE_ENV:-"production"}
export NEXT_TELEMETRY_DISABLED=1
export TEMP="${TEMP_DIR}"
export TMP="${TEMP_DIR}"
export NEXT_RUNTIME_DIR="${RUNTIME_DIR}"

echo "Environment variables:"
echo "- PORT: ${PORT}"
echo "- HOSTNAME: ${HOSTNAME}"
echo "- NODE_ENV: ${NODE_ENV}"
echo "- TEMP: ${TEMP}"
echo "- NEXT_RUNTIME_DIR: ${NEXT_RUNTIME_DIR}"

# Check for NextAuth configuration
if [ -n "${NEXTAUTH_URL}" ]; then
    echo "NextAuth configuration detected:"
    echo "- NEXTAUTH_URL: ${NEXTAUTH_URL}"
    
    # Check for secure configuration
    if [ -z "${NEXTAUTH_SECRET}" ]; then
        echo "WARNING: NEXTAUTH_SECRET is not set. Authentication may not work correctly."
    else
        echo "- NEXTAUTH_SECRET: [configured]"
    fi
else
    echo "WARNING: NEXTAUTH_URL is not set. Authentication may not work correctly."
fi

# Session debugging hook - this helps identify session ID issues
export NODE_OPTIONS="${NODE_OPTIONS} -r ${SITE_ROOT}/node_modules/next/dist/server/require-hook.js"

# Prepare the runtime environment
if prepare_runtime; then
    echo "Runtime environment prepared successfully."
else
    echo "ERROR: Failed to prepare runtime environment."
    exit 1
fi

# Start the Next.js server
echo "Starting Next.js server in ${RUNTIME_DIR}..."
cd "${RUNTIME_DIR}"
echo "Current directory: $(pwd)"
echo "Starting server: node server.js"

# Special trace log for auth debugging
echo "[auth] Starting server with auth debugging enabled"

# Run the server
exec node server.js
# Azure App Service Deployment Process for ThinkForward

This document explains the improved deployment process for the ThinkForward Next.js application to Azure App Service, focusing on the critical fixes implemented to address startup failures and missing script errors.

## Common Deployment Issues

The ThinkForward Next.js application had been experiencing the following issues in Azure App Service:

1. **Missing Critical Scripts**: The `minimal-next-starter.js`, `emergency-server.js`, and `comprehensive-nextjs-diagnostics.js` files were not being correctly included in the deployment package.

2. **Read-Only Filesystem**: Azure App Service uses a read-only filesystem for the deployed application, which causes issues with Next.js's expectations for filesystem access.

3. **Module Resolution Issues**: Standard Node.js module resolution doesn't work well in Azure App Service's environment, especially with Next.js 14.x.

4. **Fallback Mechanism Failures**: When the primary startup method failed, the fallback mechanisms couldn't find the necessary scripts.

## Implemented Fixes

We've implemented the following fixes to address these issues:

### 1. Enhanced Deployment Package Creation (`zip-prebuild.sh`)

- Added a comprehensive list of critical files that must be included in the deployment
- Added verification steps before and after creating the zip file
- Added placeholder creation for missing files to prevent deployment failures
- Improved verbosity of the packaging process for better debugging

### 2. Copying Critical Files to Writable Directory (`copy-critical-files-to-temp.sh`)

- Created a script to copy all critical files to the `/home/site/temp` directory in Azure
- This directory is writable even in the read-only environment of Azure App Service
- Files are copied during application startup to ensure they're always available

### 3. Improved Script Location Search (`create-direct-startup.sh`)

- Updated the startup script to search for critical files in multiple locations
- Added fallback mechanisms for each critical file, including auto-generation of placeholders
- Added better error reporting when scripts can't be found

### 4. Deployment Package Verification (`verify-deployment-package.sh`)

- Created a verification script that checks the deployment package for all required files
- This script runs before deployment to catch issues early
- Added safeguards to prevent deployment of incomplete packages

## Deployment Process

The improved deployment process works as follows:

1. **Build & Prepare**: 
   - Run `npm run build` to build the Next.js application
   - Execute `scripts/prepare-azure-deployment.sh` to prepare for Azure deployment

2. **Package**: 
   - Run `scripts/zip-prebuild.sh` to create the deployment package
   - This script verifies all critical files are included

3. **Verify**: 
   - Run `scripts/verify-deployment-package.sh deploy.zip` to verify the package
   - This catches any missing files before deployment

4. **Deploy**: 
   - Deploy the package to Azure App Service
   - The startup process handles multiple fallbacks if issues arise

5. **Runtime**: 
   - During startup, critical files are copied to `/home/site/temp`
   - The application tries multiple startup methods in sequence until one succeeds

## Critical Files

The following files are critical for the application to start successfully:

- `scripts/minimal-next-starter.js`: Primary starter script for Next.js in Azure
- `scripts/emergency-server.js`: Last-resort HTTP server when Next.js can't start
- `scripts/comprehensive-nextjs-diagnostics.js`: Diagnostic tool for startup issues
- `scripts/create-direct-startup.sh`: Creates the startup script for Azure App Service
- `scripts/fix-nextjs-build-dir.sh`: Fixes Next.js build directory issues in Azure
- `scripts/resolve-next-modules.js`: Resolves Next.js module paths in Azure
- `scripts/copy-critical-files-to-temp.sh`: Copies critical files to writable directory
- `server.js`: Custom server implementation for Next.js

## Testing the Deployment

To test the deployment locally before deploying to Azure:

```bash
# Build the application
npm run build

# Package the application
bash scripts/zip-prebuild.sh

# Verify the deployment package
bash scripts/verify-deployment-package.sh deploy.zip

# Test the deployment approach
bash scripts/test-azure-deployment.sh
```

## Troubleshooting

If the application still fails to start in Azure App Service:

1. Check the Azure App Service logs for specific error messages
2. Look for messages about missing files in the startup logs
3. Check if the `/home/site/temp` directory contains the copied critical files
4. Verify that the startup script is correctly executed
5. Try restarting the App Service to trigger the startup process again

The application includes multiple fallback mechanisms, including an emergency HTTP server that will run even if Next.js completely fails to start. This ensures users always see something rather than a 503 error.

## Future Improvements

Consider implementing the following improvements:

1. Add more detailed logging during startup
2. Implement automated testing of the deployment package
3. Create a healthcheck endpoint that verifies all components are working
4. Add monitoring and alerting for deployment failures

For any questions or issues, please contact the ThinkForward development team.

---

*Last updated: October 2023*
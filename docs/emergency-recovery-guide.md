# ThinkForward Emergency Recovery Guide

This document outlines the emergency recovery procedures for the ThinkForward application when deployed on Azure App Service. It explains how the multi-layered failover system works and how to recover from various failure scenarios.

## Architecture Overview

The ThinkForward application includes multiple failover mechanisms to ensure robustness in Azure's read-only filesystem environment:

1. **Primary Start Method**: Custom `server.js` file with standard Next.js server
2. **Fallback 1**: `minimal-next-starter.js` with multiple module loading approaches
3. **Fallback 2**: Direct Next.js start command
4. **Emergency Mode**: Dedicated `emergency-server.js` with diagnostics

## Diagnostic Tools

The application includes several diagnostic tools:

- **comprehensive-nextjs-diagnostics.js**: Performs deep system inspection
- **emergency-server.js**: Provides interactive diagnostic dashboard
- **startup.sh**: Contains multi-stage startup with progressive fallbacks

## Common Issues and Solutions

### "Could not find a production build" Error

This occurs when Next.js cannot locate the build directory or build artifacts:

**Solutions:**
1. Ensure the build process completes successfully before deployment
2. Check that the `.next` directory is properly included in the deployment package
3. Verify that Azure environment variables are set correctly:
   ```
   NEXT_IGNORE_FILESYSTEM_CHECK=1
   NEXT_MANUAL_SIG_HANDLE=true
   NEXT_TELEMETRY_DISABLED=1
   NEXT_TEMP_DIR=/home/site/next-temp
   NEXT_DIST_DIR=/home/site/next-temp/.next
   ```

### "createServer is not a function" Error

This occurs when Next.js module resolution fails due to compatibility issues:

**Solutions:**
1. The `minimal-next-starter.js` will attempt multiple module loading strategies
2. If this error persists, check the Node.js version on Azure App Service
3. Ensure you're using a compatible Next.js version

### Read-Only Filesystem Issues

Azure App Service has a read-only filesystem in production except for specific directories:

**Writable Directories:**
- `/home/site/temp`
- `/tmp`

**Solutions:**
1. The startup script automatically creates necessary files in writable directories
2. Check Azure App Service logs for specific filesystem errors
3. Use the diagnostics tools to verify directory permissions

## Emergency Recovery Procedure

If the application enters emergency mode:

1. **Access the Emergency Dashboard**: Navigate to your Azure App Service URL
2. **Run Diagnostics**: Click "Run Diagnostics" on the emergency dashboard
3. **View Diagnostic Report**: Review the diagnostic information to identify issues
4. **Check Azure Logs**: In Azure Portal, go to App Service > Monitoring > Log Stream
5. **Restart the App Service**: Try restarting the App Service from Azure Portal
6. **Redeploy with Fixes**: Make necessary fixes and redeploy

## Quick Reference: Azure Configuration

Ensure these settings are configured in Azure App Service:

```
WEBSITE_NODE_DEFAULT_VERSION=~20
WEBSITE_RUN_FROM_PACKAGE=1
NEXT_IGNORE_FILESYSTEM_CHECK=1
NEXT_MANUAL_SIG_HANDLE=true
NEXT_TELEMETRY_DISABLED=1
NEXT_TEMP_DIR=/home/site/next-temp
NEXT_DIST_DIR=/home/site/next-temp/.next
```

Startup command:
```
cd /home/site/wwwroot && bash scripts/create-direct-startup.sh && bash startup.sh
```

## Maintenance Recommendations

1. **Regular Testing**: Periodically test the deployment process
2. **Version Tracking**: Document successful Node.js and Next.js version combinations
3. **Log Monitoring**: Set up alerts for emergency mode activation

## Support Contacts

For additional support, contact:

- Development Team: [email]
- Azure Support: [contact info]

Last Updated: [date]
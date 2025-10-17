# Next.js on Azure App Service: Handling Read-Only Containers

This document explains how to adapt Next.js applications for deployment on Azure App Service's updated read-only container environment. The recent changes (October 2025) to Azure's container approach have introduced stricter filesystem restrictions that require special handling for Next.js applications.

## Understanding the Changes

Azure App Service has updated its container runtime environment with the following changes:

1. **Read-Only Root Filesystem**: The `/home/site/wwwroot` directory (where your app is deployed) is now mounted as read-only.
2. **Writable Data Directory**: Only `/home/data` remains consistently writable.
3. **Modified Temp Directory Handling**: System temp directories may also be read-only or have restricted permissions.

These changes affect Next.js applications in several ways:

- Next.js needs to write temporary files during runtime
- The standalone output needs to be executable from a writable location
- Session storage for authentication may be affected

## Solution: The Read-Only Startup Script

We've created a specialized startup script (`azure-readonly-startup.sh`) that:

1. Detects whether the environment is using read-only containers
2. Creates a writable runtime environment in `/home/data/nextjs-runtime`
3. Copies the standalone Next.js server and required assets to this location
4. Patches configuration to handle read-only constraints
5. Ensures proper authentication session handling

## Deployment Instructions

### 1. Configure Azure App Service

In the Azure Portal:

1. Go to your App Service resource
2. Navigate to Configuration → General Settings
3. Set Startup Command to:
   ```
   /home/site/wwwroot/azure-readonly-startup.sh
   ```

### 2. Required Application Settings

Add these Application Settings in the Azure Portal:

- `NEXTAUTH_URL`: Your site's URL (e.g., `https://yoursite.azurewebsites.net`)
- `NEXTAUTH_SECRET`: Your secret key for JWT signing
- `WEBSITE_RUN_FROM_PACKAGE`: Set to `0` (important for the read-only approach)

### 3. Next.js Build Configuration

Ensure your Next.js application is built with:

```bash
next build
```

The script assumes a standard Next.js output structure with standalone mode enabled in your `next.config.js`:

```javascript
module.exports = {
  output: 'standalone'
}
```

## Troubleshooting

### Checking Logs

Access logs via:
1. Azure Portal → App Service → Log stream
2. Kudu console (`https://yoursite.scm.azurewebsites.net/DebugConsole`)
3. Directly in `/home/data/logs/` directory

### Common Issues

1. **Module Not Found Errors**: Ensure all dependencies are included in your deployment package.
2. **Authentication Issues**: Check NEXTAUTH_URL and NEXTAUTH_SECRET settings. Ensure your app handles secure cookie settings correctly.
3. **Path Resolution Errors**: The script patches path resolution, but custom code may need similar adjustments.

### Testing Read-Only Mode Locally

To test locally with similar constraints:
```bash
# Create a test environment
mkdir -p ./test-readonly/app ./test-readonly/data
cp -r ./.next ./test-readonly/app/
cp ./azure-readonly-startup.sh ./test-readonly/

# Run with read-only simulation
cd ./test-readonly
SITE_ROOT="$(pwd)/app" DATA_ROOT="$(pwd)/data" PORT=3000 bash ./azure-readonly-startup.sh
```

## Authentication and Sessions

For applications using NextAuth.js or similar authentication libraries:

1. **Session Strategy**: Use JWT strategy over database strategy where possible
2. **Cookie Settings**: Ensure `secure: process.env.NODE_ENV === "production"` is set
3. **Headers**: Confirm appropriate headers are set for proxy environments
4. **Debug Traces**: Auth-specific debug traces are enabled in the startup script

When configured correctly, you should see log entries like:

```
[auth] Session user ID set to: <user-id-value>
```

## Further Resources

- [Official Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)

For additional assistance, review the Azure App Service logs or contact Azure support.
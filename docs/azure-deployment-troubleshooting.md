# Azure App Service Deployment Troubleshooting

This document provides information about common issues encountered with Azure deployments of the ThinkForward application and how to fix them.

## Common Deployment Issues

### Cosmos DB Authentication Errors

**Problem**: The application shows errors like:
```
Error initializing Cosmos DB: The input authorization token can't serve the request. The wrong key is being used or the expected payload is not built as per the protocol.
```

**Cause**: This typically happens because:
1. The `COSMOS_KEY` environment variable is missing or incorrect
2. There's a mismatch between `COSMOS_KEY` and `COSMOS_DB_KEY` values
3. The key format is incorrect or corrupted

**Solution**:
1. Run the fix script: `./scripts/fix-cosmos-key.sh`
2. This script ensures both `COSMOS_KEY` and `COSMOS_DB_KEY` are set and have the same value
3. It also restarts the App Service to apply the changes

### Read-Only File System Errors

**Problem**: The application logs show errors like:
```
Failed to update prerender cache: EROFS: read-only file system, open '/home/site/wwwroot/.next/server/app/docs/terms.html'
```

**Cause**: Azure App Service with `WEBSITE_RUN_FROM_PACKAGE=1` creates a read-only file system for the application, which prevents Next.js from writing to its cache.

**Solution**:
1. Run the fix script: `./scripts/fix-azure-fs-issues.sh`
2. This script:
   - Creates a custom startup script that sets up writable temp directories
   - Configures Next.js to use the temp directories for caching
   - Updates the App Service settings accordingly

### ZIP Deploy Failures

If you're experiencing ZIP Deploy failures, check the following:
   - AZURE_AD_CLIENT_SECRET
   - AZURE_AD_TENANT_ID (should be 'common')
   - COSMOS_ENDPOINT
   - COSMOS_KEY
   - COSMOS_DATABASE

4. **Node.js Version**: Make sure the Node.js version is compatible
   - Set in App Service Configuration under "General settings"
   - Recommended version: Node.js 20 LTS

### Testing Deployments

1. Use the health endpoint to verify the app is running correctly:
   - https://your-app-name.azurewebsites.net/api/health

2. Check application logs in Azure Portal:
   - Log Stream
   - Application Insights
   - Diagnose and Solve Problems

## Manual Deployment Steps

If automatic deployment isn't working, follow these steps for a manual deployment:

1. Build the app locally:
   ```bash
   npm run build
   ```

2. Create a deployment package:
   ```bash
   zip -r deployment.zip . -x "node_modules/*" "*.git*" ".github/*"
   ```

3. Upload and deploy using the Azure CLI:
   ```bash
   az webapp deployment source config-zip --resource-group YOUR_RESOURCE_GROUP --name YOUR_APP_NAME --src deployment.zip
   ```

## Post-Deployment Checks

After a successful deployment:

1. Verify authentication is working with personal Microsoft accounts
2. Confirm user profiles are being created in Cosmos DB
3. Check application logs for any warnings or errors

## Maintaining the Deployment

### When to Run These Scripts

- After creating a new Azure App Service
- When changing Cosmos DB connection details
- When experiencing authentication or file system errors
- Before deploying major updates

### Tips for Smooth Deployments

1. Always use both naming conventions for critical variables:
   - Both `COSMOS_ENDPOINT` and `COSMOS_DB_ENDPOINT`
   - Both `COSMOS_KEY` and `COSMOS_DB_KEY`
   - Both `COSMOS_DATABASE` and `COSMOS_DB_DATABASE_ID`

2. Use the `output: 'standalone'` option in Next.js config for production builds

3. Use `WEBSITE_RUN_FROM_PACKAGE=1` for more reliable deployments, but be aware of the read-only file system it creates

4. If you change the App Service name, update it in all scripts and GitHub Actions workflows

## Monitoring and Troubleshooting

- Check Azure App Service logs for errors
- Use the Azure Portal to verify environment variables
- Run `az webapp log tail` to monitor logs in real-time

## Additional Resources

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Cosmos DB Connection Troubleshooting](https://docs.microsoft.com/en-us/azure/cosmos-db/troubleshoot-connections)
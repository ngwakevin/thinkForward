# Next.js Standalone Mode Troubleshooting in Azure App Service

This guide addresses common issues when deploying Next.js applications in standalone mode to Azure App Service, including the latest changes to Azure's read-only container approach (October 2025).

## Current Observed Issues

From the deployment logs, we've identified the following issues:

1. **Module Not Found Errors**:
   ```
   Error: Cannot find module '/home/site/temp/thinkforward-runtime/standalone/.next/server/app/api/health/route.js'
   ```

2. **Missing Files in Standalone Build**:
   The standalone runtime directory appears to be missing critical files needed for the application to run.

## Root Causes & Solutions

### 1. Build Configuration Issues

**Problem**: Next.js standalone build is not properly configured or not completing correctly.

**Solution**:
- Verify your `next.config.mjs` includes:
  ```javascript
  module.exports = {
    output: 'standalone',
    // other configuration...
  }
  ```
- Ensure build process completes successfully with `npm run build`
- Check `.next/standalone` directory exists after build

### 2. Directory Structure in Azure

**Problem**: Azure App Service deployment is not correctly preserving the directory structure needed by Next.js.

**Solution**:
- Use the `enhanced-azure-deploy.sh` script we've provided
- This script creates a writable runtime directory and copies all necessary files
- Ensures proper directory structure for `.next/server/app` and `.next/server/pages`

### 3. File Permissions

**Problem**: Standalone server may not have permission to access necessary files.

**Solution**:
- The script copies all files to a writable directory at `/home/site/temp/thinkforward-runtime`
- This ensures the application has proper permissions to access all required files

### 4. Azure Restart Behavior

**Problem**: Azure App Service restarts can sometimes lead to incomplete directory copies.

**Solution**:
- The script verifies essential directories exist before starting the server
- Added proper error handling to prevent failed starts with missing files

## Deployment Steps

1. **Run the Enhanced Deployment Script**:
   ```bash
   ./scripts/enhanced-azure-deploy.sh
   ```

2. **Verify Local Build**:
   After running the script, check that `.next/standalone` directory exists with all required files

3. **Deploy to Azure**:
   - If using Git deployment: `git push azure main`
   - If using GitHub Actions: Ensure your workflow uses the enhanced script
   - If using Azure Portal: Upload all files including the `.next` directory

## Testing After Deployment

After deployment, check the following:

1. **App Service Logs**:
   Check logs for any remaining "Module not found" errors

2. **File Structure**:
   Use the Kudu console to verify that `/home/site/temp/thinkforward-runtime/.next/server/app` and `/home/site/temp/thinkforward-runtime/.next/server/pages` directories exist with the expected files

3. **HTTP Response**:
   Verify your app responds with HTTP 200 and not HTTP 500 errors

## Common Errors and Solutions

### Error: Cannot find module '/path/to/file'

**Solution**: 
- Use the enhanced deployment script which ensures all required files are copied to the correct locations
- Verify the file exists in your local build before deploying

### Error: listen EADDRINUSE: address already in use :::8080

**Solution**:
- Azure sometimes has lingering processes using port 8080
- Our script handles this by properly setting PORT environment variable
- You can also try restarting the App Service completely

### Error: SyntaxError: Unexpected token in JSON

**Solution**:
- This often indicates environment variables are not properly formatted
- Verify your App Service Configuration settings have proper JSON syntax
- Double quotes may need escaping in some environment variables

## Additional Resources

For more information on Next.js standalone deployments:
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Azure App Service Linux Documentation](https://docs.microsoft.com/en-us/azure/app-service/configure-language-nodejs)

## NextAuth.js Specific Notes

If you're using NextAuth.js with your standalone deployment:

1. Make sure `NEXTAUTH_URL` is properly set to your Azure App Service URL
2. Ensure `NEXTAUTH_SECRET` is correctly set in App Service Configuration
3. Cookie settings should have `secure: true` for HTTPS environments
4. Check your JWT and session callbacks are properly returning user IDs

Our previous fixes to `lib/auth.ts` have addressed these NextAuth.js issues. You should see log entries like:

```
[auth] Session user ID set to: 17d693db-36d0-45ce-bd32-abd5c218c48c
```

This confirms authentication is working correctly.

## New: Azure Read-Only Container Environment (October 2025)

Azure App Service has recently updated its container runtime environment to enforce stricter read-only filesystem policies. This affects Next.js applications and requires special handling.

### Understanding the Read-Only Changes

1. **Read-Only Root Filesystem**: The `/home/site/wwwroot` directory (where your app is deployed) is now mounted as read-only.
2. **Writable Data Directory**: Only `/home/data` remains consistently writable.
3. **Modified Temp Directory Handling**: System temp directories may also be read-only or have restricted permissions.

### Solution: Use the Read-Only Container Startup Script

We've created a specialized startup script (`azure-readonly-startup.sh`) that:

1. Detects whether the environment is using read-only containers
2. Creates a writable runtime environment in `/home/data/nextjs-runtime`
3. Copies the standalone Next.js server and required assets to this location
4. Patches configuration to handle read-only constraints
5. Ensures proper authentication session handling

### Deployment Instructions for Read-Only Containers

1. **Configure Azure App Service**:
   ```bash
   az webapp config set --name your-app-name --resource-group your-resource-group --startup-file "/home/site/wwwroot/azure-readonly-startup.sh"
   ```

2. **Required Application Settings**:
   - `NEXTAUTH_URL`: Your site's URL (e.g., `https://yoursite.azurewebsites.net`)
   - `NEXTAUTH_SECRET`: Your secret key for JWT signing
   - `WEBSITE_RUN_FROM_PACKAGE`: Set to `0` (important for the read-only approach)

3. **Deploy with the Read-Only Script**:
   Ensure the `azure-readonly-startup.sh` script is included in your deployment package.

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
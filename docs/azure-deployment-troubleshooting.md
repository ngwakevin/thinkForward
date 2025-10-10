# Azure App Service Deployment Troubleshooting

## Common Deployment Issues

### ZIP Deploy Failures

If you're experiencing ZIP Deploy failures, check the following:

1. **Web Configuration**: Ensure web.config is properly configured for Node.js apps
   - The file should have the correct IISNode configuration
   - Proper rewrite rules should be defined

2. **Server Script**: Verify server.js is compatible with Azure App Service
   - Script should handle both HTTP and HTTPS requests
   - Proper error handling and logging should be implemented

3. **Environment Variables**: Confirm all required environment variables are set in App Service Configuration
   - NEXTAUTH_URL (must match the App Service URL)
   - NEXTAUTH_SECRET
   - AZURE_AD_CLIENT_ID
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
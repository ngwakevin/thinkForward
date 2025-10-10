# Azure App Service Deployment Guide

This guide outlines the process for deploying the ThinkForward application to Azure App Service. It provides step-by-step instructions for both automated and manual deployment methods.

## Prerequisites

- Azure account with subscription
- Azure CLI installed (for manual deployments)
- Node.js 20.x LTS installed locally
- Git repository access

## Environment Setup

Before deploying, ensure all required environment variables are configured in Azure App Service:

1. **Authentication Settings**:
   - NEXTAUTH_URL=https://your-app-name.azurewebsites.net
   - NEXTAUTH_SECRET=[your-secret-value]
   - AZURE_AD_CLIENT_ID=[your-ad-client-id]
   - AZURE_AD_CLIENT_SECRET=[your-ad-client-secret]
   - AZURE_AD_TENANT_ID=common

2. **Database Settings**:
   - COSMOS_ENDPOINT=[your-cosmos-endpoint]
   - COSMOS_KEY=[your-cosmos-key]
   - COSMOS_DATABASE=thinkforward

3. **Application Settings**:
   - NODE_ENV=production
   - WEBSITE_NODE_DEFAULT_VERSION=~20
   - WEBSITE_RUN_FROM_PACKAGE=1

## Deployment Options

### Option 1: GitHub Actions Automated Deployment

The repository includes a GitHub Actions workflow for automated deployment:

1. Configure GitHub secrets:
   - Go to repository Settings > Secrets > Actions
   - Add `AZURE_WEBAPP_PUBLISH_PROFILE` secret with the publish profile content from Azure Portal

2. Push to the `azure-deploy-clean` branch to trigger deployment automatically.

3. Monitor deployment progress in the GitHub Actions tab.

### Option 2: Manual Deployment Using Script

For manual deployment using the provided script:

1. Run the deployment preparation script:
   ```bash
   ./scripts/prepare-azure-deploy.sh
   ```

2. Upload the generated ZIP file using Azure Portal:
   - Go to Azure Portal > App Service > Your App > Deployment Center
   - Choose "Manual Deploy" and upload the generated ZIP file

3. Monitor deployment in the Azure Portal.

### Option 3: Azure CLI Deployment

For deployment using Azure CLI:

1. Run the deployment preparation script:
   ```bash
   ./scripts/prepare-azure-deploy.sh
   ```

2. Deploy using Azure CLI:
   ```bash
   az webapp deployment source config-zip \
     --resource-group YOUR_RESOURCE_GROUP \
     --name YOUR_APP_NAME \
     --src deploy-*.zip
   ```

3. Monitor deployment using:
   ```bash
   az webapp log tail --name YOUR_APP_NAME --resource-group YOUR_RESOURCE_GROUP
   ```

## Post-Deployment Verification

After deployment, verify the application is running correctly:

1. **Health Check**:
   - Visit https://your-app-name.azurewebsites.net/api/health
   - Verify that status is "healthy" and all dependencies are reported

2. **Authentication**:
   - Test sign-in with both organizational and personal Microsoft accounts
   - Verify that user profiles are created successfully

3. **Monitoring**:
   - Check Application Insights for errors and performance metrics
   - Review App Service logs for any startup issues

## Troubleshooting

If you encounter deployment issues:

1. **Check App Service Logs**:
   - Go to Azure Portal > App Service > Your App > Monitoring > Log Stream
   - Look for startup errors or missing dependencies

2. **Verify Environment Variables**:
   - Confirm all required environment variables are set correctly
   - Check for any typos in variable names

3. **Check for Network Connectivity**:
   - Ensure the App Service can connect to Cosmos DB
   - Verify outbound connections are allowed

4. **Run in Local Production Mode**:
   - Test the app locally in production mode before deploying
   - Use `.env.production.local` for local testing

## Special Considerations

1. **Cold Start Performance**:
   - The first request after deployment may be slow
   - Consider using Always On setting for production deployments

2. **Scaling**:
   - Configure autoscaling rules for production workloads
   - Monitor CPU and memory usage to determine scaling needs

3. **Backup Strategy**:
   - Enable automated backups for the App Service
   - Test restore procedures regularly
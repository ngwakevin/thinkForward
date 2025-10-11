# Azure Deployment Guide

This guide explains how to deploy the ThinkForward application to Azure App Service using GitHub Actions.

## Prerequisites

1. Azure account with an active subscription
2. Azure App Service instance (thinkforward-dev)
3. GitHub repository with this code
4. Publish profile from Azure App Service

## GitHub Setup

1. Add the following GitHub secrets in your repository settings:
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: The content of the publish profile XML file downloaded from Azure

## Deployment Process

The GitHub Actions workflow will:
1. Trigger on push to the `main` or `azure-deploy-clean` branch
2. Build the Next.js application
3. Create a deployment package (deploy.zip)
4. Deploy the package to Azure App Service

## Manual Deployment

If you prefer to deploy manually:

```bash
# Build the application
npm run zip:prebuild

# Upload the deploy.zip file through Azure Portal or CLI
az webapp deployment source config-zip --resource-group <resource-group> --name thinkforward-dev --src deploy.zip
```

## Environment Variables

Make sure the following environment variables are set in your Azure App Service:

- `COSMOS_DB_ENDPOINT`
- `COSMOS_DB_KEY`
- `KEY_VAULT_URI`
- `APP_INSIGHTS_CONNECTION_STRING`

You can run the `scripts/check-azure-env.sh` script locally to verify if all required variables are set.

## Improved Startup Configuration

ThinkForward uses an improved startup approach designed to be more resilient in Azure App Service:

1. **Direct Start Wrapper**: A custom wrapper script (`scripts/next-direct-start.js`) that bypasses the Next.js CLI and starts the server directly, avoiding issues with the read-only filesystem in Azure.

2. **Automatic Recovery**: The startup script will automatically create minimal build files if the .next directory is missing or corrupted.

3. **Dynamic Startup Script**: The `scripts/create-direct-startup.sh` script generates a startup.sh file specifically for Azure App Service.

To use this improved approach, set your App Service startup command to:

```bash
bash scripts/create-direct-startup.sh && bash startup.sh
```

## Testing Deployment Locally

Before deploying to Azure, you can test the deployment process locally:

```bash
# Run the deployment test script
bash scripts/test-azure-deployment.sh
```

This script will:
1. Generate the direct start wrapper
2. Create the startup script
3. Run diagnostics
4. Test the direct start wrapper locally

## Troubleshooting

If you encounter issues with your deployment:

1. Check the GitHub Actions logs for error details
2. Run the diagnostic script in Azure's SSH console:
   ```bash
   cd /home/site/wwwroot && bash scripts/diagnose-nextjs.sh
   ```
3. Verify that all required environment variables are set
4. Check the Azure App Service logs for startup errors

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| "Could not find a production build" | Use the direct start wrapper approach |
| Missing .next directory | The startup script will create minimal build files |
| Permission denied errors | Azure App Service has a read-only filesystem, use environment variables like NEXT_IGNORE_FILESYSTEM_CHECK=1 |
| Port binding errors | Make sure to use the PORT environment variable provided by Azure |

## Application URL

After successful deployment, the application will be available at:
[https://thinkforward-dev.azurewebsites.net/](https://thinkforward-dev.azurewebsites.net/)
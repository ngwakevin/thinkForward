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

## Troubleshooting

1. If deployment fails, check the GitHub Actions logs for error details
2. Verify that the publish profile is correctly set as a GitHub secret
3. Check if all required environment variables are set in Azure App Service

## Application URL

After successful deployment, the application will be available at:
[https://thinkforward-dev.azurewebsites.net/](https://thinkforward-dev.azurewebsites.net/)
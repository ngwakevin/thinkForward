# Azure Deployment Setup

This guide walks you through setting up Azure deployment for the ThinkForward application.

## Prerequisites

- Azure account with an active subscription
- GitHub repository for your project
- Azure CLI installed locally

## Step 1: Generate a Publish Profile

Run the provided script to generate a publish profile:

```bash
./scripts/generate-azure-publish-profile.sh
```

This script will:
1. Log you in to Azure
2. Let you select your subscription
3. Choose the resource group where your app service is located (or create a new one)
4. Generate a publish profile for your app service
5. Save it to a file called `thinkforward-webapp-publish-profile.xml`

## Step 2: Add the Publish Profile to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
5. Value: Paste the entire contents of the `thinkforward-webapp-publish-profile.xml` file
6. Click "Add secret"

## Step 3: Configure Environment Variables in Azure

Set the following environment variables in the Azure App Service:

1. Navigate to your App Service in the Azure Portal
2. Go to Settings > Configuration > Application settings
3. Add the following key-value pairs:

```
NODE_ENV: production
NEXTAUTH_URL: https://your-app-service-url.azurewebsites.net
NEXTAUTH_SECRET: your-strong-secret-value
AZURE_AD_CLIENT_ID: your-azure-ad-client-id
AZURE_AD_CLIENT_SECRET: your-azure-ad-client-secret
AZURE_AD_TENANT_ID: common (or your tenant ID)
COSMOS_ENDPOINT: your-cosmos-db-endpoint
COSMOS_KEY: your-cosmos-db-key
COSMOS_DATABASE: thinkforward
```

## Step 4: Run the GitHub Actions Workflow

Your GitHub Actions workflow is already set up to deploy to Azure App Service. It will run automatically when you push to the `main` or `azure-deploy-clean` branch, or you can run it manually:

1. Go to your GitHub repository
2. Navigate to Actions tab
3. Select "Azure App Service Deployment" workflow
4. Click "Run workflow"

## Troubleshooting

### Invalid Publish Profile

If you see this error:
```
Error: Deployment Failed, Error: Publish profile is invalid for app-name and slot-name provided. Provide correct publish profile credentials for app.
```

The publish profile doesn't match the app name and slot name. Generate a new publish profile and update the GitHub secret.

### Connection Issues

If the deployment can't connect to Azure:
1. Make sure your publish profile is up to date (generate a new one)
2. Check if your app service still exists
3. Verify you have proper permissions in Azure

### Application Errors

If the deployment succeeds but the application doesn't work:
1. Check the environment variables in Azure App Service
2. Review the application logs in the Azure portal
3. Make sure Cosmos DB is properly configured and accessible
# Azure App Service Environment Variables Setup

## Overview

This guide outlines the required environment variables that need to be configured in your Azure App Service instance for the ThinkForward application.

## Required Environment Variables

### Authentication

```
# NextAuth Configuration
NEXTAUTH_URL=https://<your-app-service-name>.azurewebsites.net
NEXTAUTH_SECRET=<your-secure-random-string>

# Azure AD / Microsoft Authentication
AZURE_AD_CLIENT_ID=<your-azure-ad-client-id>
AZURE_AD_CLIENT_SECRET=<your-azure-ad-client-secret>
AZURE_AD_TENANT_ID=<your-azure-ad-tenant-id>

# Optional: Google Authentication
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

### Database

```
# Cosmos DB Configuration
COSMOS_ENDPOINT=<your-cosmos-db-endpoint>
COSMOS_KEY=<your-cosmos-db-primary-key>
COSMOS_DATABASE=thinkforward

# Optional: PostgreSQL Configuration (if used)
DATABASE_URL=<your-postgres-connection-string>
```

### Storage

```
# Azure Blob Storage Configuration (if used)
AZURE_STORAGE_CONNECTION_STRING=<your-storage-connection-string>
AZURE_STORAGE_ACCOUNT_NAME=<your-storage-account-name>
AZURE_STORAGE_ACCOUNT_KEY=<your-storage-account-key>
AZURE_STORAGE_CONTAINER_NAME=<your-container-name>
```

### Application Settings

```
# Application URL
NEXT_PUBLIC_APP_URL=https://<your-app-service-name>.azurewebsites.net

# Node Environment
NODE_ENV=production

# Optional: API Keys
CALENDLY_API_KEY=<your-calendly-api-key>
SENDGRID_API_KEY=<your-sendgrid-api-key>
```

## How to Configure Environment Variables in Azure App Service

1. **Sign in to Azure Portal** at [https://portal.azure.com](https://portal.azure.com)

2. **Navigate to your App Service**:
   - Search for your App Service name in the top search bar
   - Click on your App Service from the results

3. **Access Configuration Settings**:
   - In the left menu, click on "Configuration"
   - Go to the "Application settings" tab

4. **Add New Application Settings**:
   - Click "New application setting" for each environment variable
   - Enter the name and value for each variable
   - Click "OK" after adding each one
   
5. **Save Changes**:
   - After adding all environment variables, click "Save" at the top
   - Wait for the application to restart

6. **Verify Settings**:
   - After the app restarts, visit your application URL
   - Check that features requiring these variables are working correctly

## Security Considerations

- Store sensitive values like API keys and secrets as Azure App Service configuration settings rather than in code
- Consider using Azure Key Vault for highly sensitive values
- Regularly rotate secrets and update the environment variables accordingly

## Fallback Behavior

The ThinkForward application has been designed with fallback mechanisms:

- If Cosmos DB configuration is missing or invalid, the application will use in-memory storage
- If authentication provider details are missing, those authentication methods will be disabled
- Console logs and warnings will indicate when required variables are missing

## Troubleshooting

If your application is not functioning correctly after setting environment variables:

1. Check the App Service logs for error messages
2. Verify that all required variables are correctly set
3. Restart the App Service after making configuration changes
4. Make sure connection strings and URLs are properly formatted

## Additional Resources

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Managing App Settings in Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/configure-common)
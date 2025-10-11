# Fixing Next.js Build Issues in Azure App Service

This guide addresses the common error:

```
Fatal error during app preparation: Error: Could not find a production build in the '/home/site/next-temp/.next' directory. Try building your app with 'next build' before starting the production server.
```

## Understanding the Issue

Azure App Service uses a read-only filesystem for the main application directory. Next.js requires a writable filesystem for various operations during startup, including handling the build output. The solution involves:

1. Using a custom writable directory (`/home/site/next-temp/.next`) for the Next.js build
2. Ensuring the build files are correctly copied to this directory at startup
3. Configuring Next.js to use this directory for its output

## Solution Components

We've implemented several fixes to address this issue:

### 1. Enhanced Startup Script (`startup.sh`)

Our updated startup script:
- Creates the necessary directories in the writable area (`/home/site/next-temp`)
- Searches for existing Next.js build files in multiple possible locations
- Copies the build files to the writable directory
- Sets the appropriate environment variables
- Validates that critical files are present before starting the server

### 2. Server Configuration (`server.js`)

The server.js file has been updated to:
- Look for the build files in the custom directory
- Perform validation checks on the build directory
- Provide detailed logs for debugging
- Configure Next.js to use the custom directory

### 3. Next.js Configuration (`next.config.mjs`)

The Next.js configuration now:
- Detects when running in Azure App Service
- Sets the appropriate custom directory for the build output
- Creates necessary directories if they don't exist
- Outputs detailed logs for the build process

### 4. Build and Deploy Script (`scripts/deploy-and-build.sh`)

This new script:
- Builds the Next.js application
- Verifies the build is complete and valid
- Prepares the files for Azure App Service deployment
- Creates the necessary configuration files for Azure
- Includes a deploy.sh script that runs during the Azure deployment process

## Deployment Instructions

### Option 1: GitHub Actions Deployment

If you're using GitHub Actions for deployment:

1. Add this step to your workflow YAML file:

```yaml
- name: Build Next.js Application
  run: |
    chmod +x ./scripts/deploy-and-build.sh
    ./scripts/deploy-and-build.sh --prepare-azure

- name: Deploy to Azure Web App
  uses: azure/webapps-deploy@v2
  with:
    app-name: 'your-app-name'
    slot-name: 'production'
    publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
    package: '.azure-deploy'
```

### Option 2: Azure DevOps Pipeline

If you're using Azure DevOps:

1. Add this task to your pipeline:

```yaml
- task: Bash@3
  displayName: 'Build Next.js Application'
  inputs:
    targetType: 'inline'
    script: |
      chmod +x ./scripts/deploy-and-build.sh
      ./scripts/deploy-and-build.sh --prepare-azure

- task: AzureWebApp@1
  displayName: 'Deploy to Azure Web App'
  inputs:
    azureSubscription: '$(azureSubscription)'
    appName: '$(webAppName)'
    package: '.azure-deploy'
```

### Option 3: Manual Deployment

1. Run the build and deploy script locally:
```bash
chmod +x ./scripts/deploy-and-build.sh
./scripts/deploy-and-build.sh --prepare-azure
```

2. Deploy the `.azure-deploy` directory to your Azure App Service:
```bash
az webapp deployment source config-zip -g <resource-group> -n <app-name> --src .azure-deploy.zip
```

## Azure App Service Configuration

1. In the Azure Portal, go to your App Service
2. Navigate to Configuration > General Settings
3. Set the Startup Command to: `./startup.sh`
4. Navigate to Configuration > Application Settings and add:
   - `NEXT_TEMP_DIR`: `/home/site/next-temp`

## Troubleshooting

If you're still experiencing issues:

1. Check the Application Logs in the Azure Portal
2. Look for these specific logs:
   - "Next.js build directory configuration"
   - "Found Next.js build directory"
   - "All critical Next.js build files found!"

3. Common issues and solutions:
   - **Missing build files**: Ensure the build process is completing successfully
   - **Permission issues**: Check that the `/home/site/next-temp` directory exists and is writable
   - **Incorrect startup command**: Ensure the startup command is set to `./startup.sh`

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Next.js Output Mode Options](https://nextjs.org/docs/api-reference/next.config.js/output)
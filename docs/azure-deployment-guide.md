# Azure Deployment Guide

This guide explains Option 1 – deploying the prebuilt `.next` output directly to Azure App Service using GitHub Actions or manual ZIP deployment.

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
2. Build the Next.js application in standalone mode (`output: "standalone"`)
3. Create a deployment package (`deploy.zip`) that includes the `.next` folder, `startup.sh`, and helper scripts
4. Deploy the package to Azure App Service

### Important: Ensure CI/CD Builds Before Deployment

Your GitHub Actions workflow **must** include a build step before deploying to ensure the `.next` directory is properly generated:

```yaml
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build Next.js app (standalone)
        run: npm run build

      - name: Create Azure deploy zip (Option 1)
        run: bash scripts/zip-prebuild.sh
        
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v3
        with:
          app-name: your-app-name
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: deploy.zip
```

## Manual Deployment

If you prefer to deploy manually:

```bash
# ensure clean workspace
git pull
npm ci

# build Next.js in standalone mode
npm run build

# produce deploy.zip (placed in repo root)
bash scripts/zip-prebuild.sh

# upload deploy.zip via Azure CLI
az webapp deployment source config-zip \
  --resource-group <resource-group> \
  --name thinkforward-dev \
  --src deploy.zip
```

## Environment Variables

Make sure the following environment variables are set in your Azure App Service:

- `COSMOS_DB_ENDPOINT`
- `COSMOS_DB_KEY`
- `KEY_VAULT_URI`
- `APP_INSIGHTS_CONNECTION_STRING`

You can run the `scripts/check-azure-env.sh` script locally to verify if all required variables are set.

## Startup Configuration (Option 1)

The repository ships with a committed `startup.sh` designed for Azure App Service:

- Verifies that `.next/standalone/server.js` exists and exits early if the build output was not packaged.
- Restores helper scripts from `public/azure-backup/scripts` if the originals are missing, preventing placeholder fallbacks in production.
- Copies the standalone build into `/home/site/temp/thinkforward-runtime/standalone` and places `.next/static` under that runtime directory so assets are served correctly from `_next/static`.
- Runs the standalone server directly from that runtime folder via `node server.js`.

**App Service start command**: `startup.sh`

No additional generation scripts are required; just ensure the committed `startup.sh` is included in the deployment ZIP.

## Validating the Package Locally

```bash
npm run build
bash scripts/zip-prebuild.sh
unzip -l deploy.zip | grep '\.next/standalone/server.js'
```

If `standalone/server.js` or `scripts/minimal-next-starter.js` is missing from the listing, fix the build/packaging before deploying. The App Service will fall back to the placeholder HTML page if these files are absent.

### One-command local deploy

The `scripts/deploy-azure.sh` helper automates the entire Option 1 flow:

```bash
AZURE_RESOURCE_GROUP=thinkforward-dev-rg \
AZURE_WEBAPP_NAME=thinkforward-dev \
bash scripts/deploy-azure.sh
```

It will:

1. Install dependencies with `npm ci`
2. Run the production build
3. Package the app via `scripts/zip-prebuild.sh`
4. Set the App Service startup command to `startup.sh`
5. Upload `deploy.zip`
6. Restart the App Service so the new startup script is active

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
| "Could not find a production build" | Use the direct start wrapper approach with the /home/site/temp directory |
| Missing .next directory | The startup script will create minimal build files in /home/site/temp/.next |
| Permission denied errors | All file operations use /home/site/temp which is writable even in read-only environments |
| "Read-only file system" errors | The updated scripts use /home/site/temp for all file operations |
| Port binding errors | Make sure to use the PORT environment variable provided by Azure |

## Application URL

After successful deployment, the application will be available at:
[https://thinkforward-dev.azurewebsites.net/](https://thinkforward-dev.azurewebsites.net/)
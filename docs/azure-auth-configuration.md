# Azure Authentication Configuration Guide

## Overview

This guide documents the setup and configuration of Azure AD authentication for the ThinkForward application.

## Azure AD Application Details

- **Application Name**: learnapp
- **Application (client) ID**: `3ca9d2ec-a691-4a58-9658-ecd4fb8d6918`
- **Directory (tenant) ID**: `438537ce-67d5-4799-837e-aa8ba4ed01eb`
- **Object ID**: `3701b0d2-9d3c-4436-a836-21e40d0e4417`
- **Supported account types**: Multiple organizations

## Environment Variables

The following environment variables must be configured in the Azure Web App:

- `AZURE_AD_CLIENT_ID`: The client ID of the Azure AD application
- `AZURE_AD_CLIENT_SECRET`: The client secret of the Azure AD application
- `AZURE_AD_TENANT_ID`: The tenant ID for the Azure AD application
- `NEXTAUTH_URL`: The base URL of the web application (e.g., `https://thinkforward-dev.azurewebsites.net`)
- `NEXTAUTH_SECRET`: A secret value used by NextAuth for encryption

## Configuration Scripts

We've created several scripts to help manage and troubleshoot Azure AD configuration:

### Environment Variable Management

- `scripts/set-azure-auth-vars.sh`: Sets Azure AD environment variables using Azure CLI
- `scripts/set-env-vars-json.sh`: Sets environment variables using a JSON file approach
- `scripts/set-env-vars-direct.sh`: Sets environment variables using Azure REST API
- `scripts/force-env-deploy.sh`: Creates a .env file and sets environment variables in Azure

### Troubleshooting and Verification

- `scripts/check-auth-config.sh`: Checks authentication configuration and environment variables
- `scripts/check-webapp-config.sh`: Checks general webapp configuration
- `scripts/verify-webapp.sh`: Verifies that the webapp and authentication endpoints are accessible
- `scripts/redeploy-webapp.sh`: Restarts and syncs the web app to ensure environment variables are applied

### Diagnostic Tools

- `app/api/diag/route.ts`: A diagnostic API endpoint that displays the runtime environment variables

## Common Issues and Solutions

### Issue: "client_id is required" Error

This error occurs when the AZURE_AD_CLIENT_ID environment variable is not being correctly loaded by the application.

**Solutions:**
1. Verify environment variables are set in Azure App Service Configuration
2. Restart the web app after setting environment variables
3. Use the diagnostic endpoint to verify environment variables at runtime
4. Add fallback values in auth.ts for development

### Issue: Environment Variables Not Applied

**Solutions:**
1. Use `set-env-vars-direct.sh` to set variables directly through the Azure REST API
2. Restart the web app after setting variables
3. Check environment variable configuration with `check-auth-config.sh`

## Authentication Flow

1. User navigates to the application
2. User clicks "Sign in with Microsoft"
3. User is redirected to Microsoft login page
4. After successful authentication, user is redirected back to the callback URL (`/api/auth/callback/microsoft`)
5. NextAuth creates a session for the authenticated user

## Important URLs

- **Web App URL**: `https://thinkforward-dev.azurewebsites.net`
- **Redirect URI**: `https://thinkforward-dev.azurewebsites.net/api/auth/callback/microsoft`
- **Diagnostic endpoint**: `https://thinkforward-dev.azurewebsites.net/api/diag`

## Maintenance Notes

- When rotating client secrets, update both Azure AD and the environment variables
- After deployment, verify authentication is working properly
- Use diagnostic tools to check environment variables if authentication issues occur
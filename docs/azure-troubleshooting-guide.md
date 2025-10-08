# Azure Deployment Troubleshooting Guide

## Common Issues and Solutions

### Environment Variables Not Loading

**Symptoms:**
- Application logs show "environment variable not set" or similar messages
- Authentication fails with "client_id is required" errors
- Environment variables show as set in Azure Portal but not in the application

**Solutions:**

1. **Check Environment Variables in Azure Portal:**
   - Navigate to your App Service in Azure Portal
   - Go to Configuration > Application settings
   - Verify all required environment variables are set
   - Check for typos or incorrect formatting

2. **Restart the Web App:**
   ```bash
   az webapp restart --name "your-app-name" --resource-group "your-resource-group"
   ```

3. **Set Environment Variables Using Azure CLI:**
   ```bash
   az webapp config appsettings set --name "your-app-name" --resource-group "your-resource-group" --settings KEY="VALUE"
   ```

4. **Use REST API for Setting Environment Variables:**
   - For more reliable environment variable setting, use the REST API method
   - See `scripts/set-env-vars-direct.sh` for an example

5. **Create a Diagnostic Endpoint:**
   - Add a simple API endpoint to your application that displays environment variables
   - Use this to check which variables are actually available at runtime

### Authentication Issues

**Symptoms:**
- Users cannot sign in
- Authentication providers not showing up
- Redirect errors or "client_id is required" errors

**Solutions:**

1. **Verify Azure AD Configuration:**
   - Check that client ID and tenant ID match between Azure AD and your app
   - Ensure redirect URI is correctly set in Azure AD app registration
   - Verify that authentication flow (implicit, authorization code, etc.) is correct

2. **Check Callback URLs:**
   - Ensure NEXTAUTH_URL is set correctly
   - Verify that the callback URL matches what's configured in Azure AD
   - Example: `https://your-app-name.azurewebsites.net/api/auth/callback/microsoft`

3. **Authentication Settings Conflict:**
   - If using App Service Authentication AND NextAuth, they may conflict
   - Consider disabling App Service Authentication if using NextAuth

### Deployment Issues

**Symptoms:**
- Deployment shows as successful but changes don't appear
- Environment variables don't update after deployment
- Custom configuration doesn't persist

**Solutions:**

1. **Force a Clean Deployment:**
   - Use `az webapp deployment source sync` to force a sync

2. **Check Deployment Logs:**
   ```bash
   az webapp log deployment show --name "your-app-name" --resource-group "your-resource-group"
   ```

3. **Verify SCM Site:**
   - Access your SCM site at `https://your-app-name.scm.azurewebsites.net`
   - Check the deployment history and logs

## Diagnostic Tools

1. **Application Logs:**
   ```bash
   az webapp log tail --name "your-app-name" --resource-group "your-resource-group"
   ```

2. **Configuration Check:**
   ```bash
   az webapp config appsettings list --name "your-app-name" --resource-group "your-resource-group"
   ```

3. **Resource Health Check:**
   ```bash
   az resource show --ids "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Web/sites/{site-name}" --include-response-body
   ```

## Best Practices

1. **Environment Variable Management:**
   - Use a systematic approach for setting environment variables
   - Document all required environment variables
   - Use scripts to set environment variables consistently

2. **Deployment Process:**
   - Use a CI/CD pipeline for consistent deployments
   - Include environment variable configuration in the deployment process
   - Automate post-deployment verification

3. **Monitoring and Alerts:**
   - Set up monitoring for authentication failures
   - Create alerts for unexpected application behavior
   - Regularly check application logs for errors
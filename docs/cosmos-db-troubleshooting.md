# Troubleshooting Cosmos DB Connection Issues

This guide will help you diagnose and fix connection issues with Azure Cosmos DB in the ThinkForward application.

## Common Error Messages

1. **"Cosmos DB is not properly configured. User data will not be persisted."**
   - This indicates that environment variables for Cosmos DB are missing or invalid.

2. **"Error initializing Cosmos DB: [Error]: The input authorization token can't serve the request."**
   - This indicates an issue with the Cosmos DB key or authentication.

3. **"Failed to update prerender cache... read-only file system"**
   - This is related to filesystem permissions in Azure App Service, not directly related to Cosmos DB but can affect the application.

## Diagnostic Tools

We've provided several tools to help diagnose and fix these issues:

### 1. Test Cosmos DB Connection

Use this script to test your connection to Cosmos DB:

```bash
node scripts/test-cosmos-connection.js
```

This will:
- Check if all required environment variables are set
- Test connectivity to your Cosmos DB account
- Report detailed error information if connection fails
- List containers in the database if connection is successful

### 2. Environment Variable Diagnostics

Use this script to create a diagnostic API endpoint:

```bash
node scripts/create-env-diagnostics.js
```

This will create an endpoint at `/api/diagnostics` that provides information about:
- Which environment variables are set (without exposing values)
- Filesystem permissions in the Azure App Service environment
- Cosmos DB connection status

### 3. Fix Cosmos Connection Script

This script diagnoses and fixes common issues with Cosmos DB connection:

```bash
./scripts/fix-cosmos-connection.sh
```

This will:
- Check environment variables
- Validate endpoint and key format
- Create necessary directories for Azure App Service
- Extract credentials from JSON files if available
- Generate a startup.sh script with fixes

## Environment Variables

The application uses these environment variables for Cosmos DB:

| Variable | Alternative | Description |
|----------|-------------|-------------|
| `COSMOS_ENDPOINT` | `COSMOS_DB_ENDPOINT` | The endpoint URL for your Cosmos DB account |
| `COSMOS_KEY` | `COSMOS_DB_KEY` | The primary key for your Cosmos DB account |
| `COSMOS_DATABASE` | `COSMOS_DB_DATABASE_ID` | The database name (defaults to "thinkforward") |

## Common Issues and Solutions

### 1. Environment Variable Naming

**Issue**: The application code might be looking for one naming convention while you're using another.

**Solution**: The application now supports both naming conventions (`COSMOS_*` and `COSMOS_DB_*`). Ensure at least one set is correctly configured.

### 2. Empty or Invalid Keys

**Issue**: The Cosmos DB key might be empty, truncated, or invalid.

**Solution**: Verify your key in the Azure Portal and ensure it's correctly set in the environment variables. Use the `fix-cosmos-connection.sh` script to diagnose key issues.

### 3. Read-Only Filesystem in Azure App Service

**Issue**: Azure App Service uses a read-only filesystem which can cause issues with Next.js prerendering and caching.

**Solution**: 
- The application now uses `/home/site/next-temp` for temporary files.
- The startup script ensures this directory exists.
- The next.config.mjs file configures Next.js to use this directory.

### 4. Authentication Token Issues

**Issue**: "The input authorization token can't serve the request" usually indicates an invalid or expired key.

**Solution**:
1. Regenerate your Cosmos DB key in the Azure Portal
2. Update the environment variable in your deployment
3. Check if your IP address is allowed in the Cosmos DB firewall settings

## Azure Deployment Configuration

For Azure App Service deployments, ensure:

1. The startup command is set to `./startup.sh` in the Azure Portal
2. All required environment variables are set in the Application Settings
3. The application has access to create directories in `/home/site/`

## Testing Your Fix

After applying fixes:

1. Run the test script to verify the connection:
   ```bash
   node scripts/test-cosmos-connection.js
   ```

2. Check the application logs for connection success messages
   ```
   Cosmos DB configuration status: VALID
   Database and containers initialized successfully
   ```

3. Check for failed authentication errors:
   ```
   Error initializing Cosmos DB: [Error]: The input authorization token can't serve the request.
   ```

## Support

If you continue to experience issues after applying these fixes, check:

1. Azure status page for Cosmos DB service issues
2. Network connectivity between your application and Cosmos DB
3. IP restrictions in your Cosmos DB account
4. Resource group and subscription access permissions

## Further Resources

- [Azure Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [Next.js Deployment to Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/deploy-nextjs)
# ThinkForward Azure Scripts

This directory contains scripts used to deploy and run the ThinkForward application on Azure App Service. The scripts are designed to handle the read-only filesystem constraints of Azure App Service and provide robust fallback mechanisms.

## Key Scripts

### Deployment Scripts

- **deploy-to-azure.sh**: Builds and deploys the application to Azure App Service
- **zip-prebuild.sh**: Creates the deployment package with optimized settings
- **create-direct-startup.sh**: Creates the startup script used by Azure App Service
- **fetch-azure-resources.sh**: Fetches Azure resource information for local development

### Runtime Scripts

- **minimal-next-starter.js**: Multi-strategy Next.js starter with fallback mechanisms
- **emergency-server.js**: Emergency HTTP server when Next.js fails to start
- **comprehensive-nextjs-diagnostics.js**: Diagnostic tool for troubleshooting

## Multi-Layer Failover System

The application uses a multi-layer failover system to ensure robustness:

1. **Primary Start**: Standard Next.js startup with server.js
2. **Fallback 1**: minimal-next-starter.js with multiple module loading approaches
3. **Fallback 2**: Direct Next.js start command
4. **Emergency Mode**: Dedicated emergency server with diagnostic dashboard

## Azure App Service Configuration

The deployment scripts configure Azure App Service with these settings:

- **Startup Command**: `cd /home/site/wwwroot && bash scripts/create-direct-startup.sh && bash startup.sh`
- **Node.js Version**: 20-lts
- **Environment Variables**:
  - WEBSITE_RUN_FROM_PACKAGE=1
  - NEXT_IGNORE_FILESYSTEM_CHECK=1
  - NEXT_MANUAL_SIG_HANDLE=true
  - NEXT_TELEMETRY_DISABLED=1
  - NEXT_TEMP_DIR=/home/site/next-temp
  - NEXT_DIST_DIR=/home/site/next-temp/.next

## Emergency Recovery

If the application enters emergency mode, see the [Emergency Recovery Guide](../docs/emergency-recovery-guide.md) for detailed recovery procedures.

## Development and Testing

For local development and testing of the deployment process:

1. Run `scripts/test-azure-deployment.sh` to simulate the Azure environment
2. Check logs for any issues with module resolution or filesystem access

## Script Maintenance

When updating these scripts, follow these guidelines:

1. Always include all diagnostic and emergency scripts in the deployment package
2. Set proper executable permissions with `chmod +x`
3. Test changes locally before deployment
4. Document any changes to the failover logic

## Further Information

See the [Azure Deployment Guide](../docs/azure-deployment-guide.md) for detailed information about the deployment process and architecture.
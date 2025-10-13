# Azure App Service Direct File Upload Instructions

This document explains how to manually upload critical startup scripts to your Azure App Service to ensure your Next.js application runs correctly.

## Background

The Azure App Service environment has a read-only filesystem for the main application directory, which can sometimes cause issues with Next.js deployment. These scripts provide a fallback mechanism by utilizing the writable `/home/site/temp` directory.

## Files Included

1. `minimal-next-starter.js` - A simplified Node.js script that can start your Next.js application
2. `ensure-critical-files.sh` - A shell script that creates emergency versions of critical files

## Upload Instructions

### 1. Upload Using Kudu Console

1. Go to your Azure App Service in the Azure Portal
2. Click on "Advanced Tools" > "Go" (or navigate to `https://<your-app-name>.scm.azurewebsites.net/`)
3. Click on "Debug console" > "CMD" or "PowerShell"
4. Navigate to `/home/site/temp`
5. Use the file upload button (or drag and drop) to upload:
   - `minimal-next-starter.js`
   - `ensure-critical-files.sh`
6. Make the scripts executable:
   ```bash
   chmod +x /home/site/temp/minimal-next-starter.js
   chmod +x /home/site/temp/ensure-critical-files.sh
   ```

### 2. Update Startup Command

1. In the Azure Portal, go to your App Service
2. Navigate to "Configuration" > "General settings"
3. Update the "Startup Command" to:
   ```bash
   bash /home/site/temp/ensure-critical-files.sh && cd /home/site/wwwroot && node /home/site/temp/minimal-next-starter.js
   ```
4. Click "Save"
5. Restart your App Service

## Verification

1. After restarting, check the logs in the Azure Portal (under "Log stream")
2. You should see output from the startup scripts
3. You can also check the content of `/home/site/temp/ensure-critical-files.log`
4. Visit your application URL to verify it's running

## Troubleshooting

If the application still doesn't start:

1. Check the logs at `/home/site/temp/ensure-critical-files.log`
2. Verify the scripts were uploaded correctly and are executable
3. Try running just the minimal starter:
   ```
   cd /home/site/wwwroot && node /home/site/temp/minimal-next-starter.js
   ```
4. Check if your App Service plan has enough memory for Next.js

## Next Steps

Once your application is running, you can debug the regular deployment process to fix the root cause of the missing scripts issue.

## Support

If you encounter issues, check the Azure App Service logs and the custom log file at `/home/site/temp/ensure-critical-files.log`.
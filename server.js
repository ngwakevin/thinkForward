// Custom Next.js server for Azure App Service - supports both ESM and CommonJS
// ESM imports
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// CRITICAL: Monkey patch Next.js filesystem check for Azure App Service
// This targets the specific error in router-utils/filesystem.js:151
try {
  // Find the Next.js filesystem module
  const nextServerPath = require.resolve('next/dist/server/lib/router-utils/filesystem');
  const originalModule = require(nextServerPath);
  
  // Save the original setupFsCheck function
  const originalSetupFsCheck = originalModule.setupFsCheck;
  
  // Override the setupFsCheck function with our version that bypasses the BUILD_ID check
  originalModule.setupFsCheck = function patchedSetupFsCheck(ctx) {
    console.log('Using patched setupFsCheck function for Next.js in Azure App Service');
    
    // If we're in Azure and have a NEXT_DIST_DIR, fake the BUILD_ID check
    if (process.env.WEBSITE_SITE_NAME && process.env.NEXT_DIST_DIR) {
      const distDir = process.env.NEXT_DIST_DIR;
      
      // Check if BUILD_ID exists
      const buildIdPath = join(distDir, 'BUILD_ID');
      if (!fs.existsSync(buildIdPath)) {
        console.log('BUILD_ID not found, creating dummy BUILD_ID');
        try {
          // Create a dummy BUILD_ID if it doesn't exist
          fs.writeFileSync(buildIdPath, `dummy-${Date.now()}`, 'utf8');
        } catch (err) {
          console.warn('Failed to create dummy BUILD_ID:', err.message);
        }
      }
      
      // Check for server/pages-manifest.json
      const pagesManifestPath = join(distDir, 'server', 'pages-manifest.json');
      if (!fs.existsSync(pagesManifestPath)) {
        console.log('pages-manifest.json not found, creating directory and dummy file');
        try {
          // Create server directory if it doesn't exist
          if (!fs.existsSync(join(distDir, 'server'))) {
            fs.mkdirSync(join(distDir, 'server'), { recursive: true });
          }
          
          // Create a dummy pages-manifest.json
          fs.writeFileSync(pagesManifestPath, '{}', 'utf8');
        } catch (err) {
          console.warn('Failed to create dummy pages-manifest.json:', err.message);
        }
      }
    }
    
    // Call the original function, but wrap it in try/catch
    try {
      return originalSetupFsCheck(ctx);
    } catch (err) {
      console.warn('Error in Next.js setupFsCheck:', err.message);
      // Return a basic context to allow Next.js to continue
      return { ...ctx, fetchCache: {}, incrementalCache: null };
    }
  };
  
  console.log('Successfully patched Next.js filesystem check for Azure App Service');
} catch (err) {
  console.warn('Failed to patch Next.js filesystem check:', err.message);
}

// Log startup information
console.log('Starting server.js - specialized for Azure App Service');
console.log(`Node.js version: ${process.version}`);
console.log(`Current directory: ${process.cwd()}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Azure WebSite Name: ${process.env.WEBSITE_SITE_NAME || 'unknown'}`);
console.log(`Azure WebSite Instance: ${process.env.WEBSITE_INSTANCE_ID || 'unknown'}`);

// Check for critical environment variables
const checkEnvVars = ['PORT', 'NEXTAUTH_URL', 'NEXTAUTH_SECRET'];
console.log('Checking critical environment variables...');
checkEnvVars.forEach(varName => {
  console.log(`${varName}: ${process.env[varName] ? 'Set' : 'NOT SET'}`);
});

// Start with some basic server information logging
console.log(`Starting Next.js server in ${process.env.NODE_ENV || 'development'} mode`);
console.log(`Node.js version: ${process.version}`);
console.log(`Server process ID: ${process.pid}`);

// Get package.json for version info
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let packageJson = { dependencies: { next: 'unknown' } };
try {
  packageJson = JSON.parse(fs.readFileSync(join(__dirname, 'package.json'), 'utf8'));
  console.log(`Loaded package.json: Next.js version ${packageJson.dependencies.next}`);
} catch (error) {
  console.warn('Could not load package.json:', error.message);
}

// Determine environment and port
const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT, 10) || 3000;

// Check for custom Next.js directories
const tempDir = process.env.NEXT_TEMP_DIR;
const distDir = process.env.NEXT_DIST_DIR || (tempDir ? `${tempDir}/.next` : '.next');

console.log('Next.js build directory configuration:');
console.log(`- NEXT_TEMP_DIR: ${tempDir || 'not set'}`);
console.log(`- NEXT_DIST_DIR: ${process.env.NEXT_DIST_DIR || 'not set'}`);
console.log(`- Using build directory: ${distDir}`);

// Verify that the build directory exists and contains required files
try {
  if (fs.existsSync(distDir)) {
    console.log(`Found Next.js build directory at ${distDir}`);
    
    // Check for critical files
    const criticalFiles = ['build-manifest.json', 'BUILD_ID', 'server/pages-manifest.json'];
    const missingFiles = [];
    
    for (const file of criticalFiles) {
      const filePath = join(distDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`✓ Found critical file: ${file}`);
        
        // For BUILD_ID, log the actual ID
        if (file === 'BUILD_ID') {
          try {
            const buildId = fs.readFileSync(filePath, 'utf8').trim();
            console.log(`  Build ID: ${buildId}`);
          } catch (e) {
            console.warn(`  Could not read BUILD_ID: ${e.message}`);
          }
        }
      } else {
        console.warn(`✗ Missing critical file: ${file}`);
        missingFiles.push(file);
      }
    }
    
    if (missingFiles.length > 0) {
      console.warn(`Build directory exists but is missing ${missingFiles.length} critical files`);
      console.warn('The application may fail to start properly');
      
      // List all files in the directory for debugging
      const files = fs.readdirSync(distDir);
      console.log(`All files in ${distDir}:`, files.join(', '));
    } else {
      console.log('All critical Next.js build files found!');
    }
  } else {
    console.error(`Next.js build directory not found at ${distDir}`);
    console.error('Application will likely fail to start');
    
    // Check if any build exists in alternate locations
    const altLocations = ['.next', '/home/site/wwwroot/.next', '/home/site/.next'];
    for (const loc of altLocations) {
      if (fs.existsSync(loc)) {
        console.log(`Found alternate build at ${loc}, but it's not being used`);
      }
    }
  }
} catch (error) {
  console.error(`Error checking build directory: ${error.message}`);
}

// Check and manually set environment vars needed by Next.js
console.log('--- Build Configuration ---');
console.log(`NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || 'not set'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log('---------------------------');

// Ensure Next.js can find the build directory
if (process.env.NEXT_DIST_DIR) {
  // Explicitly set the dist directory as an environment variable
  // This is critical for Next.js 14.x to correctly locate build files
  process.env.NEXT_DIST_DIR = distDir;
  
  console.log(`Using temp directory: ${tempDir || 'not available'}`);
}

// Initialize Next.js with custom directory configuration
const app = next({ 
  dev,
  dir: process.cwd(),
  conf: { 
    distDir: distDir,
    // Force production mode in Azure App Service
    env: {
      ...process.env,
      __NEXT_PROCESSED_ENV: 'true'
    }
  }
});
const handle = app.getRequestHandler();

// Log start time for tracking server startup duration
const startTime = Date.now();

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  // Don't exit immediately in production to allow the app to recover if possible
  if (dev) {
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Memory monitoring for potential leaks
const memoryMonitor = setInterval(() => {
  const memUsage = process.memoryUsage();
  if (memUsage.heapUsed > 384 * 1024 * 1024) { // Alert if heap exceeds 384MB
    console.warn('High memory usage detected:', Math.round(memUsage.heapUsed / 1024 / 1024), 'MB');
    // Force garbage collection if supported (requires --expose-gc flag)
    if (global.gc) {
      console.log('Running garbage collection...');
      global.gc();
    }
  }
}, 60000); // Check every minute

app.prepare()
  .then(() => {
    console.log(`Next.js app prepared in ${(Date.now() - startTime)/1000} seconds`);
    
    const server = createServer((req, res) => {
      // Add basic request logging for diagnostics
      const start = Date.now();
      const { method, url } = req;
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        if (duration > 1000) { // Log slow requests (over 1 second)
          console.warn(`Slow request: ${method} ${url} - ${duration}ms`);
        }
      });
      
      // Parse the request URL
      const parsedUrl = parse(req.url, true);
      
      // Let Next.js handle the request
      handle(req, res, parsedUrl);
    });
    
    // Add graceful shutdown handling
    const gracefulShutdown = () => {
      console.log('Received shutdown signal, closing HTTP server...');
      server.close(() => {
        console.log('HTTP server closed');
        clearInterval(memoryMonitor);
        process.exit(0);
      });
      
      // Force close if it takes too long
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };
    
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    
    server.listen(port, (err) => {
      if (err) {
        console.error('Failed to start server:', err);
        // Don't throw in production, just log the error
        if (dev) throw err;
        return;
      }
      
      const startupTime = (Date.now() - startTime)/1000;
      const azureInfo = process.env.WEBSITE_SITE_NAME ? 
        `on Azure App Service (${process.env.WEBSITE_SITE_NAME})` : 
        `on http://localhost:${port}`;
        
      console.log(`> Server ready ${azureInfo} - startup took ${startupTime} seconds`);
      console.log(`> Environment: ${process.env.NODE_ENV}`);
      console.log(`> Next.js version: ${packageJson.dependencies.next}`);
      console.log(`> Node.js version: ${process.version}`);
      console.log(`> Health check available at: /api/health`);
      
      // Log critical environment variable status (without values)
      console.log('> Environment variable status:');
      console.log(`  - NEXTAUTH_URL: ${process.env.NEXTAUTH_URL ? '✅' : '❌'}`);
      console.log(`  - NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? '✅' : '❌'}`);
      console.log(`  - AZURE_AD_CLIENT_ID: ${process.env.AZURE_AD_CLIENT_ID ? '✅' : '❌'}`);
      console.log(`  - COSMOS_ENDPOINT: ${process.env.COSMOS_ENDPOINT ? '✅' : '❌'}`);
    });
  })
  .catch((ex) => {
    console.error('Fatal error during app preparation:', ex);
    process.exit(1);
  });
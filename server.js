// Custom Next.js server for Azure App Service - supports both ESM and CommonJS
// ESM imports
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

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

// Initialize Next.js
const app = next({ dev });
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
      if (err) throw err;
      const startupTime = (Date.now() - startTime)/1000;
      console.log(`> Ready on http://localhost:${port} - startup took ${startupTime} seconds`);
      console.log(`> Environment: ${process.env.NODE_ENV}`);
      console.log(`> Next.js version: ${packageJson.dependencies.next}`);
      console.log(`> Node.js version: ${process.version}`);
      console.log(`> Health check available at: http://localhost:${port}/api/health`);
    });
  })
  .catch((ex) => {
    console.error('Fatal error during app preparation:', ex);
    process.exit(1);
  });
// Custom Next.js server for Azure App Service
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

// Log startup information
console.log('Starting server.js - Azure App Service version');
console.log(`Node.js version: ${process.version}`);
console.log(`Current directory: ${process.cwd()}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Azure WebSite Name: ${process.env.WEBSITE_SITE_NAME || 'unknown'}`);

// Determine environment and port
const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT, 10) || 3000;

// Get the custom Next.js directory
const nextDistDir = process.env.NEXT_DIST_DIR || '/home/site/next-temp/.next';
console.log(`Using Next.js dist directory: ${nextDistDir}`);

// Special handling for Azure App Service
const isAzure = !!process.env.WEBSITE_SITE_NAME;
if (isAzure) {
  console.log('Running in Azure App Service environment');
  
  // Check for the Next.js build directory
  if (fs.existsSync(nextDistDir)) {
    console.log(`Next.js build directory exists at ${nextDistDir}`);
    
    // Check for essential files
    const buildIdPath = path.join(nextDistDir, 'BUILD_ID');
    if (fs.existsSync(buildIdPath)) {
      const buildId = fs.readFileSync(buildIdPath, 'utf8').trim();
      console.log(`Found Next.js build ID: ${buildId}`);
    } else {
      console.log('WARNING: BUILD_ID file not found');
    }
  } else {
    console.log(`Next.js build directory does not exist at ${nextDistDir}`);
  }
}

// Initialize Next.js app
const app = next({
  dev,
  dir: process.cwd(),
  conf: {
    distDir: isAzure ? nextDistDir : '.next'
  }
});

const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    console.log('Next.js app prepared successfully');
    
    const server = createServer((req, res) => {
      // Parse request URL
      const parsedUrl = parse(req.url, true);
      
      // Let Next.js handle the request
      handle(req, res, parsedUrl);
    });
    
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error preparing Next.js app:');
    console.error(err);
    process.exit(1);
  });
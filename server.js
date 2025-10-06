// Custom Next.js server for Azure App Service
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Determine environment and port
const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT, 10) || 3000;

// Initialize Next.js
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    createServer((req, res) => {
      // Parse the request URL
      const parsedUrl = parse(req.url, true);
      
      // Let Next.js handle the request
      handle(req, res, parsedUrl);
    })
    .listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
      console.log(`> Environment: ${process.env.NODE_ENV}`);
      console.log(`> Next.js version: ${require('next/package.json').version}`);
      console.log(`> Node.js version: ${process.version}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
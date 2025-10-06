// Custom Next.js server for Azure App Service using ES modules
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get package.json for version info
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(fs.readFileSync(join(__dirname, 'package.json'), 'utf8'));

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
      console.log(`> Next.js version: ${packageJson.dependencies.next}`);
      console.log(`> Node.js version: ${process.version}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
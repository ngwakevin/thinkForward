#!/usr/bin/env node
/**
 * Fallback emergency Express-like server.
 * Keeps the Azure App Service instance alive and logs requests.
 */

const http = require('http');

const port = process.env.PORT || 8080;

http.createServer((req, res) => {
  console.log(`[fallback] ${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({
    status: 'fallback',
    message: 'ThinkForward emergency server is running placeholder responses.',
    nextStep: 'Redeploy application package with full server bundle.'
  }));
}).listen(port, () => {
  console.log(`[fallback] Emergency placeholder server listening on ${port}`);
});

#!/usr/bin/env node
/**
 * Fallback minimal Next.js starter placeholder.
 * Serves a simple HTML status page so Azure stays healthy
 * even if the real starter script goes missing.
 */

const http = require('http');

const port = process.env.PORT || 8080;

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>ThinkForward | Maintenance</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 2rem auto; max-width: 640px; line-height: 1.6; }
      h1 { font-size: 1.75rem; margin-bottom: 1rem; }
      code { background: #f2f2f2; padding: 0.2rem 0.4rem; border-radius: 4px; }
      .card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; background: #fafafa; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>ThinkForward app is warming up</h1>
      <p>This is a safety fallback script. It loads when the primary <code>scripts/minimal-next-starter.js</code> is missing.</p>
      <p>Please redeploy the application package so the full Next.js server can start.</p>
    </div>
  </body>
</html>`;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}).listen(port, () => {
  console.log(`[fallback] Minimal starter placeholder is listening on ${port}`);
});

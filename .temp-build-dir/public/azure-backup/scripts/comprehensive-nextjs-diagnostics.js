#!/usr/bin/env node
/**
 * Diagnostics placeholder that prints useful runtime details when the
 * primary diagnostics script is unavailable.
 */

const fs = require('fs');
const path = require('path');

const log = (label, value) => {
  console.log(`[fallback:diagnostics] ${label}:`, value);
};

log('timestamp', new Date().toISOString());
log('node.version', process.version);
log('env.NODE_ENV', process.env.NODE_ENV);
log('env.PORT', process.env.PORT);
log('cwd', process.cwd());

const nextDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextDir)) {
  log('.next contents', fs.readdirSync(nextDir));
} else {
  log('.next contents', 'missing');
}

log('note', 'Primary diagnostics script missing. Redeploy the full package to restore enhanced diagnostics.');

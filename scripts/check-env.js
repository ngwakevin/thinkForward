#!/usr/bin/env node
import fs from 'node:fs';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load .env.local if present so checks reflect local values
try {
  // 1) Try from current working directory
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
  // 2) Fallback to path relative to this script (../.env.local)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
} catch {}

const optionalClient = ['NEXT_PUBLIC_CALENDLY_URL'];
const requiredServerForAuth = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'AZURE_AD_CLIENT_ID',
  'AZURE_AD_CLIENT_SECRET',
  'AZURE_AD_TENANT_ID',
];

const missingOptional = optionalClient.filter((k) => !process.env[k]);
if (missingOptional.length) {
  console.log('\x1b[33m[env-check]\x1b[0m Missing (optional) vars:', missingOptional.join(', '));
} else {
  console.log('\x1b[32m[env-check]\x1b[0m All optional client vars present');
}

const authWanted = Boolean(process.env.AZURE_AD_CLIENT_ID || process.env.NEXTAUTH_URL);
if (authWanted) {
  const missingAuth = requiredServerForAuth.filter((k) => !process.env[k]);
  if (missingAuth.length) {
    console.log('\x1b[33m[env-check]\x1b[0m Auth detected but missing required vars:', missingAuth.join(', '));
  } else {
    console.log('\x1b[32m[env-check]\x1b[0m Auth env looks complete');
  }
}

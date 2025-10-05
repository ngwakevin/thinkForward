#!/usr/bin/env node
import fs from 'node:fs';

const requiredClient = ['NEXT_PUBLIC_CALENDLY_URL'];
let missing = [];
for (const key of requiredClient) {
  if (!process.env[key]) missing.push(key);
}
if (missing.length) {
  console.log('\x1b[33m[env-check]\x1b[0m Missing (optional) vars:', missing.join(', '));
} else {
  console.log('\x1b[32m[env-check]\x1b[0m All optional client vars present');
}

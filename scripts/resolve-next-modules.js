#!/usr/bin/env node
/**
 * Module Resolver for Azure App Service
 * 
 * This script helps resolve Next.js modules in Azure's read-only environment
 * by checking various possible locations and copying necessary files to a writable location.
 */

const fs = require('fs');
const path = require('path');

console.log('Starting Next.js Module Resolver for Azure...');
console.log(`Node version: ${process.version}`);
console.log(`Current directory: ${process.cwd()}`);

// Set up writable directory
const TEMP_DIR = '/home/site/temp';

// Possible locations for Next.js modules
const possibleLocations = [
  './node_modules/next',
  '/home/site/wwwroot/node_modules/next',
  '/home/site/repository/node_modules/next',
  '../node_modules/next'
];

// Function to check if a module exists at a given path
function checkModuleAtPath(basePath) {
  try {
    const fullServerPath = path.join(basePath, 'dist/server/next.js');
    const fullCliPath = path.join(basePath, 'dist/bin/next');
    
    const serverExists = fs.existsSync(fullServerPath);
    const cliExists = fs.existsSync(fullCliPath);
    
    console.log(`Checking ${basePath}:`);
    console.log(`  - server module: ${serverExists ? 'Found' : 'Missing'}`);
    console.log(`  - CLI module: ${cliExists ? 'Found' : 'Missing'}`);
    
    return {
      path: basePath,
      serverPath: fullServerPath,
      cliPath: fullCliPath,
      serverExists,
      cliExists
    };
  } catch (err) {
    console.error(`Error checking ${basePath}:`, err.message);
    return {
      path: basePath,
      serverExists: false,
      cliExists: false
    };
  }
}

// Check all possible locations
console.log('Checking for Next.js modules in possible locations...');
const moduleLocations = possibleLocations.map(checkModuleAtPath);

// Find the first valid location that has both modules
const validLocation = moduleLocations.find(location => location.serverExists && location.cliExists);

if (!validLocation) {
  console.error('ERROR: Could not find Next.js modules in any expected location!');
  
  // Count what we found
  const serverLocations = moduleLocations.filter(location => location.serverExists);
  const cliLocations = moduleLocations.filter(location => location.cliExists);
  
  console.log(`Found server module in ${serverLocations.length} locations.`);
  console.log(`Found CLI module in ${cliLocations.length} locations.`);
  
  // Try to create symbolic links if we have partial matches
  if (serverLocations.length > 0) {
    console.log('Creating temp directory for Next.js modules...');
    try {
      if (!fs.existsSync(path.join(TEMP_DIR, 'next', 'dist', 'server'))) {
        fs.mkdirSync(path.join(TEMP_DIR, 'next', 'dist', 'server'), { recursive: true });
      }
      
      // Copy the server module
      console.log(`Copying server module from ${serverLocations[0].serverPath} to ${TEMP_DIR}/next/dist/server/next.js...`);
      fs.copyFileSync(serverLocations[0].serverPath, path.join(TEMP_DIR, 'next', 'dist', 'server', 'next.js'));
    } catch (err) {
      console.error('Error copying server module:', err.message);
    }
  }
  
  if (cliLocations.length > 0) {
    try {
      if (!fs.existsSync(path.join(TEMP_DIR, 'next', 'dist', 'bin'))) {
        fs.mkdirSync(path.join(TEMP_DIR, 'next', 'dist', 'bin'), { recursive: true });
      }
      
      // Copy the CLI module
      console.log(`Copying CLI module from ${cliLocations[0].cliPath} to ${TEMP_DIR}/next/dist/bin/next...`);
      fs.copyFileSync(cliLocations[0].cliPath, path.join(TEMP_DIR, 'next', 'dist', 'bin', 'next'));
    } catch (err) {
      console.error('Error copying CLI module:', err.message);
    }
  }
  
  // Create an export file in the temp directory
  try {
    console.log('Creating module resolver in temp directory...');
    const resolverContent = `
      module.exports = {
        resolveNextServer: function() {
          try {
            return require('/home/site/wwwroot/node_modules/next/dist/server/next');
          } catch (err) {
            try {
              return require('${TEMP_DIR}/next/dist/server/next');
            } catch (err2) {
              throw new Error('Could not resolve Next.js server module: ' + err2.message);
            }
          }
        },
        resolveNextCli: function() {
          try {
            return require('/home/site/wwwroot/node_modules/next/dist/bin/next');
          } catch (err) {
            try {
              return require('${TEMP_DIR}/next/dist/bin/next');
            } catch (err2) {
              throw new Error('Could not resolve Next.js CLI module: ' + err2.message);
            }
          }
        }
      };
    `;
    
    fs.writeFileSync(path.join(TEMP_DIR, 'next-resolver.js'), resolverContent, 'utf8');
    console.log(`Created module resolver at ${TEMP_DIR}/next-resolver.js`);
  } catch (err) {
    console.error('Error creating module resolver:', err.message);
  }
} else {
  console.log(`Found valid Next.js modules at ${validLocation.path}`);
  
  try {
    // Create symbolic links to the valid location in the temp directory
    console.log('Creating symbolic links to valid modules in temp directory...');
    
    if (!fs.existsSync(path.join(TEMP_DIR, 'next'))) {
      fs.mkdirSync(path.join(TEMP_DIR, 'next'), { recursive: true });
    }
    
    // Create symlink to the entire valid location
    fs.symlinkSync(validLocation.path, path.join(TEMP_DIR, 'next'), 'dir');
    console.log(`Created symlink from ${validLocation.path} to ${TEMP_DIR}/next`);
  } catch (err) {
    console.error('Error creating symlinks:', err.message);
  }
}

console.log('Module resolver execution complete.');
#!/usr/bin/env node

/**
 * ThinkForward Security Check Script
 * 
 * This script performs basic security checks on the codebase to identify common vulnerabilities.
 * It checks for:
 * 1. Hardcoded secrets in code files
 * 2. Insecure dependencies with known vulnerabilities
 * 3. Missing security headers in API routes
 * 4. Unprotected routes that should require authentication
 * 5. Insecure configuration settings
 * 
 * Usage: npm run security:check
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

// Configuration
const config = {
  // Directories to scan
  scanDirs: ['app', 'components', 'lib', 'pages', 'api'],
  
  // Extensions to check
  fileExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  
  // Patterns that might indicate security issues
  patterns: {
    hardcodedSecrets: [
      /['"](?:password|secret|token|key|auth|pwd|pass)['"]:\s*['"][^'"]{8,}['"]/i,
      /const\s+(?:password|secret|token|key|auth|pwd|pass)\s*=\s*['"][^'"]{8,}['"]/i,
      /let\s+(?:password|secret|token|key|auth|pwd|pass)\s*=\s*['"][^'"]{8,}['"]/i,
      /var\s+(?:password|secret|token|key|auth|pwd|pass)\s*=\s*['"][^'"]{8,}['"]/i,
    ],
    insecureConfig: [
      /secure:\s*false/i,
      /validateCertificate:\s*false/i,
      /rejectUnauthorized:\s*false/i,
    ],
    potentialXSS: [
      /dangerouslySetInnerHTML/i,
      /innerHTML\s*=/i,
      /document\.write/i,
    ],
  },
  
  // Protected paths that should have auth checks
  protectedPaths: [
    '/api/profile',
    '/api/user',
    '/api/admin',
    '/api/billing',
  ],
  
  // Required security headers
  requiredHeaders: [
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
    'Referrer-Policy',
  ],
};

// Results tracking
let securityIssues = 0;
let filesScanned = 0;

console.log(chalk.blue('\n🔒 ThinkForward Security Check\n'));

// Step 1: Check for hardcoded secrets and other pattern-based vulnerabilities
console.log(chalk.yellow('Checking for potential security issues in code files...'));

function scanFile(filePath) {
  filesScanned++;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    let fileIssues = 0;
    
    // Check for hardcoded secrets
    for (const pattern of config.patterns.hardcodedSecrets) {
      const matches = content.match(pattern);
      if (matches) {
        console.log(chalk.red(`❌ [${fileName}] Possible hardcoded secret detected`));
        fileIssues++;
        securityIssues++;
      }
    }
    
    // Check for insecure config
    for (const pattern of config.patterns.insecureConfig) {
      const matches = content.match(pattern);
      if (matches) {
        console.log(chalk.red(`❌ [${fileName}] Insecure configuration setting detected`));
        fileIssues++;
        securityIssues++;
      }
    }
    
    // Check for potential XSS vulnerabilities
    for (const pattern of config.patterns.potentialXSS) {
      const matches = content.match(pattern);
      if (matches) {
        console.log(chalk.yellow(`⚠️  [${fileName}] Potential XSS vulnerability detected`));
        fileIssues++;
        securityIssues++;
      }
    }
    
    // Check API routes for security headers
    if (filePath.includes('/api/') && filePath.endsWith('route.ts')) {
      if (!content.includes('securityHeaders') && !content.includes('withApiSecurity')) {
        console.log(chalk.red(`❌ [${fileName}] API route missing security headers or security wrapper`));
        fileIssues++;
        securityIssues++;
      }
      
      // Check protected paths for auth
      for (const protectedPath of config.protectedPaths) {
        if (filePath.includes(protectedPath) && 
            !content.includes('withAuthApiSecurity') && 
            !content.includes('getSession') &&
            !content.includes('auth')) {
          console.log(chalk.red(`❌ [${fileName}] Protected API route might be missing authentication`));
          fileIssues++;
          securityIssues++;
          break;
        }
      }
    }
    
    if (fileIssues === 0 && filesScanned % 20 === 0) {
      process.stdout.write('.');
    }
    
  } catch (error) {
    console.error(`Error scanning ${filePath}:`, error.message);
  }
}

function scanDirectory(dirPath) {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile() && 
                config.fileExtensions.some(ext => entry.name.endsWith(ext))) {
        scanFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }
}

// Start the scan from the root directory
const rootDir = path.resolve(process.cwd());
for (const dir of config.scanDirs) {
  const dirPath = path.join(rootDir, dir);
  if (fs.existsSync(dirPath)) {
    scanDirectory(dirPath);
  }
}

console.log(chalk.green(`\n\nScanned ${filesScanned} files`));

// Step 2: Check for vulnerable dependencies using npm audit
console.log(chalk.yellow('\nChecking for vulnerable dependencies...'));

try {
  const auditOutput = execSync('npm audit --json', { encoding: 'utf8' });
  const auditResult = JSON.parse(auditOutput);
  
  if (auditResult.metadata.vulnerabilities.total > 0) {
    securityIssues += auditResult.metadata.vulnerabilities.total;
    
    console.log(chalk.red(`❌ Found ${auditResult.metadata.vulnerabilities.total} vulnerable dependencies:`));
    console.log(chalk.red(`   Critical: ${auditResult.metadata.vulnerabilities.critical}`));
    console.log(chalk.red(`   High: ${auditResult.metadata.vulnerabilities.high}`));
    console.log(chalk.yellow(`   Moderate: ${auditResult.metadata.vulnerabilities.moderate}`));
    console.log(chalk.blue(`   Low: ${auditResult.metadata.vulnerabilities.low}`));
    
    console.log(chalk.yellow('\nRun npm audit fix to attempt automatic fixes'));
  } else {
    console.log(chalk.green('✅ No vulnerable dependencies found'));
  }
} catch (error) {
  console.error('Error checking dependencies:', error.message);
}

// Step 3: Check for security middleware
console.log(chalk.yellow('\nChecking security middleware...'));

const middlewarePath = path.join(rootDir, 'middleware.ts');
if (fs.existsSync(middlewarePath)) {
  const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
  
  if (!middlewareContent.includes('securityHeaders')) {
    console.log(chalk.red('❌ Security headers not found in middleware.ts'));
    securityIssues++;
  } else {
    console.log(chalk.green('✅ Security headers found in middleware.ts'));
  }
} else {
  console.log(chalk.red('❌ middleware.ts file not found'));
  securityIssues++;
}

// Step 4: Check for required security files
console.log(chalk.yellow('\nChecking for required security files...'));

const requiredFiles = [
  { path: 'lib/security.ts', name: 'Security utilities' },
  { path: 'config/security.ts', name: 'Security configuration' },
  { path: 'lib/api-security.ts', name: 'API security wrapper' },
  { path: 'lib/security-audit.ts', name: 'Security audit logging' },
  { path: 'docs/SECURITY.md', name: 'Security documentation' },
];

for (const file of requiredFiles) {
  const filePath = path.join(rootDir, file.path);
  if (fs.existsSync(filePath)) {
    console.log(chalk.green(`✅ ${file.name} found at ${file.path}`));
  } else {
    console.log(chalk.red(`❌ ${file.name} missing at ${file.path}`));
    securityIssues++;
  }
}

// Final report
console.log(chalk.blue('\n=== ThinkForward Security Check Summary ==='));
if (securityIssues > 0) {
  console.log(chalk.red(`❌ Found ${securityIssues} potential security issues`));
  process.exit(1);
} else {
  console.log(chalk.green('✅ No security issues detected'));
  process.exit(0);
}
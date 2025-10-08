# ThinkForward NextAuth Automation

This directory contains scripts to automate the NextAuth configuration and deployment process for the ThinkForward application.

## Scripts Overview

### 1. NextAuth Automation Script (`nextauth-automation.sh`)

This script automates the NextAuth secret configuration for both local and Azure environments.

#### Usage

```bash
./scripts/nextauth-automation.sh [options]
```

**Options:**
- `-h, --help`: Show help menu
- `-g, --resource-group NAME`: Azure resource group name
- `-w, --webapp NAME`: Azure Web App name
- `-s, --secret SECRET`: Use a specific NextAuth secret
- `-l, --local-only`: Update only local environment files (skip Azure)
- `-a, --azure-only`: Update only Azure settings (skip local files)
- `--env-file PATH`: Path to .env file to use/create (default: .env.local)

**Examples:**
```bash
# Update local files and Azure webapp 'mywebapp'
./scripts/nextauth-automation.sh -w mywebapp

# Specify both webapp and resource group
./scripts/nextauth-automation.sh -w mywebapp -g myresourcegroup

# Update only local files
./scripts/nextauth-automation.sh -l

# Update only Azure webapp 'mywebapp'
./scripts/nextauth-automation.sh -a -w mywebapp

# Use .env.production instead of .env.local
./scripts/nextauth-automation.sh --env-file .env.production
```

### 2. Automated Deployment Script (`automated-deploy.sh`)

This script automates the deployment process to Azure with proper NextAuth configuration.

#### Usage

```bash
./scripts/automated-deploy.sh [options]
```

**Options:**
- `-h, --help`: Show help menu
- `-g, --resource-group NAME`: Azure resource group name
- `-w, --webapp NAME`: Azure Web App name
- `--skip-nextauth-check`: Skip NextAuth secret verification
- `--skip-build`: Skip the build process
- `--skip-deploy`: Skip the deployment (useful for testing)

**Examples:**
```bash
# Deploy to 'mywebapp'
./scripts/automated-deploy.sh -w mywebapp

# Specify both webapp and resource group
./scripts/automated-deploy.sh -w mywebapp -g myresourcegroup

# Skip the build process
./scripts/automated-deploy.sh -w mywebapp --skip-build
```

## Common Issues and Solutions

### NextAuth Secret Errors

If you're seeing NextAuth secret errors like:
```
[next-auth][error][NO_SECRET]
https://next-auth.js.org/errors#no_secret
```

Run the NextAuth automation script to fix the issue:
```bash
./scripts/nextauth-automation.sh -w your-webapp-name
```

### Environment Variables Not Applied

If you've updated environment variables but they're not being applied, restart your Azure App Service:
```bash
az webapp restart --name your-webapp-name --resource-group your-resource-group
```

## Prerequisites

- Azure CLI installed and logged in (`az login`)
- OpenSSL for generating secure secrets
- Node.js and npm installed
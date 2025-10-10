# Azure Cosmos DB Setup Guide

## Overview

This guide provides instructions for setting up Azure Cosmos DB for the ThinkForward application. The application uses Cosmos DB to store user data, profiles, and other application-related information.

## Prerequisites

- Azure subscription
- Access to Azure portal or Azure CLI
- ThinkForward application codebase

## Creating a Cosmos DB Account

1. **Sign in to Azure Portal** at [https://portal.azure.com](https://portal.azure.com)

2. **Create a new Cosmos DB account**:
   - Click "Create a resource"
   - Search for "Azure Cosmos DB"
   - Select "Azure Cosmos DB" and click "Create"
   - Choose "Azure Cosmos DB for NoSQL"

3. **Configure the basic settings**:
   - **Subscription**: Select your Azure subscription
   - **Resource Group**: Create a new one or use an existing resource group
   - **Account Name**: Enter a unique name (e.g., `thinkforward-db`)
   - **Location**: Choose the Azure region closest to your users
   - **Capacity mode**: Select "Provisioned throughput"
   - **Apply Free Tier Discount**: Select "Apply" if available
   - Click "Review + create", then "Create"

4. **After deployment completes**, go to your new Cosmos DB account

## Database and Container Setup

1. **Create a new database**:
   - In the Cosmos DB account, go to "Data Explorer"
   - Click "New Database"
   - **Database id**: `thinkforward`
   - **Database throughput**: Select "Autoscale" and set max RU/s to 1000
   - Click "OK"

2. **Create containers** within the database:
   - Select the database and click "New Container"
   - Create the following containers:

   a. **Users container**:
      - **Container id**: `users`
      - **Partition key**: `/id`
      - Click "OK"

   b. **Profiles container**:
      - **Container id**: `profiles`
      - **Partition key**: `/userId`
      - Click "OK"

## Getting Connection Information

1. **Get connection information**:
   - In your Cosmos DB account, go to "Keys" in the left menu
   - Copy the "URI" and "PRIMARY KEY" values

2. **Add connection information to environment variables**:
   - Add the following to your `.env.local` file for local development:
     ```
     COSMOS_ENDPOINT=<your_cosmos_db_uri>
     COSMOS_KEY=<your_cosmos_db_primary_key>
     COSMOS_DATABASE=thinkforward
     ```

3. **For Azure App Service deployment**:
   - Go to your App Service in Azure Portal
   - Navigate to "Configuration" → "Application settings"
   - Add the same environment variables as above
   - Click "Save"

## Fallback Handling

ThinkForward has been configured with fallback mechanisms when Cosmos DB is unavailable:

- The application will create mock containers that store data in memory
- Authentication will continue to work, but user data will not persist between restarts
- Console warnings will indicate when Cosmos DB is not properly configured

## Monitoring and Maintenance

1. **Monitor performance**:
   - Use the "Metrics" section in your Cosmos DB account to monitor RU consumption
   - Set up alerts for high RU usage or approaching storage limits

2. **Backup and disaster recovery**:
   - Cosmos DB provides automatic backups
   - Consider setting up additional backup policies for critical data

## Troubleshooting

If you encounter issues with Cosmos DB connectivity:

1. Check that environment variables are correctly set
2. Verify that your IP address is allowed in the Cosmos DB firewall settings
3. Ensure that the application has sufficient permissions to access the Cosmos DB account

## Additional Resources

- [Azure Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [Optimizing Cosmos DB Performance](https://docs.microsoft.com/en-us/azure/cosmos-db/optimize-cost-throughput)
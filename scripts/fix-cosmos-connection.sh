#!/bin/bash
# fix-cosmos-connection.sh - Script to diagnose and fix Cosmos DB connection issues

# Color definitions
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Cosmos DB Connection Fix Script ===${NC}"
echo -e "${BLUE}This script will help diagnose and fix issues with the Cosmos DB connection.${NC}"
echo

# Check if running in Azure App Service
if [ -n "$WEBSITE_SITE_NAME" ]; then
  echo -e "${YELLOW}Running in Azure App Service environment: $WEBSITE_SITE_NAME${NC}"
  IS_AZURE=true
else
  echo -e "${YELLOW}Running in local environment${NC}"
  IS_AZURE=false
fi

# Function to validate a URL
validate_url() {
  if [[ "$1" =~ ^https?:// ]]; then
    return 0
  else
    return 1
  fi
}

# Function to validate a key (basic checks)
validate_key() {
  # Cosmos DB keys are typically Base64 encoded and should be reasonably long
  if [[ ${#1} -gt 20 ]]; then
    return 0
  else
    return 1
  fi
}

# Check environment variables
echo -e "${BLUE}Checking environment variables...${NC}"

# Check endpoint variables
if [ -n "$COSMOS_ENDPOINT" ]; then
  echo -e "${GREEN}✓ COSMOS_ENDPOINT is set (${#COSMOS_ENDPOINT} chars)${NC}"
  ENDPOINT="$COSMOS_ENDPOINT"
  if validate_url "$ENDPOINT"; then
    echo -e "${GREEN}  ✓ Endpoint URL format appears valid${NC}"
  else
    echo -e "${RED}  ✗ Endpoint URL format appears invalid${NC}"
  fi
elif [ -n "$COSMOS_DB_ENDPOINT" ]; then
  echo -e "${YELLOW}! COSMOS_ENDPOINT is not set, but COSMOS_DB_ENDPOINT is (${#COSMOS_DB_ENDPOINT} chars)${NC}"
  ENDPOINT="$COSMOS_DB_ENDPOINT"
  if validate_url "$ENDPOINT"; then
    echo -e "${GREEN}  ✓ Endpoint URL format appears valid${NC}"
  else
    echo -e "${RED}  ✗ Endpoint URL format appears invalid${NC}"
  fi
else
  echo -e "${RED}✗ Neither COSMOS_ENDPOINT nor COSMOS_DB_ENDPOINT is set${NC}"
  ENDPOINT=""
fi

# Check key variables
if [ -n "$COSMOS_KEY" ]; then
  echo -e "${GREEN}✓ COSMOS_KEY is set (${#COSMOS_KEY} chars)${NC}"
  KEY="$COSMOS_KEY"
  if validate_key "$KEY"; then
    echo -e "${GREEN}  ✓ Key length appears valid${NC}"
  else
    echo -e "${RED}  ✗ Key appears too short (${#KEY} chars)${NC}"
  fi
elif [ -n "$COSMOS_DB_KEY" ]; then
  echo -e "${YELLOW}! COSMOS_KEY is not set, but COSMOS_DB_KEY is (${#COSMOS_DB_KEY} chars)${NC}"
  KEY="$COSMOS_DB_KEY"
  if validate_key "$KEY"; then
    echo -e "${GREEN}  ✓ Key length appears valid${NC}"
  else
    echo -e "${RED}  ✗ Key appears too short (${#KEY} chars)${NC}"
  fi
else
  echo -e "${RED}✗ Neither COSMOS_KEY nor COSMOS_DB_KEY is set${NC}"
  KEY=""
fi

# Check database name variables
if [ -n "$COSMOS_DATABASE" ]; then
  echo -e "${GREEN}✓ COSMOS_DATABASE is set: $COSMOS_DATABASE${NC}"
  DB="$COSMOS_DATABASE"
elif [ -n "$COSMOS_DB_DATABASE_ID" ]; then
  echo -e "${YELLOW}! COSMOS_DATABASE is not set, but COSMOS_DB_DATABASE_ID is: $COSMOS_DB_DATABASE_ID${NC}"
  DB="$COSMOS_DB_DATABASE_ID"
else
  echo -e "${YELLOW}! Neither COSMOS_DATABASE nor COSMOS_DB_DATABASE_ID is set. Using default: 'thinkforward'${NC}"
  DB="thinkforward"
fi

# Checking file system paths
echo
echo -e "${BLUE}Checking filesystem paths...${NC}"

# Check important directories
for dir in "/tmp" "/home" "/home/site" "/home/site/next-temp"; do
  if [ -d "$dir" ]; then
    if [ -w "$dir" ]; then
      echo -e "${GREEN}✓ Directory $dir exists and is writable${NC}"
    else
      echo -e "${RED}✗ Directory $dir exists but is NOT writable${NC}"
    fi
  else
    echo -e "${YELLOW}! Directory $dir does not exist${NC}"
  fi
done

# If running in Azure, fix known issues
if [ "$IS_AZURE" = true ]; then
  echo
  echo -e "${BLUE}Applying fixes for Azure App Service...${NC}"

  # Fix 1: Create next-temp directory if it doesn't exist
  if [ ! -d "/home/site/next-temp" ]; then
    echo -e "${YELLOW}Creating /home/site/next-temp directory...${NC}"
    mkdir -p /home/site/next-temp
    if [ -d "/home/site/next-temp" ]; then
      echo -e "${GREEN}✓ Created /home/site/next-temp successfully${NC}"
    else
      echo -e "${RED}✗ Failed to create /home/site/next-temp${NC}"
    fi
  fi

  # Fix 2: Set environment variables if missing
  if [ -z "$ENDPOINT" ] || [ -z "$KEY" ]; then
    echo -e "${YELLOW}Attempting to retrieve Cosmos DB connection info from Azure credentials...${NC}"
    
    # Check if azure-credentials.json exists
    if [ -f "./azure-credentials.json" ]; then
      echo -e "${GREEN}Found azure-credentials.json${NC}"
      
      # Extract values using grep and sed (basic approach without requiring jq)
      if [ -z "$ENDPOINT" ]; then
        EXTRACTED_ENDPOINT=$(grep -o '"cosmosDbEndpoint": *"[^"]*"' ./azure-credentials.json | sed 's/"cosmosDbEndpoint": *"\(.*\)"/\1/')
        if [ -n "$EXTRACTED_ENDPOINT" ]; then
          echo -e "${GREEN}✓ Found endpoint in credentials file${NC}"
          export COSMOS_ENDPOINT="$EXTRACTED_ENDPOINT"
          echo -e "${GREEN}✓ Set COSMOS_ENDPOINT environment variable${NC}"
        fi
      fi
      
      if [ -z "$KEY" ]; then
        EXTRACTED_KEY=$(grep -o '"cosmosDbKey": *"[^"]*"' ./azure-credentials.json | sed 's/"cosmosDbKey": *"\(.*\)"/\1/')
        if [ -n "$EXTRACTED_KEY" ]; then
          echo -e "${GREEN}✓ Found key in credentials file${NC}"
          export COSMOS_KEY="$EXTRACTED_KEY"
          echo -e "${GREEN}✓ Set COSMOS_KEY environment variable${NC}"
        fi
      fi
    else
      echo -e "${RED}✗ azure-credentials.json not found${NC}"
    fi
    
    # Check if azure-credentials-cli.json exists as fallback
    if [ -f "./azure-credentials-cli.json" ]; then
      echo -e "${GREEN}Found azure-credentials-cli.json${NC}"
      
      if [ -z "$ENDPOINT" ]; then
        EXTRACTED_ENDPOINT=$(grep -o '"cosmosDbEndpoint": *"[^"]*"' ./azure-credentials-cli.json | sed 's/"cosmosDbEndpoint": *"\(.*\)"/\1/')
        if [ -n "$EXTRACTED_ENDPOINT" ]; then
          echo -e "${GREEN}✓ Found endpoint in CLI credentials file${NC}"
          export COSMOS_ENDPOINT="$EXTRACTED_ENDPOINT"
          echo -e "${GREEN}✓ Set COSMOS_ENDPOINT environment variable${NC}"
        fi
      fi
      
      if [ -z "$KEY" ]; then
        EXTRACTED_KEY=$(grep -o '"cosmosDbKey": *"[^"]*"' ./azure-credentials-cli.json | sed 's/"cosmosDbKey": *"\(.*\)"/\1/')
        if [ -n "$EXTRACTED_KEY" ]; then
          echo -e "${GREEN}✓ Found key in CLI credentials file${NC}"
          export COSMOS_KEY="$EXTRACTED_KEY"
          echo -e "${GREEN}✓ Set COSMOS_KEY environment variable${NC}"
        fi
      fi
    fi
  fi

  # Fix 3: Create a startup script that ensures correct environment variables are set
  echo -e "${YELLOW}Creating/updating startup.sh script...${NC}"
  
  cat > ./startup.sh << 'EOF'
#!/bin/bash
echo "=== ThinkForward Startup Script ==="

# Create next-temp directory if it doesn't exist
if [ ! -d "/home/site/next-temp" ]; then
  echo "Creating /home/site/next-temp directory..."
  mkdir -p /home/site/next-temp
fi

# Ensure environment variables are correctly set
# Check if COSMOS_ENDPOINT is empty but COSMOS_DB_ENDPOINT is set
if [ -z "$COSMOS_ENDPOINT" ] && [ -n "$COSMOS_DB_ENDPOINT" ]; then
  echo "Setting COSMOS_ENDPOINT from COSMOS_DB_ENDPOINT"
  export COSMOS_ENDPOINT="$COSMOS_DB_ENDPOINT"
fi

# Check if COSMOS_KEY is empty but COSMOS_DB_KEY is set
if [ -z "$COSMOS_KEY" ] && [ -n "$COSMOS_DB_KEY" ]; then
  echo "Setting COSMOS_KEY from COSMOS_DB_KEY"
  export COSMOS_KEY="$COSMOS_DB_KEY"
fi

# Try to get credentials from files if environment variables are still missing
if [ -z "$COSMOS_ENDPOINT" ] || [ -z "$COSMOS_KEY" ]; then
  echo "Attempting to retrieve Cosmos DB connection info from credentials files..."
  
  if [ -f "./azure-credentials.json" ]; then
    echo "Found azure-credentials.json"
    
    if [ -z "$COSMOS_ENDPOINT" ]; then
      EXTRACTED_ENDPOINT=$(grep -o '"cosmosDbEndpoint": *"[^"]*"' ./azure-credentials.json | sed 's/"cosmosDbEndpoint": *"\(.*\)"/\1/')
      if [ -n "$EXTRACTED_ENDPOINT" ]; then
        echo "Setting COSMOS_ENDPOINT from credentials file"
        export COSMOS_ENDPOINT="$EXTRACTED_ENDPOINT"
      fi
    fi
    
    if [ -z "$COSMOS_KEY" ]; then
      EXTRACTED_KEY=$(grep -o '"cosmosDbKey": *"[^"]*"' ./azure-credentials.json | sed 's/"cosmosDbKey": *"\(.*\)"/\1/')
      if [ -n "$EXTRACTED_KEY" ]; then
        echo "Setting COSMOS_KEY from credentials file"
        export COSMOS_KEY="$EXTRACTED_KEY"
      fi
    fi
  elif [ -f "./azure-credentials-cli.json" ]; then
    echo "Found azure-credentials-cli.json"
    
    if [ -z "$COSMOS_ENDPOINT" ]; then
      EXTRACTED_ENDPOINT=$(grep -o '"cosmosDbEndpoint": *"[^"]*"' ./azure-credentials-cli.json | sed 's/"cosmosDbEndpoint": *"\(.*\)"/\1/')
      if [ -n "$EXTRACTED_ENDPOINT" ]; then
        echo "Setting COSMOS_ENDPOINT from CLI credentials file"
        export COSMOS_ENDPOINT="$EXTRACTED_ENDPOINT"
      fi
    fi
    
    if [ -z "$COSMOS_KEY" ]; then
      EXTRACTED_KEY=$(grep -o '"cosmosDbKey": *"[^"]*"' ./azure-credentials-cli.json | sed 's/"cosmosDbKey": *"\(.*\)"/\1/')
      if [ -n "$EXTRACTED_KEY" ]; then
        echo "Setting COSMOS_KEY from CLI credentials file"
        export COSMOS_KEY="$EXTRACTED_KEY"
      fi
    fi
  fi
fi

# Set NODE_OPTIONS to use a custom temp directory
export NEXT_TEMP_DIR="/home/site/next-temp"
export NEXT_RUNTIME="nodejs"

# Start the application using Node
exec node server.js
EOF

  chmod +x ./startup.sh
  echo -e "${GREEN}✓ Updated startup.sh script${NC}"
fi

# Summary of findings and recommendations
echo
echo -e "${BLUE}=== Summary ===${NC}"
if [ -z "$ENDPOINT" ]; then
  echo -e "${RED}✗ Cosmos DB endpoint is missing${NC}"
  echo -e "  Recommended fix: Set the COSMOS_ENDPOINT environment variable"
elif [ -z "$KEY" ]; then
  echo -e "${RED}✗ Cosmos DB key is missing${NC}"
  echo -e "  Recommended fix: Set the COSMOS_KEY environment variable"
else
  echo -e "${GREEN}✓ Cosmos DB environment variables are set${NC}"
  echo -e "  Endpoint: ${ENDPOINT:0:20}... (${#ENDPOINT} chars)"
  echo -e "  Key: ${KEY:0:3}...${KEY: -3} (${#KEY} chars)"
fi

if [ "$IS_AZURE" = true ]; then
  echo -e "${GREEN}✓ Created/updated startup.sh with fixes for Azure App Service${NC}"
  echo -e "  Remember to configure the app to use this startup script in Azure portal"
fi

echo
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. If running locally, make sure environment variables are set in .env.local"
echo -e "2. If running in Azure, set app settings in the Azure portal or use the deploy scripts"
echo -e "3. Restart the application to apply changes"
echo -e "4. Run the test-cosmos-connection.js script to validate the connection"

# Exit with appropriate status code
if [ -n "$ENDPOINT" ] && [ -n "$KEY" ]; then
  exit 0
else
  exit 1
fi
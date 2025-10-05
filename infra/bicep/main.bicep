// Main Bicep orchestration file (skeleton)
param location string = resourceGroup().location
param env string = 'dev'
param appName string = 'learnapp'
param skuName string = 'P1v2' // Adjust downwards for lower cost tiers

// App Service Plan
resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: 'asp-${appName}-${env}'
  location: location
  sku: {
    name: skuName
    capacity: 1
    tier: 'PremiumV2'
  }
  properties: {
    reserved: true // Linux
  }
}

// App Service
resource web 'Microsoft.Web/sites@2023-12-01' = {
  name: appName
  location: location
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
    }
  }
}

// Application Insights (classic workspace-based can be added later)
resource insights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'ai-${appName}-${env}'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    IngestionMode: 'ApplicationInsights'
  }
}

// Output instrumentation key as secret reference candidate
output appInsightsConnectionString string = insights.properties.ConnectionString

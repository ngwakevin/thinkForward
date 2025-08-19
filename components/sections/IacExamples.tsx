"use client";
import { useState } from 'react';

const bicepSample = `// App Service (Linux) sample
resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: 'tfw-plan'
  location: resourceGroup().location
  sku: {
    name: 'B1'
    tier: 'Basic'
    capacity: 1
  }
  kind: 'linux'
}

resource app 'Microsoft.Web/sites@2023-12-01' = {
  name: 'tfw-app'
  location: resourceGroup().location
  kind: 'app,linux'
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
    }
  }
}

output appUrl string = 'https://\${app.name}.azurewebsites.net'`;

const tfSample = `# App Service (Linux) sample
provider "azurerm" { features {} }

resource "azurerm_resource_group" "rg" {
  name     = "tfw-rg"
  location = "eastus"
}

resource "azurerm_service_plan" "plan" {
  name                = "tfw-plan"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "app" {
  name                = "tfw-app"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {
    application_stack { node_version = "20-lts" }
  }
  https_only = true
}

output "app_url" { value = azurerm_linux_web_app.app.default_hostname }`;

export function IacExamples() {
  const [view, setView] = useState<'bicep'|'tf'>('bicep');
  const code = view === 'bicep' ? bicepSample : tfSample;
  return (
    <div className="rounded-xl border border-border/60 p-5 bg-gradient-to-br from-bg-alt/60 to-bg-alt/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Deploy App Service</h3>
        <div className="inline-flex rounded-md border border-border/60 overflow-hidden text-[11px] font-medium">
          <button onClick={() => setView('bicep')} className={`px-3 py-1.5 transition ${view==='bicep' ? 'bg-accent text-white' : 'text-fg-muted hover:bg-bg-alt/60'}`}>Bicep</button>
          <button onClick={() => setView('tf')} className={`px-3 py-1.5 transition ${view==='tf' ? 'bg-accent text-white' : 'text-fg-muted hover:bg-bg-alt/60'}`}>Terraform</button>
        </div>
      </div>
      <pre className="relative max-h-80 overflow-auto rounded-lg bg-black/70 p-4 text-[11px] leading-relaxed text-emerald-200 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-emerald-700/40">
        <code>{code}</code>
      </pre>
      <p className="mt-3 text-xs text-fg-muted/70">Example infra as code snippets (minimal) for a Linux App Service. Adjust region, SKU, runtime as needed.</p>
    </div>
  );
}

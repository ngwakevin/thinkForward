// Terraform skeleton for core stack
// Replace placeholder values before use.

terraform {
  required_version = ">= 1.7.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 3.100.0"
    }
  }
}

provider "azurerm" {
  features {}
}

variable "location" { type = string  default = "westeurope" }
variable "env" { type = string  default = "dev" }
variable "app_name" { type = string  default = "learnapp" }

resource "azurerm_service_plan" "plan" {
  name                = "asp-${var.app_name}-${var.env}"
  location            = var.location
  resource_group_name = "changeme-rg" // update
  os_type             = "Linux"
  sku_name            = "P1v2"
}

resource "azurerm_linux_web_app" "web" {
  name                = var.app_name
  location            = var.location
  resource_group_name = "changeme-rg" // update
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {
    application_stack {
      node_version = "20-lts"
    }
    always_on = true
  }

  https_only = true
}

resource "azurerm_application_insights" "insights" {
  name                = "ai-${var.app_name}-${var.env}"
  location            = var.location
  resource_group_name = "changeme-rg" // update
  application_type    = "web"
}

output "app_insights_connection_string" {
  value = azurerm_application_insights.insights.connection_string
}

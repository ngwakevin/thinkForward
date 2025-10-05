## Infrastructure as Code (Skeleton)

This folder contains starter templates (Bicep + Terraform) for the target architecture.

Current scope (placeholders):
- App Service (Linux, Node 20)
- Application Insights
- Key Vault
- Storage Account (Blob)
- Cosmos DB (serverless)

Phased approach: Apply minimal core first (App Service + Insights), expand as components migrate (Cosmos, Storage, Key Vault).

> NOTE: Values are placeholders. Replace `changeme` tokens before deploying.

### Bicep
`main.bicep` orchestrates module composition. Individual modules live in `modules/`.

### Terraform
`main.tf` sets up providers and basic resources (commented until configured).

### Recommended Deployment Flow
1. Create resource group.
2. Deploy Bicep or Terraform core stack.
3. Enable system-assigned managed identity on App Service.
4. Assign RBAC roles for Cosmos & Storage (when added).
5. Add Key Vault secret references to App Service configuration.

---
Incrementally evolve these templates; keep production and non-prod parameter files versioned.

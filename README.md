# CloudAcers Platform

Focused workspace for accelerating Cloud & DevOps skills:
- Live & upcoming bootcamps
- 1‑on‑1 mentoring (Calendly embed)
- MDX docs & blog content
- Azure cloud infrastructure integration

Status: Production ready with Azure integration.

---
## Quick Start
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Optional Environment
Create `.env.local` as features are enabled:
- `NEXT_PUBLIC_CALENDLY_URL` (override default)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` (mentoring CTA, planned)
- `NEXT_PUBLIC_ANALYTICS_KEY` (tracking, planned)

## Azure Integration
This application is configured to use Azure cloud services:
- **Azure App Service**: Hosts the Next.js application
- **Azure Cosmos DB**: Database for user data and content
- **Azure Blob Storage**: File storage for media and uploads
- **Azure Key Vault**: Secure secret management
- **Application Insights**: Application monitoring and telemetry

### Local Development with Azure Resources
To test locally with Azure resources:
```bash
# Configure local environment with Azure resources
./scripts/setup-azure-local.sh

# Start the development server
npm run dev
```

### Deployment
This application is configured for CI/CD deployment to Azure App Service via GitHub Actions.

To set up deployment:
```bash
# Configure GitHub secrets for deployment
./scripts/setup-github-secrets.sh

# Manual deployment (if needed)
./scripts/deploy-to-azure.sh
```

---
_Last updated: 2023-11-09_

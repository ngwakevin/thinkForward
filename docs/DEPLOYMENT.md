# Deployment & Operations Guide

This document summarizes how the application is built, deployed, configured, and operated on Azure.

## Overview
- Framework: Next.js 14 (App Router) + Prisma + NextAuth
- Hosting: Azure App Service (Linux, Node 20)
- Database: Azure SQL (SQL Server)
- CI/CD: GitHub Actions (OIDC federated credentials; no publish profile)
- Strategy: Build *standalone* output in CI, deploy minimal runtime bundle

## Resources
| Type | Name (example) | Notes |
|------|----------------|------|
| Resource Group | rg-learn-prod | Logical container |
| App Service Plan | asp-learn-prod | Linux B1+ |
| Web App | learnapp | https://learnapp.azurewebsites.net |
| SQL Server | dbserver-gouply | Existing |
| SQL Database | db-gouply-01 | Existing | 
| (Optional) App Insights | learnapp-ai | Telemetry |

## Environment Variables
Required (build + runtime):
- `DATABASE_URL` – Prisma SQL Server URL
- `NEXTAUTH_URL` – Public base URL (origin)
- `NEXTAUTH_SECRET` – 48+ byte random secret
- `NEXT_PUBLIC_SITE_URL` – Same as NEXTAUTH_URL unless marketing domain differs

Recommended:
- `EMAIL_DISABLE_SEND` (true until SMTP configured)
- `WEBSITE_NODE_DEFAULT_VERSION=~20`
- `SCM_DO_BUILD_DURING_DEPLOYMENT=false`

Optional future:
- SMTP_* (HOST, PORT, USER, PASS), `EMAIL_FROM`
- `FEATURE_FLAGS`

## DATABASE_URL Format
```
sqlserver://USER:PASSWORD@SERVER.database.windows.net:1433;database=DB_NAME;encrypt=true;trustServerCertificate=false;
```
Avoid `;` in password; if present rotate password.

## GitHub Secrets
Store these in repo Settings > Secrets > Actions:
```
AZURE_CLIENT_ID
AZURE_TENANT_ID
AZURE_SUBSCRIPTION_ID
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
NEXT_PUBLIC_SITE_URL
EMAIL_DISABLE_SEND (optional)
```

## CI/CD Workflow (Summary)
1. Verify secrets
2. Prisma migrations (`npx prisma migrate deploy`)
3. Export build metadata (`BUILD_SHA`)
4. Build: `prisma generate && next build` (standalone)
5. Package deploy folder (.next/standalone + .next/static + public + prisma)
6. Azure OIDC login (`azure/login@v2`)
7. Deploy (`azure/webapps-deploy@v3`)
8. Smoke test + health check with retries

## Deployment Package Contents
```
deploy/
  server.js (from .next/standalone)
  node_modules/ (trimmed by standalone build)
  .next/static/*
  public/*
  prisma/* (schema + migrations if needed)
  package.json + package-lock.json (for next start script)
```

## Health Endpoint
`GET /api/health` returns JSON:
```
{
  ok: true,
  uptimeSeconds: <number>,
  node: "v20.x.x",
  commit: <GITHUB_SHA>,
  buildSha: <BUILD_SHA>,
  timestamp: <ISO>,
  db: { ok: true, latencyMs: <ms>, error: null },
  elapsedMs: <ms>
}
```
HTTP 503 if DB unreachable.

## Migrations
- Generate locally with `npx prisma migrate dev --name <desc>`
- CI applies with `npx prisma migrate deploy`
- Check status: `npx prisma migrate status`

## Log & Troubleshooting Commands
```bash
# Enable / configure application & web logs
az webapp log config -g rg-learn-prod -n learnapp \
  --application-logging filesystem --level information \
  --web-server-logging filesystem

# Tail logs
az webapp log tail -g rg-learn-prod -n learnapp

# Show app settings names
az webapp config appsettings list -g rg-learn-prod -n learnapp --query "[].name" -o table

# Show runtime stack
az webapp show -g rg-learn-prod -n learnapp --query "siteConfig.linuxFxVersion"
```

## Common Issues
| Symptom | Cause | Resolution |
|---------|-------|------------|
| Application Error page | Deployed raw source (no .next) | Ensure CI build & deploy folder used |
| 503 /api/health | DB unreachable | Check DATABASE_URL, firewall, password |
| Sessions reset | Changing NEXTAUTH_SECRET | Keep stable; rotate with maintenance window |
| Build fails (Prisma) | Missing DATABASE_URL | Add secret and re-run |
| Missing prisma engine | Not using standalone output | Ensure `output: 'standalone'` in next.config.mjs |

## Hardening Checklist
- Enforce HTTPS: `az webapp update --https-only true`
- Minimum TLS 1.2: `az webapp config set --min-tls-version 1.2`
- Remove publish profile secret after OIDC success
- Add App Insights + alert rules (availability, 5xx)
- Rotate secrets periodically (NEXTAUTH_SECRET, SQL password)
- Consider Key Vault + secret references
- Add staging slot & swap deployment for zero downtime
- Add Web Application Firewall / Front Door if public at scale

## Future Enhancements
- Email / SMTP integration
- Feature flags system
- CDN for static assets (Front Door or Azure CDN)
- Synthetic health probes + autoscale (if higher SKU)

## Recovery Procedures
1. Failed deploy: redeploy last successful artifact (Actions -> rerun previous success).
2. DB migration failure: fix migration locally, generate new corrective migration, commit, redeploy.
3. Credential leak: rotate secret (update GitHub & App Settings) then restart Web App.

---
Document version: 1.0

# Technology Stack

This document summarizes the active and planned technologies. See `ARCHITECTURE.md` for deeper context.

## Runtime & Framework
- Next.js 14 (App Router, standalone output)
- React 18.3
- TypeScript / Node.js 20

## Current Data & Auth (Before Migration)
- Prisma + Azure SQL (relational)
- Placeholder auth (NextAuth removed/disabled pending Entra integration)

## Target Identity
- Microsoft Entra External ID (OIDC user flows)
- MSAL Node integration (scaffold present; disabled by feature flag)

## Target Data Layer
- Azure Cosmos DB (serverless) for profiles, progress
- Azure Blob Storage for media (SAS delivery)

## Observability & Ops
- Health endpoint `/api/health`
- Planned: Application Insights (Bicep / Terraform skeleton)

## Infrastructure as Code
- Bicep: `infra/bicep/main.bicep`
- Terraform: `infra/terraform/main.tf`

## Feature Flags
- Simple env-based flags (`lib/flags.ts`)
  - `FEATURE_AUTH_MSAL` controls MSAL middleware.

## Repositories (Scaffold)
- `lib/data/cosmos.ts` defines repository interfaces (no-op implementations until Cosmos wired).

## Next Steps
1. Provide Entra tenant config & implement real MSAL client.
2. Add `@azure/cosmos` package and concrete repository code.
3. Introduce Key Vault + managed identity secrets replacement.
4. Add slot-based deployment and telemetry instrumentation.

_Last updated: 2025-10-05_

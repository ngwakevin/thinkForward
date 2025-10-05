# Platform Architecture

> Draft status – aligns proposed target architecture with current implementation. Update iteratively as components go live.

## 1. Layered View

```
Users (Web / Mobile Browser)
           |
           v
[ Presentation & Application Layer ]
  - Next.js 14 (App Router) on Azure App Service
  - React 18.3 (concurrent features) + TypeScript
  - Server-Side Rendering (SSR) & Incremental Static Regeneration (ISR)
  - API routes: /app/api/* (lightweight backend services: auth hooks, progress, profile, content)
           |
           v
[ Identity & Access Layer ]
  - Microsoft Entra External ID (B2C-style journeys)
    * Sign‑up / Sign‑in / Password reset user flows
    * Issues ID & Access tokens (OIDC / JWT) consumed by Next.js
           |
           v
[ Data Layer ]
  - Azure Cosmos DB (serverless) – profiles, enrollments, progress, content metadata
  - Azure Blob Storage – video & learning asset storage (SAS-based secure delivery)
           |
           v
[ Security & Operations Layer ]
  - Azure Key Vault – secrets, storage keys (if any), signing secrets (until rotated to Key Vault certs)
  - Application Insights – telemetry, traces, dependency timings, failures
  - (Future) Azure Monitor Workbook / Dashboards, Log Analytics queries
```

## 2. Current vs Target State

| Capability | Current (Sep 2025) | Target | Delta Notes |
|------------|--------------------|--------|-------------|
| Web Runtime | Next.js 14 App Router on App Service | Same + perf tuning | Already aligned |
| Auth | Placeholder / disabled (NextAuth scaffolding previously) | Entra External ID (user flows) | Introduce MSAL integration, remove legacy NextAuth paths |
| Primary DB | Azure SQL via Prisma | Cosmos DB (API for NoSQL) | Dual-write migration, then cut-over; retire Prisma models or keep hybrid |
| Content Assets | Local `public/` + MDX in repo | Blob Storage + CDN for heavy/video | Migrate large media; keep small static assets local |
| Secrets | GitHub Actions + embedded IDs | Key Vault + Managed Identity | Replace secret refs with Key Vault references in App Service configuration |
| Telemetry | Basic / health endpoint only | Application Insights + distributed tracing | Add SDK auto-instrumentation + custom events |
| Deployment | GitHub Actions OIDC, standalone build | Same + slot-based blue/green | Add staging slot + swap step |
| Caching | None | Edge caching (CDN) + incremental revalidation | Optionally Azure Front Door or CDN Standard |

## 3. Detailed Flow (Target)

1. User hits `https://<domain>` → App Service (Next.js) responds. Static/ISR pages served from cache when warm; others SSR.
2. Auth request triggers redirect to Entra External ID user flow (policy). User authenticates (local account, social, etc.).
3. Browser returns with `id_token` (and optional `access_token`). Next.js verifies signature using Entra metadata (JWKS). Session established (encrypted cookie or token-in-memory + silent renew).
4. First-time login → API route persists profile document in Cosmos DB (partition key: `userId` or `organizationId` + `userId`).
5. User opens course module → API route queries Cosmos for progress; generates SAS URL (short-lived) for Blob video; page streams via `<video>`.
6. Telemetry middleware logs request latency, userId (hashed), Cosmos RU consumption (if captured), and Blob fetch timings to Application Insights.
7. Secrets (Cosmos endpoint/key if still needed, Storage account connection string if managed identity not fully adopted) resolved at runtime via Key Vault references in App Service config (`@Microsoft.KeyVault(SecretUri=...)`).

## 4. Identity & Access Design

| Aspect | Decision | Notes |
|--------|----------|-------|
| Protocol | OIDC | Standard Web flow with authorization code (PKCE) |
| Library | `@azure/msal-node` + custom Next.js middleware | Keeps control over session persistence |
| Token Storage | Encrypted HTTP-only cookie | Minimizes XSS token theft risk |
| Roles/Claims | Stored in Cosmos user document; minimal custom app roles claim | Map roles into UI gating |
| Password Reset | Entra External ID self-service flow (policy) | Linked from Sign-in page |

### Auth Middleware Sketch (Pseudo)
```ts
// middleware.ts
import { verifyJwt } from './lib/identity';
export function middleware(req: NextRequest) {
  const token = extractToken(req.cookies);
  if (!token) return redirectToLogin(req.nextUrl);
  const claims = verifyJwt(token);
  req.headers.set('x-user-id', claims.sub);
  return NextResponse.next();
}
```

## 5. Data Model (Cosmos – Draft)

| Container | Partition Key | Purpose |
|-----------|---------------|---------|
| users | userId | Profile basics, preferences, roles |
| enrollments | userId | User enrolled course list (courseId, status, progress %) |
| progress | userId | Fine-grained lesson progress events (lessonId, completedAt) |
| courses | courseId | Course metadata (title, sections, media refs) |
| mediaRefs | courseId | Mapping logical lessons → blob paths/versions |

RUs: Start serverless. Add analytical store later for reporting.

## 6. Blob Storage Strategy

| Concern | Approach |
|---------|----------|
| Access Control | Generate user-scoped SAS (read, limited duration, IP optional) |
| Folder Layout | `videos/<courseId>/<module>/<lesson>.mp4` |
| Versioning | Append `?v=<hash>` or use separate blob versions for replacement |
| CDN | Enable CDN or Front Door if latency hotspots appear |

Generate SAS only when the user is authorized for the course.

## 7. Key Vault & Secrets

| Secret | Interim Source | Future Source |
|--------|----------------|--------------|
| Cosmos DB Key | App Setting (early) | Managed Identity + RBAC (No key use) |
| Storage Key | App Setting | Managed Identity (Blob Data Reader) |
| Entra Client Secret (if needed for background jobs) | Key Vault Secret | Consider cert-based credential |
| Signing Key (legacy) | Remove | Not needed if solely verifying Entra tokens |

### Adoption Steps
1. Enable system-assigned managed identity on App Service.
2. Assign RBAC: Cosmos DB Built-in Data Reader/Contributor, Storage Blob Data Reader.
3. Replace connection strings with identity-based endpoints.
4. Remove static secrets from GitHub secrets where possible.

## 8. Telemetry & Observability

| Signal | Tool | Notes |
|--------|------|-------|
| Requests | App Insights Auto-Collect + custom dims | Add user hash, route type (SSR/ISR/API) |
| Dependencies | App Insights | Track Cosmos latency (p95), Blob egress |
| Logs | App Insights / Log Analytics | Structured JSON logs (future) |
| Availability | Health endpoint + Azure Monitor alert | 3 consecutive failures triggers page |
| Metrics | Custom events (courseStart, lessonComplete) | Funnels & retention |

## 9. Deployment Pipeline Enhancements

| Enhancement | Benefit |
|------------|---------|
| Staging Slot + Swap | Zero-downtime deploys |
| Load/Smoke Test Stage | Detect hot paths before prod |
| Lint/TypeCheck Gate | Prevent broken builds |
| SAST (CodeQL) | Security posture |
| Infrastructure as Code | Repeatability (Bicep/Terraform) |

## 10. Migration Plan (Phased)

### Phase 0 – Baseline (Now)
- Next.js on App Service with SQL + Prisma; health endpoint; GitHub Actions OIDC.

### Phase 1 – Identity Foundation
- Provision Entra External ID user flows.
- Integrate MSAL; protect selected routes; dual-run (public pages unaffected).

### Phase 2 – Cosmos Introduction (Shadow)
- Create Cosmos DB (serverless, multi-region optional later).
- Build data access layer wrappers (abstract out Prisma usage pattern).
- Dual-write user profile & progress to Cosmos + SQL; nightly diff validation.

### Phase 3 – Cut-over
- Switch read paths to Cosmos for users/progress.
- Backfill historical progress/events into Cosmos.
- Decommission equivalent SQL tables after verification window.

### Phase 4 – Media Offload
- Provision Blob Storage; upload course videos.
- Implement SAS generator API route; replace static links.
- Optional: add CDN; monitor bandwidth.

### Phase 5 – Secrets & Identity-based Access
- Enable managed identity; assign RBAC; remove raw keys.
- Add Key Vault references in App Service configuration.

### Phase 6 – Telemetry Maturity
- Add App Insights SDK + custom metrics.
- Define alerts (latency p95, error rate, RU spikes).

### Phase 7 – Hardening & Performance
- Blue/Green (slots) + canary flag.
- Caching strategy (revalidation intervals, CDN stripes).
- Add synthetic uptime checks external to Azure.

Risk Mitigation:
- Each phase has a rollback (toggle feature flags, switch env vars back, re-point data layer).
- Maintain migration scripts to replay missed writes if temporary dual-write failures occur.

## 11. Reference Resource Naming (Suggestion)

| Resource | Naming Pattern | Example |
|----------|----------------|---------|
| App Service | app-<env>-web | app-prod-web |
| Cosmos Account | cdb-<env>-core | cdb-prod-core |
| Storage | st<env>media | stprodmedia |
| Key Vault | kv-<env>-core | kv-prod-core |
| Insights | ai-<env>-web | ai-prod-web |
| RG | rg-<env>-core | rg-prod-core |

## 12. Open Questions / TODO
- Do we require offline/background processing (queue-based)? (If yes: add Storage Queues / Service Bus + worker). 
- Will we multi-tenant beyond single org? (Partition strategy impacts Cosmos design.)
- Need fine-grained per-video entitlement? (Consider caching entitlements + invalidation.)
- Content authoring pipeline externalized or committed as MDX long-term?

## 13. Immediate Action Checklist
- [ ] Decide feature flag platform (simple env flag vs LaunchDarkly/App Config).
- [ ] Create Entra External ID tenant & user flows (sign-up/sign-in, password reset).
- [ ] Prototype MSAL integration on a protected test route.
- [ ] Draft Cosmos container definitions & RU modeling assumptions.
- [ ] Design dual-write abstraction (interface for user/profile repository).
- [ ] Inventory existing media → size classification (blob migration scope).

---
_Last updated: 2025-10-05_

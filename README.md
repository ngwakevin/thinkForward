# Cloudegree Platform

Focused workspace for accelerating Cloud & DevOps skills:
- Live & upcoming bootcamps
- 1‑on‑1 mentoring (Calendly embed)
- MDX docs & blog content

Status: early internal build; surface area will expand incrementally.

---
## Quick Start
```bash
npm install
npm run dev -- -p 3005
# open http://localhost:3005
```

## Optional Environment
Create `.env.local` as features are enabled:
- `NEXT_PUBLIC_CALENDLY_URL` (override default)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` (mentoring CTA, planned)
- `NEXT_PUBLIC_ANALYTICS_KEY` (tracking, planned)

### Authentication

Authentication is currently disabled while we set up a fresh flow. The `/auth/signin` page is a placeholder.
When we introduce a new auth strategy, this README and `.env.local.example` will be updated with the required steps.

---
_Last updated: 2025-09-17_

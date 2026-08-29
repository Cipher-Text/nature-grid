---
name: C1-C4 security fixes applied (2026-08-29)
description: Critical pre-production security issues audited and fixed on 2026-08-29 — JWT rotated, CORS locked, seed password removed from source
type: project
---

On 2026-08-29 a production readiness audit identified critical issues C1–C4. Status:

**C1 — .env never committed** — .gitignore blocks .env and .env.* correctly. No git history purge needed. Confirmed clean.

**C2 — JWT_SECRET rotated** — Previous secret was reviewed in audit session and treated as compromised. New secret generated with `openssl rand -base64 48` and written to local `.env` on 2026-08-29. Production deployments must use their own independently generated secret via secrets manager.

**C3 — CORS fallback locked** — `apps/api/src/main.ts` previously had `?? true` (allow-all) fallback. Fixed to `?? false` and `.filter(Boolean)` added to strip empty strings from the origin list. `env.validation.ts` already enforces CORS_ORIGIN in production.

**C4 — Seed password removed from source** — `NatureGrid123!` was hardcoded in `apps/web/app/(public)/login/page.tsx` and `apps/admin/app/login/page.tsx`. Replaced with `process.env.NEXT_PUBLIC_SEED_PASSWORD ?? ''`. Local `.env.local` files updated to include the password for dev. Production builds never set this var so the hidden field is empty even if the panel is accidentally shown.

**Why:** These were the 4 critical findings from a full production readiness audit. The remaining high-priority items (H1–H6) and medium items (M1–M10) are documented in the audit conversation and not yet fixed.

**How to apply:** Do not revert to hardcoded seed passwords or `?? true` CORS fallbacks. When adding new seed-style dev UIs, follow the same env-var pattern.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Root (Nx run-many)
pnpm dev            # Start all apps
pnpm build          # Build all apps
pnpm test           # Run all tests
pnpm lint           # Lint all apps
pnpm format         # Format (nx format:write)

# Database (packages/database)
pnpm db:generate    # prisma generate
pnpm db:migrate     # prisma migrate dev (interactive, prompts for name)
pnpm db:push        # prisma db push (sync without migration file)
pnpm db:studio      # prisma studio

# Infrastructure
docker-compose up -d  # Start Postgres 16/PostGIS on :5433 + Redis 7 on :6379

# API tests (from apps/api)
pnpm exec jest                                  # All tests
pnpm exec jest --testPathPattern=auth.service   # Single spec file
pnpm exec jest --watch                          # Watch mode
pnpm exec jest --coverage                       # Coverage report
```

`pnpm lint` is excluded from CI because eslint is not installed as a bin; running it will fail.

## Architecture

**Nx monorepo** with pnpm workspaces. Three TS apps share packages via path aliases (`@nature-grid/*` → `packages/*/src`).

```
apps/api          NestJS modular monolith    :3001
apps/web          Next.js 14 public site     :3000
apps/admin        Next.js 14 admin shell     :3002
apps/data-worker  Python GIS skeleton        (no active jobs)

packages/database  Prisma schema + client + migrations
packages/shared    Enums/types (source of truth for enum values)
packages/contracts Route map + DTOs (used by web only; api does not depend on it)
packages/ui        Empty placeholder
packages/config    Empty placeholder
```

**Postgres runs on port 5433** (docker-compose remaps it; local Postgres occupies 5432). `DATABASE_URL` must reflect this.

### API (NestJS)

Global setup in `apps/api/src/main.ts`:
- Prefix `/api/v1`
- `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`
- `JwtAuthGuard` + `RolesGuard` + `ThrottlerGuard` registered globally via `APP_GUARD`

**Feature modules** (`apps/api/src/`): `auth`, `users`, `organizations`, `locations`, `providers`, `datasets`, `reports`, `alerts`, `observations`, `restoration`, `biodiversity`, `weather`, `metrics`, `database`, `common`. Stubs with no implementation: `media`, `ingestion`.

Each feature module follows: `*.module.ts` → `*.controller.ts` → `*.service.ts` → `dto/` folder.

**Auth & guard stack:**
- `JwtAuthGuard` (extends `AuthGuard('jwt')`) — checks `@Public()` reflector metadata; skips JWT validation if present
- `RolesGuard` — checks `@Roles(...)` metadata against `request.user.role`; skips if no `@Roles` decorator applied
- `@Public()` — `SetMetadata(PUBLIC_KEY, true)` — bypasses `JwtAuthGuard` entirely
- `@Roles('ADMIN', ...)` — role gate; values must be UPPERCASE matching Prisma enum exactly
- `@CurrentUser()` — param decorator injecting `JwtPayload` from `request.user`

**Refresh tokens:** Opaque crypto-random bytes stored as SHA-256 hash in Postgres (`RefreshToken` model). Not JWTs. Redeemable only via `POST /api/v1/auth/refresh`. Rotated on use; daily cleanup cron removes expired rows.

**JWT_SECRET** is validated at boot in `apps/api/src/common/env.validation.ts`. The app refuses to start if the secret is missing, empty, a known placeholder (`dev-secret-change-in-production`, `change-me`, `secret`), or shorter than 32 characters. Generate with `openssl rand -base64 48`.

### Database (Prisma)

Schema: `packages/database/prisma/schema.prisma` — 24 models, 15 enums.

**All IDs are Prisma CUIDs** (e.g. `cmstewlrj0012usw17sqz1d3n`). Use `@IsString()` in DTO validators, never `@IsUUID()`.

**All enum values are UPPERCASE** and defined in `packages/shared`. A previous bug had them lowercase, causing `RolesGuard` to reject every request including admins. The shared package is the canonical source — Prisma, guards, and DTOs must all agree.

Seeding happens in service `onModuleInit()` hooks (idempotent `count()` check):
- `LocationsService` — seeds 8 divisions + 64 districts with coordinates
- `ProvidersService` — seeds OpenMeteo provider record
- `DatasetsService` — seeds 5 dataset catalog records

Every mutation writes an `AuditEvent` record (action, userId, entityType, entityId, meta, ipAddress).

Notable schema decisions:
- `Occurrence.gbifOccurrenceKey` is `BigInt` — real GBIF keys exceed `INT4` range (caught on first live sync)
- Geography fields are plain `Float` lat/lng, not PostGIS `geography` — the PostGIS image runs but the type is not yet used in schema
- No org-membership model — `ORGANIZATION_ADMIN` is a bare role, not scoped to a specific organization

### Frontend (apps/web)

Next.js 14 App Router, Server Components throughout — no `useState`, no Redux, no Zustand. All form mutations use Server Actions. State lives in the URL or httpOnly cookies.

Route groups: `(public)` — `/`, `/login`, `/register`; `(app)` — all other pages behind a sidebar shell. Edge middleware (`middleware.ts`) guards `/profile` and auto-refreshes expired access tokens before page render.

Fetch helpers: `apiGet` (cached), `apiGetAuthed`, `apiPost`, `apiPostAuthed` (never cached).

`apps/web` depends on `@nature-grid/contracts` for route constants and DTOs. `apps/api` does **not** depend on contracts, so backend route strings and response shapes can drift — there are no contract tests.

### Weather & Biodiversity modules

Both are self-contained; neither is wired to the generic `ingestion` module stubs.

- `weather/` — OpenMeteo HTTP client, three cron jobs (current every 15 min, hourly/AQ every 2 h, daily every 12 h), public read endpoints
- `biodiversity/` — GBIF HTTP client, daily sync cron (fetches 1 000 occurrences), species + occurrence read endpoints

### Testing

56 unit tests in 5 spec files under `apps/api/src/` (all fully mocked — no DB, no running server):
- `roles.guard.spec.ts` — all 6 roles, case-sensitivity regression
- `jwt-auth.guard.spec.ts` — `@Public()` bypass, error handling
- `auth.service.spec.ts` — register/login/refresh/logout, token rotation, audit events
- `refresh-token.util.spec.ts` — opaque format, hash isolation
- `env.validation.spec.ts` — placeholder rejection, 31/32-char boundary

`apps/web` and `apps/admin` have no tests (`echo "No web tests configured yet"`).

CI (`.github/workflows/ci.yml`): `pnpm install --frozen-lockfile` → `prisma generate` → `prisma validate` → `tsc --noEmit` × 3 → `jest` → `pnpm build`. The repo has no git remote yet, so no workflow has executed in CI.

## Key environment variables

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Must point to port **5433** for local docker dev |
| `JWT_SECRET` | Required. ≥ 32 chars, no known placeholders. App fails fast if absent. |
| `PORT` | Defaults to `3001` |
| `CORS_ORIGIN` | Defaults to `*` in dev |
| `API_URL` | Used by `apps/web` server-side fetches (no `NEXT_PUBLIC_` prefix) |
| `REDIS_URL` | In `.env.example` but **not consumed** — no Redis/BullMQ client exists |

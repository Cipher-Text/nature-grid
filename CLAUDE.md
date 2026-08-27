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
docker compose up -d           # Start Redis + API + web + admin containers
docker compose build api       # Rebuild API image after schema/migration changes
docker compose logs api -f     # Stream API logs (seeding, cron jobs)

# API tests (from apps/api)
pnpm exec jest                                  # All tests
pnpm exec jest --testPathPattern=auth.service   # Single spec file
pnpm exec jest --watch                          # Watch mode
pnpm exec jest --coverage                       # Coverage report
```

`pnpm lint` is excluded from CI (rule set not yet stabilised) but runs cleanly locally — run it before any PR.

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

**Postgres is local-only** — the docker-compose no longer runs a Postgres container. Local Postgres runs on **port 5432**; `DATABASE_URL` must use `localhost:5432`. The API container connects via `host.docker.internal:5432`.

### API (NestJS)

Global setup in `apps/api/src/main.ts`:
- `helmet()` applied first — security headers on every response including errors
- Prefix `/api/v1`
- `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`
- `JwtAuthGuard` + `RolesGuard` + `PermissionsGuard` registered via `useGlobalGuards`; `ThrottlerGuard` registered via `APP_GUARD` in `AppModule` (needs DI)
- Rate limits: global 120 req / 60 s; auth endpoints tightened — login/register 5 req / 60 s, refresh 20 req / 60 s

**Feature modules** (`apps/api/src/`): `auth`, `users`, `organizations`, `locations`, `locations/climate`, `providers`, `datasets`, `reports`, `alerts`, `observations`, `restoration`, `biodiversity`, `weather`, `flood`, `radiation`, `marine`, `emissions`, `gamification`, `metrics`, `notifications`, `permissions`, `analytics`, `database`, `common`. Also registered in `AppModule`: a `SeedService` (seeds dev users + organization on boot). Stub with no implementation: `media`. Implemented: `ingestion`.

Each feature module follows: `*.module.ts` → `*.controller.ts` → `*.service.ts` → `dto/` folder.

**Auth & guard stack:**
- `JwtAuthGuard` (extends `AuthGuard('jwt')`) — checks `@Public()` reflector metadata; skips JWT validation if present
- `RolesGuard` — checks `@Roles(...)` metadata against `request.user.role`; skips if no `@Roles` decorator applied
- `PermissionsGuard` — checks `@RequirePermissions(...)` metadata against DB-backed role-permission grants; ADMIN bypasses all permission checks; results are cached per role for 5 minutes
- `@Public()` — `SetMetadata(PUBLIC_KEY, true)` — bypasses `JwtAuthGuard` entirely
- `@Roles('ADMIN', ...)` — role gate; values must be UPPERCASE matching Prisma enum exactly
- `@RequirePermissions('organizations.manage', ...)` — fine-grained permission gate backed by `Permission`/`RolePermission` models
- `@CurrentUser()` — param decorator injecting `JwtPayload` from `request.user`

**Refresh tokens:** Opaque crypto-random bytes stored as SHA-256 hash in Postgres (`RefreshToken` model). Not JWTs. Redeemable only via `POST /api/v1/auth/refresh`. Rotated on use; daily cleanup cron removes expired rows.

**JWT_SECRET** is validated at boot in `apps/api/src/common/env.validation.ts`. The app refuses to start if the secret is missing, empty, a known placeholder (`dev-secret-change-in-production`, `change-me`, `changeme`, `secret`), or shorter than 32 characters. Generate with `openssl rand -base64 48`.

### Database (Prisma)

Schema: `packages/database/prisma/schema.prisma` — 39 models, 23 enums. Single migration: `packages/database/prisma/migrations/20260826150548_init`.

**All IDs are Prisma CUIDs** (e.g. `cmstewlrj0012usw17sqz1d3n`). Use `@IsString()` in DTO validators, never `@IsUUID()`.

**All enum values are UPPERCASE** and defined in `packages/shared`. A previous bug had them lowercase, causing `RolesGuard` to reject every request including admins. The shared package is the canonical source — Prisma, guards, and DTOs must all agree.

Seeding happens in service `onModuleInit()` hooks (idempotent upserts):
- `LocationsService` — seeds 8 divisions, 64 districts (56 with GeoJSON boundary), 494 upazilas, 4,540 unions — all with lat/lng. Hardcoded in `apps/api/src/locations/seed/bangladesh.ts` (no runtime file reads). Regenerate with `scripts/gen-bangladesh-seed.py` from `administrative.json` + `districts.geojson`.
- `ProvidersService` — seeds OpenMeteo + GBIF provider records
- `DatasetsService` — seeds 9 dataset catalog records (OpenMeteo Weather, OpenMeteo Flood, District Air Quality Index, Water Body Registry, Biodiversity Occurrences, Sundarbans Monitoring, Emissions Inventory, OpenMeteo Marine Weather, OpenMeteo Satellite Radiation)
- `PermissionsService` — seeds 13 named permissions (`reports.create`, `reports.moderate`, `alerts.manage`, `restoration.create`, `restoration.join`, `observations.create`, `observations.verify`, `observations.delete`, `organizations.access`, `organizations.manage`, `users.manage`, `emissions.manage`, `emissions.report`) and default role grants
- `SeedService` — seeds 6 dev user accounts (one per role, password `NatureGrid123!`) and a seed organization for local development

Every mutation writes an `AuditEvent` record (action, userId, entityType, entityId, meta, ipAddress).

Notable schema decisions:
- `Occurrence.gbifOccurrenceKey` is `BigInt` — real GBIF keys exceed `INT4` range (caught on first live sync)
- Geography fields are plain `Float` lat/lng, not PostGIS `geography` — the PostGIS image runs but the type is not yet used in schema
- `OrganizationMembership` model links users to organizations with `ADMIN` or `MEMBER` role — users may belong to multiple organizations. `ORGANIZATION_ADMIN` is also a platform-level role in `UserRole`, separate from org-scoped membership.
- All 4 geography models (`Division`, `District`, `Upazila`, `Union`) carry 11 climate columns (`avgTemp30d`, `minTemp30d`, `maxTemp30d`, `avgHumidity30d`, `totalPrecip30d`, `avgWindSpeed30d`, `avgCloudCover30d`, `avgPm25_30d`, `avgPm10_30d`, `avgUvIndex30d`, `climateUpdatedAt`) — populated nightly by `LocationClimateModule`
- `UnionDailyClimate` — raw daily history per union; the source for 30-day rolling averages
- `UserProfile.earnedBadges` (String[]) + `UserProfile.contributionPoints` (Int) — gamification data stored on the profile model; no separate Badge model
- `PollutionSource` + `EmissionEntry` — emissions tracking with enums `PollutionSourceType`, `PollutantType`, `EmissionUnit`

### Frontend (apps/web)

Next.js 14 App Router, Server Components throughout — no `useState`, no Redux, no Zustand. All form mutations use Server Actions. State lives in the URL or httpOnly cookies.

Route groups:
- `(public)` — `/`, `/login`, `/register`
- `(app)` — authenticated pages behind a sidebar shell: `/dashboard`, `/profile`, `/alerts`, `/alerts/:id`, `/observations`, `/observations/:id`, `/biodiversity`, `/biodiversity/species/:id`, `/community`, `/reports`, `/reports/:id`, `/locations`, `/locations/divisions/:id`, `/locations/districts/:id`, `/locations/upazilas/:id`, `/locations/unions/:id`, `/restoration`, `/restoration/:id`, `/data`, `/data/:id`, `/organizations`, `/organizations/:id`

Edge middleware (`middleware.ts`) guards `/profile` and auto-refreshes expired access tokens before page render.

Fetch helpers: `apiGet` (cached), `apiGetAuthed`, `apiPost`, `apiPostAuthed` (never cached).

**`DistrictSelect` component** (`apps/web/components/district-select.tsx`) — Server Component that renders a `<select>` with districts grouped by division via `<optgroup>`. Accepts `DistrictWithDivision[]` (includes `division?: { id, name }`). Used on profile, reports, observations, restoration pages.

**Profile page tabs** (URL param `?tab=...`): `personal` (bio, phone, occupation, expertise, research interests, social links, institution, education), `location` (district, country, visibility), `achievements` (profile completeness widget, badge showcase, contribution points, level), `alerts` (severity subscriptions), `security` (password change, session management).

`apps/web` depends on `@nature-grid/contracts` for route constants and DTOs. `apps/api` has `@nature-grid/contracts` as a **devDependency only** — it is never imported in production code, but `apps/api/src/common/contract-types.typecheck.ts` uses it for compile-time contract enforcement: every service return type is asserted against its contract type via `tsc --noEmit` in CI. A service dropping a required field or changing a field type will produce a `TS2322` error and fail the build.

**Contracts gap:** `packages/contracts/src/index.ts` does not yet list routes for `radiation`, `marine`, or `emissions` — these API endpoints exist but the web app does not consume them yet. Add contract entries before building frontend pages for those features.

### Admin Console (apps/admin)

Next.js 14 App Router at port 3002. Same Server Components + Server Actions pattern as `apps/web` — no client-side state.

Route groups: `(auth)` — `/login`; `(admin)` — all other pages behind a dark sidebar shell. Edge middleware (`middleware.ts`) guards all routes, decodes JWT expiry via `atob` (Edge runtime — no `Buffer`), auto-refreshes tokens before page render.

**Cookie separation:** uses `nga_access` / `nga_refresh` cookie names — distinct from `apps/web`'s `ng_access_token` / `ng_refresh_token` to prevent cross-app interference. Constants in `lib/session-constants.ts`.

**Role enforcement:** login rejects non-MODERATOR/ADMIN accounts at the application layer (best-effort revoke + clear cookies). The `(admin)` layout re-checks role on every render via `GET /api/v1/auth/profile`.

**Nav:** `components/admin-nav.tsx` is `'use client'` (uses `usePathname()` for active-link state); Datasets and Users links are ADMIN-only. The layout itself stays a Server Component.

Pages: Reports (moderation queue, 5-status tabs), Users (role change, deactivate, reactivate), Alerts (create, cancel, status tabs), Datasets (publish toggle, access policy), Organizations (create, membership management), Ingestion (job history, status tabs, per-job detail — ADMIN-only), Permissions (role ↔ permission matrix CRUD), Restoration (project admin), Audit (audit event log), Settings (layout & design tokens), System (system health).

### Weather, Biodiversity, Flood, Radiation, Marine & Location Climate modules

These modules handle external data ingestion. All use `IngestionService` (imported from `IngestionModule`) to write `IngestionJob` records per scheduler run.

- `weather/` — OpenMeteo HTTP client (`WeatherOpenMeteoClient`, exported from `WeatherModule`), three cron jobs (current every 15 min, hourly/AQ every 2 h, daily every 12 h), public read endpoints. Fetches at **district** level (64 locations).
- `biodiversity/` — GBIF HTTP client, daily sync cron (fetches 1,000 occurrences), species + occurrence read endpoints
- `flood/` — OpenMeteo Flood / GloFAS HTTP client, six-hour scheduler (initial sync on empty table), public forecast endpoints. Fetches 30-day discharge forecasts at **district** level.
- `radiation/` — OpenMeteo Satellite Radiation HTTP client (`RadiationOpenMeteoClient`), daily cron at 1am, initial sync on empty table. Fetches `shortwave_radiation_sum`, `sunshine_duration`, `daylight_duration` for all 64 districts (7-day window from the archive API). **Aggregation:** 10-minute native W/m² samples are summed to daily MJ/m² via `Σ(W/m²) × step_seconds / 1,000,000`; step interval is inferred from the first two timestamps. 3-attempt retry with exponential backoff (500 ms, 1500 ms); 30-second fetch timeout. Upserts per `(districtId, readingDate)`. Endpoints: `GET /radiation/daily`, `GET /radiation/daily/:districtId?from=&to=`.
- `marine/` — OpenMeteo Marine Weather HTTP client (`MarineOpenMeteoClient`), daily cron at 2am, initial sync on empty table. Fetches 11 daily wave/swell/wind-wave variables for all 64 district centroids; inland districts produce a fetch error logged as `warn` and skipped. Endpoints: `GET /marine/forecast`, `GET /marine/forecast/:districtId?from=&to=`.
- `locations/climate/` — `LocationClimateModule` with a daily cron (`0 0 0 * * *`). Fetches OpenMeteo at **union** level using the batch API (up to 1,000 coords per HTTP request — 4,540 unions = 6 total requests). Stores raw daily data in `UnionDailyClimate`, then recomputes 30-day rolling averages bottom-up: Union → Upazila → District → Division via bulk `UPDATE … FROM (SELECT … GROUP BY)` SQL wrapped in a single Prisma `$transaction`. Reuses `WeatherOpenMeteoClient` from `WeatherModule` (import `WeatherModule` to get it). Writes `IngestionJob` records via `IngestionService` (categories `WEATHER` + `AIR_QUALITY`).

### Emissions module

`apps/api/src/emissions/` — tracks industrial pollution sources and emission log entries.

- **Enums** (all in `packages/shared`): `PollutionSourceType` (FACTORY, POWER_PLANT, VEHICLE_FLEET, AGRICULTURE, CONSTRUCTION, WASTE_FACILITY, OTHER), `PollutantType` (CO2, CH4, N2O, PM25, PM10, NOX, SOX, VOC, CO, OTHER), `EmissionUnit` (TONS_PER_YEAR, KG_PER_DAY, GRAMS_PER_HOUR, MG_PER_M3, OTHER)
- **Endpoints:**
  - `GET /emissions/sources` — public list, pagination + filters (type, districtId, isActive)
  - `GET /emissions/sources/:id` — public detail
  - `POST /emissions/sources` — requires `emissions.manage` permission
  - `PATCH /emissions/sources/:id` — creator or ADMIN only
  - `GET /emissions/sources/:sourceId/entries` — public paginated entries
  - `POST /emissions/sources/:sourceId/entries` — requires `emissions.report` permission
- Audit actions: `EMISSION_SOURCE_CREATE`, `EMISSION_ENTRY_CREATE`

### Gamification module

`apps/api/src/gamification/` — profile completeness scoring and badge system.

- **Endpoint:** `GET /api/v1/gamification/me` — returns completeness score (0–100), missing field prompts, earned badges, contribution points, level
- **Profile completeness:** 10 weighted checks across `UserProfile`, `UserSocialLink`, `OrganizationMembership`, `CitizenReport`, `Observation`. No DB model — computed in `COMPLETENESS_CHECKS` array in `GamificationService`.
- **Levels:** Newcomer (0) → Contributor (100) → Advocate (300) → Champion (600) → Environmental Leader (1200+)
- **Badges:** 5 categories × 4 tiers (Bronze 25 pts / Silver 75 pts / Gold 150 pts / Emerald 300 pts): Civic Guardian (verified reports), Water Sentinel (water quality observations), Clean Air Defender (air quality contributions), Biodiversity Explorer (research-grade species), Restoration Pioneer (ecological restoration projects)
- Badge counts computed via 6 parallel Prisma queries. `evaluateBadges()` fires asynchronously (not awaited) after any contribution event. Earned badge IDs stored in `UserProfile.earnedBadges` (String[]).

### Analytics module

`apps/api/src/analytics/` — 5 role-gated dashboard endpoints, each returning aggregate stats tailored to the caller's role.

- `GET /analytics/admin` — users by role, reports by status, active alerts, organizations, datasets, species count, monthly observations, today's audit events
- `GET /analytics/moderator` — moderation queue depth, pending/under-review counts, reviewed-today, 7-day submission trend
- `GET /analytics/government` — active alerts by severity/division, verified reports (30 d), top districts, division climate data
- `GET /analytics/researcher` — total species, occurrences, research-grade observation %, top 10 species, 6-month occurrence trend
- `GET /analytics/orgadmin` — restoration projects by status, total/active counts, 30-day new projects, top projects by participant count

Complex queries use raw SQL via `prisma.$queryRaw`.

### Testing

52 unit tests in 5 spec files under `apps/api/src/` (all fully mocked — no DB, no running server):
- `roles.guard.spec.ts` — all 6 roles, case-sensitivity regression (9 tests)
- `jwt-auth.guard.spec.ts` — `@Public()` bypass, error handling (5 tests)
- `auth.service.spec.ts` — register/login/refresh/logout, token rotation, audit events, `USER_LOGIN_FAILED` in all three failure branches (24 tests)
- `refresh-token.util.spec.ts` — opaque format, hash isolation (7 tests)
- `env.validation.spec.ts` — placeholder rejection, 31/32-char boundary (7 tests)

`apps/web` and `apps/admin` have no tests (`echo "No web tests configured yet"`).

CI (`.github/workflows/ci.yml`): `pnpm install --frozen-lockfile` → `prisma generate` → `prisma validate` → `tsc --noEmit` × 3 → `jest` → `pnpm build`. The repo has no git remote yet, so no workflow has executed in CI.

## Key environment variables

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Local dev: `localhost:5432`. Docker container uses `host.docker.internal:5432`. |
| `JWT_SECRET` | Required. ≥ 32 chars, no known placeholders. App fails fast if absent. |
| `PORT` | Defaults to `3001` |
| `CORS_ORIGIN` | Defaults to `*` in dev |
| `API_URL` | Used by `apps/web` server-side fetches (no `NEXT_PUBLIC_` prefix) |
| `REDIS_URL` | In `.env.example` but **not consumed** — no Redis/BullMQ client exists |
| `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_PASSWORD` | Optional one-time production admin seed — skipped if already exists |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | Optional email delivery — not wired to any service yet |

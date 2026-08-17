# Progress

Last updated: 2026-08-17 (report submission form wired on `/reports`, a second critical validation bug found and fixed along the way; `/data`, `/reports`, `/alerts` built on the app-shell; critical RBAC bug found and fixed — every role-gated endpoint was rejecting all users, including admins)

## Status Legend

| Status | Meaning |
| --- | --- |
| Done | Completed and usable as baseline |
| In Progress | Started but not finished |
| Planned | Agreed direction, not started |
| Blocked | Cannot continue without decision or input |

## Overall Status

| Area | Status | Notes |
| --- | --- | --- |
| Monorepo scaffold | Done | `apps`, `packages`, `docs`, `infrastructure`, Nx/pnpm config |
| Documentation baseline | Done | Mission, vision, stack, roles, business logic, flows, API catalog, architecture |
| Frontend mocks | Done | All 11 pages — nav linking, sidebar, design system, trust levels, feed, admin console, theme reference |
| Public-first product model | Done | Public `/`, login-gated contribution/download/advanced access |
| Public frontend — M1 | Done | 8 React components, full CSS design system, static seed data, runs at port 3000 |
| Frontend live data — M13 | In Progress | Weather sidebar + full auth flow (login/register/logout, protected `/profile` now matching its mockup) live, and citizen report submission now wired to a real endpoint (2026-08-17) — see "Public Weather Wiring", "Public Auth Flow Wiring", "Profile Page Mockup Fidelity", and "Report Submission Form" below. Observation submission, live metrics, and every other homepage component are still static/not started. |
| Frontend "app shell" layout (sidebar pages) — M15 | In Progress | Established via `/profile`, now also powers `/data`, `/reports`, `/alerts` (all 2026-08-17) — see "App-Shell Pages: Data, Reports, Alerts" below. 3 of 7 remaining app-shell pages done (`/observations`, `/biodiversity`, `/restoration`, `/community` still pending, per **Milestone 15** in `implementation-plan.md`). |
| Shared types and contracts — M2 | Done | Full enums, DTOs, paginated envelopes, request/response types, route contract map |
| Backend foundation — M3 | Done | Auth (JWT/bcrypt), users, orgs, locations (8 div/64 district auto-seed), providers, datasets (catalog seed), reports (status workflow + audit), alerts (severity + audit), global validation, guard infrastructure. **Caveat:** role-gated endpoints shipped with a casing bug that rejected every user until 2026-08-17 — see "Critical RBAC Fix" below. |
| Prisma schema | Done | 9 enums, 18 models — core entities + 4 weather tables + `RefreshToken`; client regenerated |
| Database migration — M4 | Done | `20260814204043_init` applied; 13 tables live; Postgres on port 5433 (remapped — local Postgres occupies 5432) |
| District coordinates | Done | Migration `add_district_coordinates`; all 64 districts backfilled with real lat/lng sourced from `open-nature`'s district registry (`LocationsService.onModuleInit` backfills on boot if missing) |
| Seed data | Done | LocationsService auto-seeds 8 divisions + 64 districts (with coordinates) on boot; DatasetsService auto-seeds 5 catalog records; ProvidersService auto-seeds the `OpenMeteo` provider; no separate seed script needed |
| Auth — refresh / logout | Done | Postgres-backed `RefreshToken` model (not Redis — see "Auth Refresh/Logout" below), opaque tokens with rotation, daily cleanup cron |
| RBAC / role guard casing bug | Done | Fixed 2026-08-17 — see "Critical RBAC Fix" below. Every role-gated endpoint (`POST /alerts`, `PATCH /alerts/:id`, `PATCH /reports/:id/status`, `PATCH /users/:id/role`, `PATCH /users/:id/deactivate`) previously rejected all users, including admins. |
| PostGIS / geospatial fields | Planned | `lat/lng` Float on `District` (populated) and `CitizenReport`; replace with PostGIS `geography` type when ready |
| Observations module | Planned | Schema ready; controller/service not yet implemented |
| Biodiversity module | Planned | Module stub only; no schema model yet |
| Media module | Planned | Module stub only; no schema model yet |
| Weather ingestion (OpenMeteo) | Done | Live `weather` module — see "Weather ingestion" below |
| Ingestion module (generic) | Planned | `IngestionJob` model exists but unused by weather; module stub only, no job lifecycle wiring, no `ApiCallLog`/audit trail (deliberately skipped for weather — see `docs/ingestion-plan.md`) |
| Environmental monitoring model | Planned | OGC SensorThings-style or simplified internal model — decision pending |
| Dataset downloads / access requests | Planned | Routes defined in contracts; endpoint not implemented |
| Restoration / projects | Planned | Not started; waiting on core reports/datasets stability |
| Community module | Planned | Static mock only; no API module |
| Admin frontend | Planned | Shell only at port 3002 |
| Data worker | Planned | Python skeleton; no active jobs |

## Weather Ingestion (built 2026-08-16)

Self-contained `apps/api/src/weather` module — not the generic `apps/api/src/ingestion` module described in `docs/ingestion-plan.md`/`docs/implementation-plan.md` M6. See those docs' "Implementation status" notes for the design deviations (no `ApiCallLog`, no `IngestionJob` wiring, trimmed field set, `districtId` FK instead of proximity search).

- `weather-openmeteo.client.ts` — native `fetch` + manual 3-attempt retry against OpenMeteo forecast + air-quality APIs
- `weather.service.ts` — fetch/map/upsert into 4 tables; read methods for controller and cross-module use
- `weather.scheduler.ts` — `@Cron`: current every 15 min, hourly + air quality every 2h, daily every 12h
- `weather.controller.ts` — public `GET /weather/{current,hourly,daily,air-quality}[/:districtId]`
- `DatasetsService.currentWeather()` / `currentAirQuality()` — previously placeholder stubs, now wired to real `WeatherService` data

Verified live against the real OpenMeteo API and local Postgres.

## Auth Refresh/Logout (built 2026-08-16)

Postgres-backed, not Redis — `roadmap.md`/this doc previously said "needs a token store (Redis)", but `implementation-plan.md`'s concrete M5 task list specified a Prisma `RefreshToken` model instead. Went with Postgres: no Redis client dependency existed anywhere in `apps/api` yet, and this keeps a single source of truth alongside every other model.

- `RefreshToken` Prisma model — `tokenHash` (SHA-256, raw token never stored), `expiresAt`, `revokedAt`, `deviceId`/`ipAddress`/`userAgent`
- Refresh tokens are opaque random strings (`crypto.randomBytes(48)`), **not JWTs** — this closes a real bug found while scoping: the previous "refresh token" was a JWT signed with the same secret as the access token, so it could be used directly as a bearer access token. An opaque token can only ever be redeemed via `/auth/refresh`.
- `POST /auth/refresh` — validates, then **rotates**: old token revoked, new access+refresh pair issued. A stolen refresh token stops working the moment the legitimate client refreshes.
- `POST /auth/logout` — revokes a refresh token; idempotent.
- `RefreshTokenCleanupScheduler` — daily `@Cron` (2 AM) deletes tokens expired 30+ days ago.

Verified live: register → refresh (rotates) → reuse of old token rejected (401) → refresh token rejected when used as a Bearer access token (401, confirms the fix) → logout → refresh with logged-out token rejected (401) → logout again still succeeds (idempotent). Device metadata (IP, user-agent) confirmed captured on token rows.

## Public Weather Wiring (built 2026-08-16)

First slice of M13 (Frontend Data Integration) — `apps/web`'s homepage still renders mostly static seed data, but its "Current conditions" sidebar (`map-section.tsx`) now fetches live weather/AQ data instead.

- `packages/contracts/src/index.ts` — new `routes.weather` group + `CurrentWeatherReading`/`HourlyAirQualityReading` response types
- `apps/web/lib/api.ts` — new minimal server-side `apiGet<T>(path)` fetch helper (`API_URL` env var, no `NEXT_PUBLIC_` prefix — nothing runs client-side), `revalidate: 900` matching the current-weather cron cadence
- `apps/web/components/map-section.tsx` — now an async Server Component; fetches `/weather/current` + `/weather/air-quality`, picks Dhaka/Sylhet/Khulna/Cox's Bazar, falls back to the original static `CONDITIONS` array if the API is unreachable
- Relabeled two rows to match what's actually stored rather than what the mock implied: "Dhaka AQI" (a composite index we don't compute) → "Dhaka PM2.5" (raw stored value); "Sylhet rainfall (24h)" (a rolling sum we don't have) → "Sylhet precipitation (current)" (OpenMeteo's last-hour instantaneous reading)
- Sync-status row now reflects real data freshness ("Live" / "Delayed (Xm ago)") instead of a hardcoded "Healthy" string

Verified live end-to-end: seeded real OpenMeteo data → homepage rendered it → killed the API + cleared the Next.js fetch cache → homepage fell back cleanly to static values, no crash → restarted the API → live data resumed automatically. Test data and dev servers cleaned up afterward.

## Public Auth Flow Wiring (built 2026-08-16)

Second slice of M13 — login/register/logout are now fully wired end to end, not just the backend endpoints. This was a greenfield build on the frontend side: no routes, no middleware, no cookie handling, no auth deps existed in `apps/web` before this.

- Session storage is httpOnly cookies (not `localStorage`) — the only sane choice given every existing component in `apps/web` is a Server Component; Server Components can't read `localStorage` anyway, and cookies keep tokens inaccessible to any XSS payload.
- `middleware.ts` — runs on every request (Edge runtime). Decodes the access-token JWT's `exp` claim (no signature verification needed, just an expiry check) and, if it's missing/expired but a refresh-token cookie exists, calls `/auth/refresh` and rewrites both cookies **before** any Server Component renders. Protects `/profile` — redirects guests to `/login`.
- `lib/session.ts` / `lib/current-user.ts` — cookie set/clear (Server Actions only — Next.js forbids setting cookies during Server Component rendering) and `getCurrentUser()` (reads the now-fresh access token, calls `/auth/profile`, returns `null` for guests).
- `lib/auth-actions.ts` — `loginAction`/`registerAction`/`logoutAction` as Server Actions bound directly to `<form action={...}>` — zero client components, zero new client-side state library. Register auto-logs-in (the backend already returns tokens on register). Errors surface via a redirect + `?error=` query param rather than `useActionState`, trading a full-page reload on error for not introducing the first client component in the codebase.
- `app/login`, `app/register`, `app/profile` — new routes. (`login`/`register` were later moved into the `(public)` route group — see "Profile Page Mockup Fidelity" below.)
- `public-nav.tsx` moved from `page.tsx` into `layout.tsx` so it's shared shell across all routes, and made session-aware: "Sign in" for guests, "Hi, {displayName}" + sign-out for logged-in users. (The homepage/nav wrapper was later moved again, from the root `layout.tsx` into a `(public)` route group's layout — see below.)
- Fixed a pre-existing gap while here: `public-nav.tsx`/`public-footer.tsx`/`hero-section.tsx` all had "Sign in"/"Create account" CTAs pointing at `/profile`, which didn't distinguish login from registration and didn't exist as a route at all before this. Now point at real `/login`/`/register`.
- One bug caught before shipping: the middleware's JWT-decode initially used Node's `Buffer`, which doesn't exist in the Edge runtime middleware runs on — switched to the Web-standard `atob`.

Verified live in a real browser (not just curl, since Next.js Server Actions bound to `<form>` don't map to plain REST calls): guest nav state → `/profile` redirects to `/login` when logged out → register (auto-login) → real user data rendered on `/profile` → nav shows "Hi, {name}" → session persists across page navigation → logout reverts nav to guest and re-protects `/profile` → login with correct credentials works → login with wrong password shows the real backend "Invalid credentials" message. Not independently re-verified: the middleware's silent-refresh-on-expiry path (would require waiting out the 15-minute access token), though it calls the same `/auth/refresh` endpoint already proven correct in the backend auth work above.

## Profile Page Mockup Fidelity (built 2026-08-17)

`/profile` was shipped quickly (previous entry) as a bare 4-field account card to verify the auth flow worked — it didn't match `mocks/frontend-design/profile.html` at all. Fixing that turned out to reveal a bigger structural gap: **every mocked page except the public homepage** (`data`, `observations`, `reports`, `alerts`, `biodiversity`, `restoration`, `community`, `profile`, `admin`) shares one unified sidebar "app shell" layout, completely different from the top-nav shell the homepage uses. `/profile` needed that shell introduced for the first time.

- **Routing restructured**: `/`, `/login`, `/register` moved into a new `app/(public)/` route group with its own layout (owns `<PublicNav/>` + the `public-shell` wrapper). Root `app/layout.tsx` is now bare (`html`/`body`/fonts only) so `/profile` — deliberately left outside the group — doesn't inherit the public top nav. Route groups don't affect URLs, so `/`, `/login`, `/register` still resolve exactly as before.
- `components/app-sidebar.tsx` — new reusable sidebar (brand, sectioned nav — Overview/Explore/Account — active-link highlighting via an explicit `active` prop, since Server Components can't use the client-only `usePathname` hook). Intended to be reused by M7–M12's pages, not just `/profile`.
- CSS ported directly from the mock's `styles.css` into `globals.css`: `.app-shell`, `.sidebar`, `.profile-hero`, `.avatar`, `.stat-row`, `.tab-nav`, `.empty-state`. Same CSS variables as the existing design system, so no visual clash.
- `/profile` rebuilt: avatar (initials derived from `displayName`), role label, real stat-row (Role / Member since / Last sign-in — all from `GET /auth/profile`), tab nav (Activity/My Reports/My Observations/Campaigns), and an honest "No activity yet" empty state.
- **Deliberately not ported from the mock**: the mock's Eco score, badges count, "Badges earned" panel, "Recent activity" feed items, and "Settings" notification toggles — none of those have a backing data model (no badge system, no user-facing activity log, no notification-preferences field on `User`). Fabricating numbers/feed items for these would misrepresent the product; they're honestly omitted rather than faked, per an explicit decision on this rebuild.
- One bug caught during verification: nesting each sidebar nav section in its own wrapper `<div>` broke the CSS grid the mock's flat nav structure relies on (links overlapped). Fixed by flattening `AppSidebar`'s render to direct siblings, matching the mock's actual DOM shape.

Verified live in a real browser: homepage unaffected (still top-nav, still live weather data) → register → `/profile` renders the sidebar shell with real data, matching the mock's layout → sign-out (moved to match the mock's hero position) still works and redirects to `/` with guest state restored.

## Critical RBAC Fix (found + fixed 2026-08-17)

Discovered while wiring `/alerts`'s role-conditional "Issue alert" badge — checking enum casing for filter chips surfaced a severe, already-shipped bug unrelated to the page-building task at hand.

**The bug:** `packages/shared/src/index.ts` defined `UserRole`, `AlertSeverity`, `ReportCategory`, `ReportStatus`, `DatasetCategory`, `DatasetAccessPolicy`, and `ProviderType` as **lowercase** string literals (`'admin'`, `'moderator'`, `'government'`, ...), but the real Prisma enums — what the database and JWT payload actually contain — are **uppercase** (`ADMIN`, `MODERATOR`, `GOVERNMENT`, ...). Every `@Roles(...)` call site was written against the lowercase shared type, e.g. `@Roles('government', 'moderator', 'admin')`, but `RolesGuard` compares that array against `request.user.role`, which is always uppercase at runtime. `['government','moderator','admin'].includes('ADMIN')` is `false` — always. **Every role-gated endpoint rejected every user, including legitimate admins, with no role able to pass**: `POST /alerts`, `PATCH /alerts/:id`, `PATCH /reports/:id/status`, `PATCH /users/:id/role`, `PATCH /users/:id/deactivate`.

This had been latent because nothing in `apps/web` consumed real API enum values through `@nature-grid/shared` until this session's work — the only prior consumer was `lib/static-data.ts`'s fully-static mock data, which never touched the real API.

**The fix:**
- `packages/shared/src/index.ts` — uppercased every enum to match Prisma exactly. `ObservationTrustLevel`/`ObservationCategory`/`ProjectStatus` (no Prisma model exists yet — Observations/Restoration modules are stubs) were uppercased too, on the same convention, to avoid repeating this bug when those modules ship.
- Every `@Roles(...)` call site fixed: `alerts.controller.ts` (×2), `reports.controller.ts`, `users.controller.ts` (class-level, gates the whole controller).
- `apps/api/src/users/dto/update-role.dto.ts`'s `@IsIn(ASSIGNABLE_ROLES)` validator list — same bug, a second and independent instance TypeScript caught immediately after the first fix (compiling `@nature-grid/api` failed with 5 real type errors here).
- `apps/web/lib/static-data.ts` and `components/reports-alerts-section.tsx` — the mock `ALERTS` array and its `SEVERITY_CLASS` lookup map used the same lowercase convention; fixed to match, otherwise alert severity coloring on the homepage would have silently broken the moment the shared type was corrected.
- `UserRole` keeps a `'guest'` variant not present in Prisma at all (unauthenticated requests have no role) — documented as never a real runtime value, kept only for the permission-matrix documentation use in `roles-and-permissions.md`.

**Verified live**, both directions: registered a citizen, bootstrapped them to `ADMIN` directly in Postgres (no admin existed yet to do it via the API), then confirmed `POST /alerts` → 201 (previously would have been 403 for every role) and `PATCH /users/:id/role` → 200 promoting a second test user. Re-confirmed a plain `CITIZEN` user is still correctly rejected (403) — the fix restores correct behavior in both directions, not just "allow everyone." Test users/data cleaned up afterward.

## App-Shell Pages: Data, Reports, Alerts (built 2026-08-17)

First 3 of Milestone 15's 7 pages — same honesty principle applied throughout: real data or an explicit "not available" state, never fabricated content.

- `packages/contracts/src/index.ts` — added `Dataset`, `CitizenReport`, `Alert`, `Provider`, `DistrictSummary` response types (none existed before; only request-param types did) and re-exported `ProviderType` from `@nature-grid/shared` (wasn't re-exported previously).
- `apps/web/lib/format.ts` — new `titleCase()`/`relativeTime()` helpers shared across the three pages.
- **`/data`** — real dataset catalog (`GET /datasets`) with a working category filter (query-string driven, no client JS). Mock's fabricated "Provider health" panel replaced with a real **Providers** panel (`GET /providers`). Mock's temperature/rainfall chart omitted entirely — no historical weather trend data exists to back it. Gated downloads shown as an honest access-policy tag, not a working button (`GET /datasets/:id/download` doesn't exist — M7).
- **`/reports`** — real report list (`GET /reports`, already correctly verified/resolved-only by default) with a working category filter. Metric cards show **only** Verified and Resolved counts (two real `?status=X` calls reading `.total`) — mock's "Under review"/"Submitted today" counts omitted, since the public API deliberately hides non-verified reports and showing those counts even in aggregate would undermine that access rule. Mock's elaborate disabled submission form replaced with a plain "Sign in to submit" CTA — the real form is separately sequenced (M13 task 5).
- **`/alerts`** — real alert cards + emergency banner (`GET /alerts`, ACTIVE by default) with a working severity filter, plus a real history table (`GET /alerts?status=EXPIRED`). Small backend fix needed first: `ALERT_SELECT` only projected `instructions`, not `description` — alert cards would've had no body text. "Warning zones" map reuses the homepage's existing decorative placeholder pattern (already documented as "replace with real map library in Phase 4"), not a new fabrication. "Issue alert" is a real role-conditional badge (`GOVERNMENT`/`MODERATOR`/`ADMIN` only, read from `getCurrentUser()`) — but since no alert-creation page exists yet, it reads "Issue alert — coming soon" rather than linking somewhere non-functional. Notification toggles replaced with a plain "coming soon" note.

Verified live: seeded a real verified report and two real alerts (one `EMERGENCY`, one `WARNING`) via the now-fixed role-gated endpoints, confirmed all three pages render them correctly, confirmed the category/severity filters actually refetch (not decorative), confirmed the "Issue alert" badge is invisible for guests/citizens and appears correctly once logged in as the bootstrapped admin. Test data and dev servers cleaned up afterward.

## Report Submission Form (built 2026-08-17)

M13 task 5 — the "Report an environmental issue" form on `/reports` was still decorative (disabled, mock-only) until this pass. Same honesty principle as the rest of M13/M15: the form matches the real `CreateReportDto` contract, not the mock's fields.

- `apps/web/app/reports/page.tsx` — form now renders for logged-in users (`user ? <form> : "Sign in to submit"` CTA, unchanged for guests). Fields: **Title** (added — not in the mock, but required by the real DTO and useful for the list view, which has no other short label to show), **Issue type** (real `ReportCategory` enum, was already correct), **District** (a real `<select>` populated from `GET /locations/districts`, replacing the mock's free-text location field — free text can't map to a real `districtId`), **Description** (unchanged). Mock's "Severity estimate" field dropped entirely — no such field exists on `CitizenReport` or `CreateReportDto`, and severity isn't citizen-set anywhere in the domain model. "Attach photo/video" also omitted — no media/upload backend exists yet (`ReportMedia` is still M8, unbuilt).
- `apps/web/lib/report-actions.ts` — new `submitReportAction` Server Action, posts to `POST /reports` with the authenticated user's access token; redirects to `/reports?submitted=1` on success or `/reports?error=...` with the real backend validation message on failure.
- `apps/web/lib/api.ts` — added `apiPostAuthed` (authenticated POST, never cached) and a shared `extractErrorMessage` helper fixing a latent bug in both `apiPost` and the new `apiPostAuthed`: NestJS's `ValidationPipe` returns `message` as a `string[]`, not a `string`, so the previous error handling would have rendered `"[object Object]"` or similar on any validation failure instead of the actual message.
- `app/globals.css` — `.field select`, `.field textarea`, `.form-success` added for the new form fields and the post-submit success banner.

**Second critical bug found while verifying this** (independent of the RBAC casing bug found in the previous pass): `CreateReportDto.districtId` and `CreateAlertDto.districtId` were both decorated `@IsUUID()`, but every ID in this schema is a Prisma CUID (e.g. `cmstewlrj0012usw17sqz1d3n`), not a UUID. Any report or alert submission that specified a real district — i.e. the realistic, non-empty-optional-field case — would always fail validation with "districtId must be a UUID". This had been masked in the previous RBAC-fix verification pass because that testing happened to omit `districtId` on every request. Fixed by changing `@IsUUID()` → `@IsString()` in both `apps/api/src/reports/dto/create-report.dto.ts` and `apps/api/src/alerts/dto/create-alert.dto.ts`, removing the now-unused `IsUUID` import from each.

Verified live end-to-end in a real browser (not just curl): filled and submitted the form on `/reports` with a district selected → success banner rendered → confirmed the row landed in Postgres with `status: SUBMITTED` and the correct `districtId`. Then exercised the full review workflow with a bootstrapped admin: `PATCH /reports/:id/status` `SUBMITTED → UNDER_REVIEW → VERIFIED`, confirmed via direct API call that the report now appears in `GET /reports?status=VERIFIED`. (The public `/reports` page itself won't reflect a just-verified report until its existing 15-minute ISR cache window elapses — same `revalidate: 900` pattern already used elsewhere in `apps/web`, not a new gap.) Test report, test users (`reporttester@naturegrid.bd`, a temporary bootstrapped `admintester@naturegrid.bd`), their refresh tokens, and the associated `ReportStatusEvent` audit rows were all cleaned up afterward; dev servers stopped and `apps/web/.next` cache cleared.

## Completed Files

### Project docs

- `docs/project-brief.md`
- `docs/access-model.md`
- `docs/tech-stack.md`
- `docs/roles-and-permissions.md`
- `docs/business-logic.md`
- `docs/flows.md`
- `docs/roadmap.md`
- `docs/progress.md`
- `docs/implementation-plan.md`

### Architecture docs

- `docs/architecture/README.md`
- `docs/architecture/feature-map.md`
- `docs/architecture/modules.md`
- `docs/architecture/data-model.md`
- `docs/architecture/refactor-plan.md`

### API docs

- `docs/api/README.md`
- `docs/api/initial-api.md`
- `docs/api/backend-api-links.md`

### Ingestion and planning

- `docs/ingestion-plan.md` — gap analysis vs Java backends, priority APIs, NestJS ingestion design, what NOT to port

### Frontend mocks

- `mocks/frontend-design/index.html`
- `mocks/frontend-design/data.html`
- `mocks/frontend-design/observations.html`
- `mocks/frontend-design/reports.html`
- `mocks/frontend-design/alerts.html`
- `mocks/frontend-design/biodiversity.html`
- `mocks/frontend-design/restoration.html`
- `mocks/frontend-design/community.html`
- `mocks/frontend-design/profile.html`
- `mocks/frontend-design/admin.html`
- `mocks/frontend-design/theme.html`

### Shared packages

- `packages/shared/src/index.ts` — 28 exported types and interfaces. Enum values corrected to uppercase 2026-08-17 to match Prisma (see "Critical RBAC Fix" above) — this file is the source of the casing that must always match the database.
- `packages/contracts/src/index.ts` — route map (incl. `weather`), response entity types (`Dataset`, `CitizenReport`, `Alert`, `Provider`, `CurrentWeatherReading`, `HourlyAirQualityReading`), request types (incl. refresh/logout), envelopes

### Database

- `packages/database/prisma/schema.prisma` — full domain schema (9 enums, 18 models)

### API (`apps/api/src/`)

- `database/prisma.service.ts`, `database/database.module.ts`
- `common/decorators/current-user.decorator.ts`
- `common/decorators/roles.decorator.ts`
- `common/guards/jwt-auth.guard.ts`
- `common/guards/roles.guard.ts`
- `auth/` — register, login, profile, refresh (rotating), logout, JWT strategy, refresh-token utils, daily cleanup cron, DTOs
- `users/` — list, get, update role, deactivate, DTOs (role-gating fixed 2026-08-17, see "Critical RBAC Fix")
- `organizations/` — list, get
- `locations/` — all 5 endpoints, Bangladesh seed (8 div / 64 districts, with lat/lng)
- `providers/` — list, get, OpenMeteo provider auto-seed
- `datasets/` — list, get, weather/current, air-quality/current (live via `weather` module), catalog seed
- `reports/` — list (public), get, create, status workflow, audit log, DTOs (role-gating fixed 2026-08-17; `districtId` validator fixed from `@IsUUID()` to `@IsString()` 2026-08-17, see "Report Submission Form" below)
- `alerts/` — list (public), get, create, update, audit log, DTOs (role-gating fixed 2026-08-17; `description` now selected in list/detail; `districtId` validator fixed from `@IsUUID()` to `@IsString()` 2026-08-17, same bug as reports)
- `weather/` — OpenMeteo client, service, scheduler, controller (current/hourly/daily/air-quality)

### Web frontend (`apps/web/`)

- `app/globals.css` — full public-page CSS design system + auth form styles + app-shell/sidebar/profile-hero styles (ported from the mock)
- `app/layout.tsx` — bare root layout: Inter font via next/font/google, no shell markup (moved to the `(public)` group below)
- `app/(public)/layout.tsx` — owns `<PublicNav />` + the `public-shell` wrapper for `/`, `/login`, `/register`
- `app/(public)/page.tsx` — composes all 8 public sections (route group; still resolves to `/`)
- `app/(public)/login/page.tsx`, `app/(public)/register/page.tsx` — Server Action forms, no client JS
- `app/profile/page.tsx` — protected route, outside the `(public)` group so it doesn't get the top nav; sidebar app-shell + real user data + honest empty-state activity feed (see "Profile Page Mockup Fidelity" above)
- `app/data/page.tsx`, `app/reports/page.tsx`, `app/alerts/page.tsx` — real data on the sidebar app-shell (see "App-Shell Pages: Data, Reports, Alerts" above); `/reports` also has a real, working submission form as of 2026-08-17 (see "Report Submission Form" above); `/observations`, `/biodiversity`, `/restoration`, `/community` still pending (Milestone 15)
- `lib/report-actions.ts` — `submitReportAction` Server Action, posts to `POST /reports` with the caller's access token
- `lib/static-data.ts` — typed seed data with migration guide (still used as-is by every component except `map-section.tsx`, which now uses it only as a fallback); `ALERTS`' severity values corrected to uppercase 2026-08-17
- `lib/api.ts` — server-side fetch helpers: `apiGet` (cached, weather/datasets/reports/alerts), `apiGetAuthed`/`apiPost`/`apiPostAuthed` (never cached, auth + mutations); shared `extractErrorMessage` correctly unwraps NestJS's `string[]` validation error format (fixed 2026-08-17)
- `lib/format.ts` — `titleCase()`/`relativeTime()` display helpers, shared by the new app-shell pages
- `lib/session-constants.ts`, `lib/session.ts`, `lib/current-user.ts` — cookie names, cookie set/clear, `getCurrentUser()`
- `lib/auth-actions.ts` — `loginAction`, `registerAction`, `logoutAction`
- `middleware.ts` — route protection (`/profile`) + proactive access-token refresh at the edge
- `.env.example` / `.env.local` — `API_URL` for the backend
- `components/public-nav.tsx` — async and session-aware (see "Public Auth Flow Wiring" above)
- `components/app-sidebar.tsx` — reusable sidebar shell, now used by `/profile`, `/data`, `/reports`, `/alerts`
- `components/hero-section.tsx`
- `components/metrics-section.tsx`
- `components/map-section.tsx` — "Current conditions" sidebar now live (see "Public Weather Wiring" above); map canvas panel still static
- `components/dataset-preview.tsx`
- `components/reports-alerts-section.tsx` — severity-to-CSS-class lookup fixed 2026-08-17 (same casing bug, see "Critical RBAC Fix"); dead `/profile` CTA fixed to `/login`
- `components/biodiversity-restoration.tsx`
- `components/community-section.tsx`
- `components/public-footer.tsx`

## Next Work

See `docs/implementation-plan.md` for the full milestone list (M5–M14).

1. ~~Review and approve the public-first mock direction.~~ Done.
2. ~~Revise mocks for production-level responsiveness and copy.~~ Done.
3. ~~Implement public web page from approved mock.~~ Done — M1.
4. ~~Define shared enums, DTOs, and route contracts.~~ Done — M2.
5. ~~Implement backend foundation.~~ Done — M3.
6. ~~Start the database and run migration.~~ Done — M4. Postgres on port 5433, Redis on 6379, API live at port 3001.
7. ~~Seed data.~~ Done — auto-seeded on first boot (8 div / 64 dist / 5 datasets).
8. ~~Write ingestion plan — analyse Java backends, identify gaps, plan NestJS design.~~ Done — `docs/ingestion-plan.md`.
9. **M5 partial:** District lat/lng ✓ and auth refresh/logout ✓ (2026-08-16, Postgres-backed, not Redis — see "Auth Refresh/Logout" above). Still pending: `ReportMedia`, `ReportComment`, `RestorationProject` models.
10. ~~**M6:** Implement OpenMeteo ingestion — weather + air quality.~~ Done (2026-08-16), with a redesigned scope: self-contained `weather` module (not the generic `ingestion` module originally planned), no `ApiCallLog`/`IngestionJob` wiring. See `docs/ingestion-plan.md` and `docs/implementation-plan.md` for the design-deviation notes.
11. **M13 in progress:** Homepage weather sidebar (2026-08-16), full auth flow (2026-08-16), `/profile` rebuilt to match its mockup with a reusable sidebar app-shell (2026-08-17), and citizen report submission wired to `POST /reports` (2026-08-17) — see "Public Weather Wiring", "Public Auth Flow Wiring", "Profile Page Mockup Fidelity", and "Report Submission Form" above. Still not started: observation submission, live platform metrics, every other homepage component still static.
12. **M15 in progress:** `/data`, `/reports`, `/alerts` built on the app-shell with real backend data (2026-08-17) — see "App-Shell Pages: Data, Reports, Alerts" above. Also fixed in the same pass: a critical RBAC casing bug that had every role-gated endpoint rejecting all users — see "Critical RBAC Fix" above — and, while wiring `/reports`'s submission form, a second bug where `districtId` validators required a UUID but the schema uses CUIDs — see "Report Submission Form" above. Still pending: `/observations`, `/biodiversity`, `/restoration`, `/community` (all need honest empty states, no backend yet).
13. **Next up:** The remaining 4 M15 pages (`/observations`/`/biodiversity`/`/restoration`/`/community`), observation submission (rest of M13, now unblocked by real auth), WAQI integration (M14) for station-level AQI, ingestion observability (job tracking before a 2nd provider), or resume M5's remaining schema items (ReportMedia/Comment, RestorationProject).

## Open Questions

- ~~District lat/lng centroids: load from open-nature-backend2 CSVs or hardcode divisional capitals first?~~ Resolved — loaded from `open-nature`'s district CSV (all 64 districts, not just divisional capitals).
- WAQI API key: register at aqicn.org for dev/staging?
- Weather data retention policy: how long to keep raw hourly/daily rows? No aggregation tables were built, so this is now more pressing than originally scoped.
- Should a generic `ApiCallLog`/audit trail be added for external ingestion calls, or is per-request logging via the NestJS `Logger` sufficient? Currently skipped by deliberate decision for the weather module.
- "Log out all devices" / view active sessions — `RefreshToken` has `deviceId`, so a per-device session list and bulk-revoke endpoint are straightforward to add later; deliberately out of scope for the initial refresh/logout pass.
- Role-aware nav beyond guest-vs-logged-in (moderator/admin nav, role-specific CTAs) — deliberately out of scope for the frontend auth wiring pass; current nav only distinguishes guest from any authenticated user.
- Eco score, badges, and a user-facing activity feed (all shown in the `profile.html` mock) have no backing data model at all — is this product direction still wanted? If so it needs real scoping (a badge/achievement system, an activity log exposed per-user, a scoring formula), not just a UI pass. Currently omitted from `/profile` rather than faked.
- ~~No milestone currently covers building `/data`, `/observations`, `/reports`, `/alerts`, `/biodiversity`, `/restoration`, `/community` as real `apps/web` routes.~~ Resolved (2026-08-17) — added as **Milestone 15** in `implementation-plan.md`. `/data`, `/reports`, `/alerts` can wire to real backends immediately; `/observations`, `/biodiversity`, `/restoration`, `/community` still need honest empty states until their respective backend milestones ship.
- No automated test currently guards against the RBAC casing bug recurring (e.g. a future `@Roles(...)` call site or a new shared enum drifting back to lowercase). Worth an integration test that actually logs in per role and hits each role-gated endpoint, rather than relying on TypeScript to catch it by luck the way it did this time.
- Same class of gap for the CUID/UUID bug found 2026-08-17: nothing currently guards against a future optional ID field being decorated `@IsUUID()` instead of `@IsString()`. A quick grep-based check (`@IsUUID()` should not appear anywhere in `apps/api` given this schema never generates real UUIDs) would catch it cheaply without a full integration test.
- Should government users publish alerts directly, or must alerts always go through moderator/admin approval?
- PostGIS `geography` fields: replace lat/lng Float when polygon queries needed (deferred to Phase 3).

# Progress

Last updated: 2026-08-19 (Milestone 11 — Restoration Projects — built end to end, real data now live on `/restoration`; Milestone 9 — Observations module — built end to end, real data now live on `/observations`; Milestone 15 complete — all 7 app-shell pages built; report submission form wired on `/reports`, a second critical validation bug found and fixed along the way; critical RBAC bug found and fixed — every role-gated endpoint was rejecting all users, including admins)

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
| Frontend live data — M13 | In Progress | Weather sidebar + full auth flow (login/register/logout, protected `/profile` now matching its mockup) live, and citizen report + observation submission both now wired to real endpoints (2026-08-17) — see "Public Weather Wiring", "Public Auth Flow Wiring", "Profile Page Mockup Fidelity", "Report Submission Form", and "Observations Module" below. Live platform metrics and every other homepage component are still static/not started. |
| Frontend "app shell" layout (sidebar pages) — M15 | Done | Established via `/profile`, powers all 7 pages. `/data`, `/reports`, `/alerts`, `/observations` (2026-08-17), and now `/restoration` (2026-08-19) show real backend data; `/biodiversity` and `/community` still show honest empty states — see "App-Shell Pages: Data, Reports, Alerts", "App-Shell Pages: Observations, Biodiversity, Restoration, Community", "Observations Module", and "Restoration Projects Module" below. |
| Shared types and contracts — M2 | Done | Full enums, DTOs, paginated envelopes, request/response types, route contract map |
| Backend foundation — M3 | Done | Auth (JWT/bcrypt), users, orgs, locations (8 div/64 district auto-seed), providers, datasets (catalog seed), reports (status workflow + audit), alerts (severity + audit), global validation, guard infrastructure. **Caveat:** role-gated endpoints shipped with a casing bug that rejected every user until 2026-08-17 — see "Critical RBAC Fix" below. |
| Prisma schema | Done | 14 enums, 21 models — core entities + 4 weather tables + `RefreshToken` + `Observation` (2026-08-17) + `RestorationProject`/`RestorationParticipant` (2026-08-19, migration `20260819104332_add_restoration_projects`); client regenerated |
| Database migration — M4 | Done | `20260814204043_init` applied; 13 tables live; Postgres on port 5433 (remapped — local Postgres occupies 5432) |
| District coordinates | Done | Migration `add_district_coordinates`; all 64 districts backfilled with real lat/lng sourced from `open-nature`'s district registry (`LocationsService.onModuleInit` backfills on boot if missing) |
| Seed data | Done | LocationsService auto-seeds 8 divisions + 64 districts (with coordinates) on boot; DatasetsService auto-seeds 5 catalog records; ProvidersService auto-seeds the `OpenMeteo` provider; no separate seed script needed |
| Auth — refresh / logout | Done | Postgres-backed `RefreshToken` model (not Redis — see "Auth Refresh/Logout" below), opaque tokens with rotation, daily cleanup cron |
| RBAC / role guard casing bug | Done | Fixed 2026-08-17 — see "Critical RBAC Fix" below. Every role-gated endpoint (`POST /alerts`, `PATCH /alerts/:id`, `PATCH /reports/:id/status`, `PATCH /users/:id/role`, `PATCH /users/:id/deactivate`) previously rejected all users, including admins. |
| PostGIS / geospatial fields | Planned | `lat/lng` Float on `District` (populated) and `CitizenReport`; replace with PostGIS `geography` type when ready |
| Observations module — M9 | Done | Full CRUD + trust-level workflow live (2026-08-17) — see "Observations Module" below. `/observations` now shows real data with a working submission form. |
| Biodiversity module | Planned | Module stub only; no schema model yet. `/biodiversity` page exists (2026-08-17) with an honest empty state |
| Media module | Planned | Module stub only; no schema model yet |
| Weather ingestion (OpenMeteo) | Done | Live `weather` module — see "Weather ingestion" below |
| Ingestion module (generic) | Planned | `IngestionJob` model exists but unused by weather; module stub only, no job lifecycle wiring, no `ApiCallLog`/audit trail (deliberately skipped for weather — see `docs/ingestion-plan.md`) |
| Environmental monitoring model | Planned | OGC SensorThings-style or simplified internal model — decision pending |
| Dataset downloads / access requests | Planned | Routes defined in contracts; endpoint not implemented |
| Restoration / projects — M11 | Done | Full CRUD + idempotent join workflow live (2026-08-19) — see "Restoration Projects Module" below. `/restoration` now shows real data with a working creation form (org-admins/admins) and a Join action (everyone else). |
| Community module | Planned | Not planned as an API module at all yet (`docs/architecture/feature-map.md`). `/community` page exists (2026-08-17) with an honest empty state — homepage's `community-section.tsx` still shows static mock data, a separate, already-documented M13 gap |
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

## App-Shell Pages: Observations, Biodiversity, Restoration, Community (built 2026-08-17)

Final 4 of Milestone 15's 7 pages — completes the milestone. At the time, none of these four had any backend: no `Observation` model (M9), no `Species`/`Occurrence` models or GBIF ingestion (M10), no `RestorationProject` model (M11), and Community isn't even planned as an API module yet (`docs/architecture/feature-map.md` says keep it out of core until a real content workflow exists). Same honesty principle as every prior page this session — an explicit "not built yet" state, not the mocks' fabricated stats, species cards, project rows, or feed. **`/observations` was later upgraded to real data once M9 shipped, and `/restoration` once M11 shipped — see "Observations Module" and "Restoration Projects Module" below.**

- `apps/web/app/observations/page.tsx`, `apps/web/app/biodiversity/page.tsx`, `apps/web/app/restoration/page.tsx`, `apps/web/app/community/page.tsx` — all new. Each renders `<AppSidebar active="..." />` + the mock's real title/subtitle copy, then a single `panel` with an `.empty-state` message naming what's missing and which milestone unblocks it. The mocks' search bars, type filters, metric grids, species cards, habitat-pressure chart, project leaderboard, and feed items were all dropped — they're decorative controls and fabricated numbers over data that doesn't exist.
- `/observations` additionally links to `/reports` ("In the meantime, you can file a citizen report") as the nearest real thing citizens can do today.
- **Judgment call on `/community` specifically**: `implementation-plan.md` had left this open between an honest empty state or keeping the mock's static `COMMUNITY_FEED` data labeled as illustrative. Went with the same empty state as the other three, for consistency with the precedent set twice already (`/profile`'s eco score/badges, and `/data`/`/reports`/`/alerts`) rather than carving out an exception. Note this doesn't touch the homepage's `community-section.tsx`, which still renders that static feed data — a separate, already-documented M13 gap, not part of this page-building task.
- No backend, CSS, or contracts changes needed — `.empty-state`/`.panel`/`.panel-header` already existed, and `AppSidebar` already had all four `NavKey` entries wired correctly.

Verified live in a real browser: all four routes render (confirmed via `curl` 200s too), sidebar active-link highlighting is correct on each, no console errors, and `nx run @nature-grid/web:build` compiles cleanly with all four correctly picked up as static pages (no data dependency, unlike `/data`/`/reports`/`/alerts`'s dynamic rendering). Dev server stopped and `.next` cache cleared afterward. **Milestone 15 is now fully done — all 7 app-shell pages exist.**

## Observations Module (built 2026-08-17)

Milestone 9 — the first of the four "not built yet" M15 pages to get a real backend. Closes two long-open threads at once: `/observations` gets real data, and observation submission (the last unbuilt piece of M13) now works.

- `packages/database/prisma/schema.prisma` — new `Observation` model (`category`, `trustLevel` `@default(UNVERIFIED)`, `description`, `districtId?`/`district`, `lat?`/`lng?`, `species?`, `observerId?`/`observer`, `observedAt`) plus `ObservationCategory` and `ObservationTrustLevel` enums — these already existed uppercase in `packages/shared` (added proactively during the Critical RBAC Fix specifically to avoid this bug when the module shipped, and it worked: no casing mismatch this time). Added `OBSERVATION_TRUST_CHANGE` to `AuditAction` (`OBSERVATION_SUBMIT` already existed but was unused until now). Migration `20260817181448_add_observations`.
- `apps/api/src/observations/` — full CRUD mirroring the `reports` module's shape: `@Public() GET /observations` (filterable by category/trustLevel/districtId, hides `FLAGGED` by default the same way reports hides unverified statuses by default), `@Public() GET /observations/:id`, `POST /observations` (any authenticated user, defaults to `UNVERIFIED`, writes `OBSERVATION_SUBMIT` audit event), `@Roles('RESEARCHER','ADMIN') PATCH /observations/:id/trust` (writes `OBSERVATION_TRUST_CHANGE` with `{from, to}` in `meta`). `districtId` validated with `@IsString()`, not `@IsUUID()` — applied the CUID lesson from the start this time, no bug to find.
- **Trust-level gate scope decision**: `updateTrust` is `RESEARCHER`/`ADMIN` only, not `MODERATOR` — matched the original M9 plan text exactly rather than extending the reviewer set from reports, since trust validation is a domain-expertise judgment, distinct from a moderation/status-review task. Confirmed with the user before implementing.
- `packages/contracts/src/index.ts` — added a full `Observation` response type (same treatment `Dataset`/`CitizenReport`/`Alert` got for M15) and a `trust` route. Also corrected `CreateObservationRequest`, which had never been wired to anything real: it previously had a speculative `locationId`/`coordinates`/`observedAt`/`species` shape that didn't match what the app actually needed to send. Now matches the real DTO (`category`, `description`, `districtId?`, `lat?`, `lng?`).
- `apps/web/app/observations/page.tsx` — replaces the honest-empty-state page with a real list (category filter, trust-level shown via existing `.tag` variants — no new `.trust-pill` CSS ported from the mock) and a real submission form (category, district — real `<select>`, not free text — description). **Deliberately dropped from the form**: `species` and a user-editable `observedAt` — the mock's own submission preview doesn't have them either (just type/location/description), and the server sets `observedAt` to submission time automatically. Also skipped the mock's decorative map, matching `/data`'s precedent of dropping mock chrome that adds no function.
- `apps/web/lib/observation-actions.ts` — new `submitObservationAction` Server Action, same shape as `submitReportAction`.

Verified live: registered a citizen, submitted an observation with a real district → confirmed `UNVERIFIED` in Postgres and visible via `GET /observations` → confirmed the same citizen gets 403 on `PATCH /:id/trust` → bootstrapped a `RESEARCHER`, promoted the same observation to `RESEARCH_GRADE` → confirmed both audit events (`OBSERVATION_SUBMIT`, `OBSERVATION_TRUST_CHANGE` with correct `from`/`to`) were recorded. Full browser click-through of the new `/observations` page (login → filter → submit → success banner) confirmed the same flow visually. Both `apps/api` and `apps/web` builds are clean. Test users, test observation, and dev servers cleaned up afterward.

## Restoration Projects Module (built 2026-08-19)

Milestone 11 — the second of the four "not built yet" M15 pages to get a real backend (after Observations/M9). Also finally lands `RestorationProject`, the last of the three models M5 deferred back on 2026-08-16 (`ReportMedia`/`ReportComment` are still pending).

- `packages/database/prisma/schema.prisma` — new `RestorationProject` model (`title`, `description`, `category`, `status` reusing the existing `ProjectStatus` enum `@default(PLANNED)`, `organizationId?`/`organization`, `districtId?`/`district`, `startDate?`/`endDate?`, `impactSummary?`, `createdById`/`createdBy`) plus a new `RestorationParticipant` join model (`projectId`, `userId`, `joinedAt`, `@@unique([projectId, userId])`) and a new `RestorationCategory` enum (`TREE_PLANTING`/`WETLAND_RESTORATION`/`RIVERBANK_PROTECTION`/`MANGROVE`/`WASTE_MANAGEMENT`/`OTHER`, matching the mock's filter options — no shared enum for this existed before). Added `RESTORATION_PROJECT_CREATE`/`_UPDATE`/`_JOIN` to `AuditAction`. Migration `20260819104332_add_restoration_projects`.
- **Scope simplification, confirmed with the user before implementing**: the original M5 field list included `fundingGoal`/`fundingRaised`/`impactMetrics (Json)`. Replaced with a single `impactSummary` free-text field (e.g. "640 ha mangrove restored") — matches what the mock actually displays, avoids building unused money-tracking or a JSON shape nothing renders specially yet.
- **Participant counting**: no denormalized `participantCount` column — `_count: { participants: true }` computed at query time via the `RestorationParticipant` join table instead, so a repeat "join" click can never inflate a stored counter. The unique constraint makes `join()` naturally idempotent: a second join attempt catches Prisma's `P2002` and is a silent no-op rather than an error.
- `apps/api/src/restoration/` — new module, wasn't even wired into `AppModule` before this (unlike `observations`/`biodiversity`, which had empty stub modules already registered). `@Public() GET /restoration/projects` (filterable by category/status/districtId), `@Public() GET /restoration/projects/:id`, `@Roles('ORGANIZATION_ADMIN','ADMIN') POST /restoration/projects`, `PATCH /restoration/projects/:id` (any authenticated user at the guard layer — ownership checked inside the service: creator or `ADMIN` only, everyone else gets 403), `POST /restoration/projects/:id/join` (any authenticated user).
- **Known limitation, flagged rather than faked**: there's no `Organization`-membership link anywhere in the schema (no `User.organizationId`), so `ORGANIZATION_ADMIN` is enforced as a bare role, not "admin of *this specific* organization" — a real org-admin can attach any real organization from the dropdown to a new project. Building real org-membership was treated as out of scope for this pass.
- `packages/shared/src/index.ts` / `packages/contracts/src/index.ts` — added `RestorationCategory` to shared; added a full `RestorationProject` response type (with `_count.participants`, `organization`/`district` refs), `CreateRestorationProjectRequest`, `UpdateRestorationProjectRequest`, and `create`/`update` routes (`list`/`detail`/`join` already existed).
- `apps/web/app/restoration/page.tsx` — replaces the honest-empty-state page with a real project list (category filter, org/district/status/participant columns) and **two distinct authenticated actions**, unlike every other submission form built this session: a project-registration form shown only to `ORGANIZATION_ADMIN`/`ADMIN`, and a "Join" button shown to every other logged-in user. Kept intentionally simple — no per-row "already joined" indicator, since that would need an extra membership lookup per project; the Join action is a plain idempotent button, not a toggle. Also consolidated the table to the existing 4-column `.table-row` grid CSS (shared by every other table in the app) rather than adding a new 6-column CSS variant for this one page.
- `apps/web/lib/restoration-actions.ts` — new `createRestorationProjectAction`/`joinRestorationProjectAction` Server Actions.

Verified live: a plain citizen blocked from `POST /restoration/projects` (403) → bootstrapped an `ORGANIZATION_ADMIN` + a real `Organization`, created a project with a real organization and district → citizen joined (idempotent — a second join left the participant count at 1, confirmed via both curl and a browser click) → a non-owner, non-admin blocked from `PATCH /:id` (403) → the creator successfully updated status to `ACTIVE` → all three audit events (`RESTORATION_PROJECT_CREATE`/`_JOIN`/`_UPDATE`) recorded correctly. Both UI states confirmed live in the browser: the citizen sees the project list with a "Join" button and no creation form; the org-admin sees the registration form (with real Organization/District dropdowns) and no Join button. Both `apps/api`/`apps/web` builds are clean. Test users, test organization, test project, and dev servers cleaned up afterward.

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

- `packages/shared/src/index.ts` — 29 exported types and interfaces (added `RestorationCategory` 2026-08-19). Enum values corrected to uppercase 2026-08-17 to match Prisma (see "Critical RBAC Fix" above) — this file is the source of the casing that must always match the database.
- `packages/contracts/src/index.ts` — route map (incl. `weather`), response entity types (`Dataset`, `CitizenReport`, `Alert`, `Provider`, `CurrentWeatherReading`, `HourlyAirQualityReading`), request types (incl. refresh/logout), envelopes

### Database

- `packages/database/prisma/schema.prisma` — full domain schema (14 enums, 21 models, incl. `Observation` (2026-08-17) and `RestorationProject`/`RestorationParticipant` (2026-08-19))

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
- `observations/` — list (public), get, create, `PATCH :id/trust` (RESEARCHER/ADMIN), audit log, DTOs — built 2026-08-17, see "Observations Module" above
- `restoration/` — list (public), get, create (ORGANIZATION_ADMIN/ADMIN), update (owner/ADMIN), join (idempotent), audit log, DTOs — built 2026-08-19, see "Restoration Projects Module" above
- `weather/` — OpenMeteo client, service, scheduler, controller (current/hourly/daily/air-quality)

### Web frontend (`apps/web/`)

- `app/globals.css` — full public-page CSS design system + auth form styles + app-shell/sidebar/profile-hero styles (ported from the mock)
- `app/layout.tsx` — bare root layout: Inter font via next/font/google, no shell markup (moved to the `(public)` group below)
- `app/(public)/layout.tsx` — owns `<PublicNav />` + the `public-shell` wrapper for `/`, `/login`, `/register`
- `app/(public)/page.tsx` — composes all 8 public sections (route group; still resolves to `/`)
- `app/(public)/login/page.tsx`, `app/(public)/register/page.tsx` — Server Action forms, no client JS
- `app/profile/page.tsx` — protected route, outside the `(public)` group so it doesn't get the top nav; sidebar app-shell + real user data + honest empty-state activity feed (see "Profile Page Mockup Fidelity" above)
- `app/data/page.tsx`, `app/reports/page.tsx`, `app/alerts/page.tsx` — real data on the sidebar app-shell (see "App-Shell Pages: Data, Reports, Alerts" above); `/reports` also has a real, working submission form as of 2026-08-17 (see "Report Submission Form" above)
- `app/observations/page.tsx` — real data + a working submission form as of 2026-08-17 (see "Observations Module" above); `app/restoration/page.tsx` — real data + a creation form (org-admins/admins) and a Join action (everyone else) as of 2026-08-19 (see "Restoration Projects Module" above); `app/biodiversity/page.tsx`, `app/community/page.tsx` — still honest empty-state pages, no backend for either yet (see "App-Shell Pages: Observations, Biodiversity, Restoration, Community" above). **Milestone 15 complete — all 7 app-shell pages built.**
- `lib/report-actions.ts` — `submitReportAction` Server Action, posts to `POST /reports` with the caller's access token
- `lib/observation-actions.ts` — `submitObservationAction` Server Action, posts to `POST /observations` with the caller's access token
- `lib/restoration-actions.ts` — `createRestorationProjectAction`/`joinRestorationProjectAction` Server Actions
- `lib/static-data.ts` — typed seed data with migration guide (still used as-is by every component except `map-section.tsx`, which now uses it only as a fallback); `ALERTS`' severity values corrected to uppercase 2026-08-17
- `lib/api.ts` — server-side fetch helpers: `apiGet` (cached, weather/datasets/reports/alerts), `apiGetAuthed`/`apiPost`/`apiPostAuthed` (never cached, auth + mutations); shared `extractErrorMessage` correctly unwraps NestJS's `string[]` validation error format (fixed 2026-08-17)
- `lib/format.ts` — `titleCase()`/`relativeTime()` display helpers, shared by the new app-shell pages
- `lib/session-constants.ts`, `lib/session.ts`, `lib/current-user.ts` — cookie names, cookie set/clear, `getCurrentUser()`
- `lib/auth-actions.ts` — `loginAction`, `registerAction`, `logoutAction`
- `middleware.ts` — route protection (`/profile`) + proactive access-token refresh at the edge
- `.env.example` / `.env.local` — `API_URL` for the backend
- `components/public-nav.tsx` — async and session-aware (see "Public Auth Flow Wiring" above)
- `components/app-sidebar.tsx` — reusable sidebar shell, now used by all 8 app-shell routes: `/profile`, `/data`, `/reports`, `/alerts`, `/observations`, `/biodiversity`, `/restoration`, `/community`
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
9. **M5 partial:** District lat/lng ✓, auth refresh/logout ✓ (2026-08-16, Postgres-backed, not Redis — see "Auth Refresh/Logout" above), and `RestorationProject`/`RestorationParticipant` ✓ (2026-08-19, built as part of M11 — see "Restoration Projects Module" above). Still pending: `ReportMedia`, `ReportComment` models.
10. ~~**M6:** Implement OpenMeteo ingestion — weather + air quality.~~ Done (2026-08-16), with a redesigned scope: self-contained `weather` module (not the generic `ingestion` module originally planned), no `ApiCallLog`/`IngestionJob` wiring. See `docs/ingestion-plan.md` and `docs/implementation-plan.md` for the design-deviation notes.
11. **M13 in progress:** Homepage weather sidebar (2026-08-16), full auth flow (2026-08-16), `/profile` rebuilt to match its mockup with a reusable sidebar app-shell (2026-08-17), citizen report submission wired to `POST /reports` (2026-08-17), and ~~observation submission~~ done (2026-08-17) — see "Public Weather Wiring", "Public Auth Flow Wiring", "Profile Page Mockup Fidelity", "Report Submission Form", and "Observations Module" above. Still not started: live platform metrics, every other homepage component still static.
12. ~~**M15:** Build all 7 app-shell pages.~~ Done (2026-08-17) — `/data`, `/reports`, `/alerts` with real backend data, `/observations`, `/biodiversity`, `/restoration`, `/community` with honest empty states — see "App-Shell Pages: Data, Reports, Alerts" and "App-Shell Pages: Observations, Biodiversity, Restoration, Community" above. Also fixed along the way: a critical RBAC casing bug that had every role-gated endpoint rejecting all users — see "Critical RBAC Fix" above — and a second bug where `districtId` validators required a UUID but the schema uses CUIDs — see "Report Submission Form" above.
13. ~~**M9:** Observations module — schema, endpoints, trust-level workflow.~~ Done (2026-08-17) — see "Observations Module" above. `/observations` upgraded from an honest empty state to real data + a working submission form.
14. ~~**M11:** Restoration Projects — schema, endpoints, ownership + join workflow.~~ Done (2026-08-19) — see "Restoration Projects Module" above. `/restoration` upgraded from an honest empty state to real data + a creation form (org-admins/admins) + a Join action (everyone else). Also lands the last of M5's three deferred models.
15. **Next up:** Live platform metrics on the homepage (rest of M13), WAQI integration (M14) for station-level AQI, ingestion observability (job tracking before a 2nd provider), M10 (Biodiversity + GBIF, unblocks `/biodiversity`), or resume M5's remaining schema items (ReportMedia, ReportComment — the last two now that RestorationProject is done).

## Open Questions

- ~~District lat/lng centroids: load from open-nature-backend2 CSVs or hardcode divisional capitals first?~~ Resolved — loaded from `open-nature`'s district CSV (all 64 districts, not just divisional capitals).
- WAQI API key: register at aqicn.org for dev/staging?
- Weather data retention policy: how long to keep raw hourly/daily rows? No aggregation tables were built, so this is now more pressing than originally scoped.
- Should a generic `ApiCallLog`/audit trail be added for external ingestion calls, or is per-request logging via the NestJS `Logger` sufficient? Currently skipped by deliberate decision for the weather module.
- "Log out all devices" / view active sessions — `RefreshToken` has `deviceId`, so a per-device session list and bulk-revoke endpoint are straightforward to add later; deliberately out of scope for the initial refresh/logout pass.
- Role-aware nav beyond guest-vs-logged-in (moderator/admin nav, role-specific CTAs) — deliberately out of scope for the frontend auth wiring pass; current nav only distinguishes guest from any authenticated user.
- Eco score, badges, and a user-facing activity feed (all shown in the `profile.html` mock) have no backing data model at all — is this product direction still wanted? If so it needs real scoping (a badge/achievement system, an activity log exposed per-user, a scoring formula), not just a UI pass. Currently omitted from `/profile` rather than faked.
- ~~No milestone currently covers building `/data`, `/observations`, `/reports`, `/alerts`, `/biodiversity`, `/restoration`, `/community` as real `apps/web` routes.~~ Resolved — **Milestone 15** in `implementation-plan.md`, now fully done: `/data`, `/reports`, `/alerts`, `/observations` (2026-08-17), and `/restoration` (2026-08-19) wired to real backends; `/biodiversity`, `/community` still shipped with honest empty states, to be revisited once their respective backend milestones (M10, and a not-yet-planned Community module) ship.
- ~~Who should be allowed to promote an observation's trust level — RESEARCHER/ADMIN only, or also MODERATOR?~~ Resolved (2026-08-17) — RESEARCHER/ADMIN only, matching the original M9 plan exactly. Trust validation is treated as a distinct domain-expertise judgment from a moderator's report-review role.
- ~~Should the original M5 `fundingGoal`/`fundingRaised`/`impactMetrics (Json)` fields be built for `RestorationProject`, or simplified?~~ Resolved (2026-08-19) — simplified to a single `impactSummary` free-text field. No funding-tracking feature is scoped yet, and the mock itself never shows fundraising figures.
- There's no `Organization`-membership link in the schema (no `User.organizationId`), so `RestorationProject` creation checks `ORGANIZATION_ADMIN` as a bare role rather than "admin of this specific organization" — any org-admin can attach any real organization to a new project. Worth a real membership model if organization-scoped permissions become a product requirement.
- No automated test currently guards against the RBAC casing bug recurring (e.g. a future `@Roles(...)` call site or a new shared enum drifting back to lowercase). Worth an integration test that actually logs in per role and hits each role-gated endpoint, rather than relying on TypeScript to catch it by luck the way it did this time.
- Same class of gap for the CUID/UUID bug found 2026-08-17: nothing currently guards against a future optional ID field being decorated `@IsUUID()` instead of `@IsString()`. A quick grep-based check (`@IsUUID()` should not appear anywhere in `apps/api` given this schema never generates real UUIDs) would catch it cheaply without a full integration test.
- Should government users publish alerts directly, or must alerts always go through moderator/admin approval?
- PostGIS `geography` fields: replace lat/lng Float when polygon queries needed (deferred to Phase 3).

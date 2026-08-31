# Roadmap

Nature Grid is built public-first toward a serious environmental intelligence platform. Dates are intentionally omitted until team capacity and release targets are known.

## Phase 0: Product and Architecture Baseline

Status: **Done**

Goal: Define the product shape, access model, domain boundaries, and reviewable UI direction before deep implementation.

Deliverables:

- Monorepo scaffold ✓
- Public-first product docs ✓
- Role and access model ✓
- Backend API catalog ✓
- Business logic and flows ✓
- Frontend static mocks (all 11 pages) ✓
- Initial app/package skeletons ✓

Exit criteria met:

- Docs explain what is public, login-gated, and role-gated.
- Mocks show the public single-page board and all major feature pages.
- Backend module direction is clear enough for implementation.

## Phase 1: Public Web Foundation

Status: **Done**

Goal: Build the public `/` page as a useful environmental board without login.

Deliverables:

- Public home page ✓
- Public metrics section ✓
- Public map preview layout ✓
- Public alerts preview ✓
- Verified reports preview ✓
- Dataset summary preview ✓
- Biodiversity/restoration/community highlights ✓
- Responsive navigation ✓

Exit criteria met:

- The public page is usable without authentication.
- Login CTAs are only shown for contribution, download, and advanced workflows.
- Layout is responsive across desktop and tablet.

## Phase 2: Backend Foundation

Status: **Done**

Goal: Implement stable backend primitives before broad feature work.

Deliverables:

- Auth and JWT token flow (register, login, profile, refresh with rotation, logout) ✓
- Users and role management ✓
- Organizations baseline ✓
- Geography — all 8 Bangladesh divisions, 64 districts, auto-seeded ✓
- Provider/provenance baseline ✓
- Dataset catalog with access policy ✓
- Evidence and audit primitives (AuditEvent on all write flows) ✓
- Shared type contracts (`packages/shared`, `packages/contracts`) ✓
- Global validation pipe and guard infrastructure ✓ — shipped with two bugs, both fixed 2026-08-17: a casing bug that made role checks always fail (see below), and a `districtId` validator on `CreateReportDto`/`CreateAlertDto` that required a UUID when this schema only ever generates CUIDs, rejecting any submission that specified a real district — see `docs/progress.md` "Report Submission Form".

Exit criteria met:

- Public read APIs exist for locations, dataset summaries, verified reports, and active alerts.
- Authenticated APIs exist for report and alert contribution.
- ~~Moderator/admin permissions are enforced for status change flows.~~ This was **not actually true** until 2026-08-17 — a `@nature-grid/shared` enum-casing bug made every role check fail, so moderator/admin permissions rejected everyone rather than enforcing anything. Genuinely true now; see `docs/progress.md` "Critical RBAC Fix".

Remaining gaps (carry into Phase 3):

- ~~Auth refresh/logout needs Redis token store~~ Done (2026-08-16) — Postgres-backed `RefreshToken` model with rotation, not Redis; see `docs/progress.md` "Auth Refresh/Logout".
- ~~`lat/lng Float` should be replaced with PostGIS `geography` type~~ Partially done (2026-09-01) — `District.geom geography(Point, 4326)` added by migration `20260901000000_postgis_geometry`. Polygon geometry (boundaries, alert zones, water bodies) still planned.
- ~~Prisma migration and seed not yet run (no live database)~~ Stale — migrations have run and the database has been live since M4.
- ~~Role-gated endpoints reject every user due to an enum-casing bug~~ Done (2026-08-17) — see `docs/progress.md` "Critical RBAC Fix". Open follow-up: no automated regression test guards against this recurring.

## Phase 3: Environmental Core

Status: In Progress — auth refresh/logout done (backend + frontend); citizen report and observation submission both now work end to end; all 7 app-shell pages built (Milestone 15 complete, 2026-08-17); Observations (M9), Restoration Projects (M11), and Biodiversity + GBIF (M10) modules all done (2026-08-17 through 2026-08-19) — 6 of 7 app-shell pages now show real data, only `/community` remains an honest empty state; Milestone 13 (Frontend Data Integration) is now fully complete (2026-08-19) — every homepage section is either live or an honest empty state; Report enrichment (M5/M8) done (2026-08-22) — `ReportComment` + `ReportMedia` schema and 4 new API endpoints; Admin Console (M12) done (2026-08-22) — full `apps/admin` console with report moderation, user management, alert management, dataset management

Goal: Add the primary environmental workflows and connect the frontend to real backend data.

Deliverables:

- ~~Observations module (schema in place; service/controller needed)~~ Done (2026-08-17) — full CRUD + trust-level workflow (`RESEARCHER`/`ADMIN` promote `UNVERIFIED` → `RESEARCH_GRADE`/etc.), wired to a real `/observations` page with a working submission form. See `docs/progress.md` "Observations Module".
- ~~Restoration projects module~~ Done (2026-08-19) — full CRUD, `ORGANIZATION_ADMIN`/`ADMIN`-gated creation, ownership-gated updates, idempotent citizen "join," wired to a real `/restoration` page. See `docs/progress.md` "Restoration Projects Module". (Not separately tracked as a Phase 3 deliverable before this — added here now that it's done.)
- ~~Biodiversity records~~ Done (2026-08-19) — daily GBIF sync (self-contained in `apps/api/src/biodiversity/`, not the generic `ingestion` module, same design deviation as weather), public species/occurrence endpoints, wired to a real `/biodiversity` page with name search. IUCN conservation-status enrichment deliberately skipped for v1 (no per-species API call built yet). See `docs/progress.md` "Biodiversity + GBIF Module". Community sidebar nav link removed (2026-08-24) — `/community` page remains but is no longer reachable via navigation.
- ~~Media/evidence records~~ Done — `ReportComment` and `ReportMedia` schema + `POST/GET /reports/:id/comments` and `POST/GET /reports/:id/media` endpoints live (2026-08-22). File upload transport now handled by the `media` module (`POST /media/upload`, `POST /media/presign`) using S3/MinIO (2026-08-29). Nested comment replies deliberately deferred. See M8 in `implementation-plan.md`.
- ~~Moderation queue~~ Done (2026-08-22) — admin console report moderation queue (`apps/admin`) with full 5-status workflow. See M12 in `implementation-plan.md`.
- Dataset download and access-request endpoints
- ~~Connect public web page to live API (replace static seed data)~~ Done (2026-08-19) — every homepage section now fetches live data with a fallback to static content if the API is unreachable: weather sidebar (2026-08-16), metrics cards (2026-08-19), dataset preview/reports/alerts previews/biodiversity+restoration highlights (2026-08-19); the community feed has no backend to wire to, so it shows an honest empty state instead (same treatment as the `/community` page). Nav is session-aware (real login state, 2026-08-16). See `docs/progress.md` "Homepage Preview Sections Wired" — a real honesty bug (treating an empty-but-successful response the same as an API failure) was caught and fixed during this pass.
- ~~Auth refresh / logout with Redis token store~~ Done (2026-08-16) — Postgres-backed, not Redis (see Phase 2 note above). Frontend login/register/logout flow also wired (2026-08-16): httpOnly cookie sessions, middleware-based route protection + token refresh, new `/login`/`/register`/`/profile` routes. `/profile` rebuilt (2026-08-17) to match its mockup's sidebar app-shell design, with honest empty states instead of the mock's fabricated eco score/badges/activity feed — this also established a reusable sidebar shell (`AppSidebar`). ~~Build `/data`, `/observations`, `/reports`, `/alerts`, `/biodiversity`, `/restoration`, `/community` as real routes (Milestone 15).~~ Done (2026-08-17) — `/data`, `/reports`, `/alerts` wired to real backend data (see `docs/progress.md` "App-Shell Pages: Data, Reports, Alerts"), `/reports` also gained a real submission form (see "Report Submission Form"), and `/observations`, `/biodiversity`, `/restoration`, `/community` shipped with honest empty states since none of them had a backend yet (see "App-Shell Pages: Observations, Biodiversity, Restoration, Community"). `/observations`, `/restoration`, and `/biodiversity` have since been upgraded to real data as their backends shipped (M9 2026-08-17, M11 and M10 both 2026-08-19); only `/community` remains an honest empty state.
- ~~PostGIS geography fields~~ Partially done (2026-09-01) — point geometry on `District`. Polygon geometry still needed.

Exit criteria:

- ~~Citizens can submit reports and observations after login.~~ Done (2026-08-17) — both `POST /reports` (via `/reports`) and `POST /observations` (via `/observations`) work end to end, verified live with real submissions.
- Public users see only verified/publishable data from the live API.
- Moderators/admins can review and update status. — Also **not actually true** until 2026-08-17 for the same RBAC casing bug (see Phase 2 note); confirmed genuinely working now via `PATCH /reports/:id/status` and `PATCH /alerts/:id`.
- Advanced dataset access is gated correctly.

## Phase 4: Data and Ingestion

Status: Largely done — job lifecycle and dataset access both landed 2026-08-24; `ApiCallLog` and Python data-worker remain deferred.

Goal: Bring real environmental data into the platform.

Deliverables:

- OpenMeteo ingestion job ✓ (2026-08-16 — weather + air quality, see `docs/progress.md` "Weather Ingestion"; scope was redesigned from the original ingestion-plan, notably without job lifecycle or response logging — see below)
- ~~Ingestion job lifecycle (queue, track, retry, audit)~~ ✓ Done (2026-08-24) — `IngestionService` + `IngestionController` implemented; weather and GBIF schedulers write `IngestionJob` records per run; `Dataset.lastSyncedAt` updated on success. No retry queue (cron re-runs serve as retry). See `docs/progress.md` "Ingestion Module + Dataset Access".
- Provider response logging — not done; deliberately skipped, no `ApiCallLog` model was built
- Dataset version/distribution records
- Weather and air quality summaries populated from ingestion ✓ (`GET /datasets/weather/current`, `GET /datasets/air-quality/current` now return live data)
- Python data-worker baseline for GIS/scientific processing

Exit criteria:

- Ingestion jobs can be queued, tracked, retried, and audited. — **Partially met** (2026-08-24). Jobs are tracked (RUNNING → SUCCEEDED/FAILED) and auditable via `GET /ingestion/jobs`. No explicit retry queue — scheduled crons serve as periodic retry. `ApiCallLog` per-HTTP-call logging still not built.
- Public dataset summaries use real backend records. ✓ — weather/AQ summaries are live; other dataset categories still static.
- Data lineage is stored for imported/derived datasets. — Not yet; would need the response-logging deliverable above.

## Phase 5: Advanced Domains

Status: Largely done — biodiversity, restoration, notifications, and role-scoped analytics all shipped. Community campaigns and environmental event/hazard history remain planned.

Goal: Add richer product areas after the core is stable.

Deliverables:

- ~~Biodiversity taxonomy and occurrence model~~ Done (2026-08-19) — GBIF daily sync, species/occurrence endpoints, data hub preview.
- ~~Restoration/project domain~~ Done (2026-08-19) — CRUD, ownership-gated updates, idempotent join workflow.
- Community posts, comments, and polls — *Planned*. Schema: `CommunityPost` (title, body, author, optional districtId), `PostComment` (flat, no nesting), `Poll` (1:1 with post, optional endsAt), `PollOption`, `PollVote` (unique per user per poll). API: `GET/POST /community/posts`, `GET /community/posts/:id`, `DELETE /community/posts/:id`, `POST /community/posts/:id/comments`, `DELETE /community/posts/:id/comments/:commentId`, `POST /community/posts/:id/poll/vote`. Frontend: replaces the `/community` honest-empty-state with a real post list, create form (title + body + optional poll block), and post detail with inline comments and poll voting.
- ~~Notification subscriptions~~ Done (2026-08-22) — `AlertSubscription` + email delivery via Nodemailer.
- Environmental event/hazard history — *Planned*.
- ~~Researcher and government role-scoped workflows~~ Done — analytics endpoints for government/researcher/orgadmin.

Exit criteria:

- Nature Grid can connect evidence, measurements, reports, alerts, projects, and outcomes.
- Advanced domains remain modular and do not overload generic observations.

## Phase 6: Production Hardening

Status: Done — 6a security (2026-08-21), 6b test suite + CI + API contract enforcement (2026-08-21/22), 6c notification delivery (2026-08-22), 6d Dockerfiles (2026-08-22). Remaining: end-to-end tests, accessibility pass.

Goal: Prepare the system for real users and operational trust.

Ordered roughly by risk: the security items are cheap and block any real deployment, the test/CI items protect the 60% already built, and notification delivery closes the one gap that undermines a shipped feature.

### 6a. Security must-fixes — Done (2026-08-21)

- ~~**Fail fast on a missing `JWT_SECRET`.**~~ Done (2026-08-21). `common/env.validation.ts` is wired into `ConfigModule.forRoot({ validate })`; both call sites now use `getOrThrow`, so no fallback exists. Rejects missing, empty, whitespace-only, known placeholders, and anything under 32 characters, and `JWT_SECRET` is documented in `.env.example`.
- ~~**Add `helmet`.**~~ Done (2026-08-21). `helmet` installed and called in `main.ts` before routing, so every response — including error responses — carries security headers.
- ~~**Add rate limiting (`@nestjs/throttler`).**~~ Done (2026-08-21). `ThrottlerModule` registered globally at 120 req/60 s baseline. Auth routes tightened via `@Throttle`: `/auth/login` and `/auth/register` at 5 req/60 s (brute-force surface), `/auth/refresh` at 20 req/60 s (legitimate clients refresh every ~15 min). `ThrottlerGuard` registered via `APP_GUARD` in `AppModule` so it receives DI.
- ~~**Audit failed logins.**~~ Done (2026-08-21). `AuditAction.USER_LOGIN_FAILED` added via additive migration `20260820200435_add_user_login_failed_audit_action`. `AuthService.recordFailedLogin()` writes the event before throwing — fires on unknown email (no `userId`, email in meta) and on bad password / deactivated account (real `userId`, reason in meta). Five regression tests added to `auth.service.spec.ts` covering all three failure branches, caller-IP capture, and the invariant that `USER_LOGIN` is never written on a failed attempt.

### 6b. Regression safety net

- ~~First test suite covering `auth` and RBAC.~~ Done (2026-08-21). 52 tests across `RolesGuard`, `JwtAuthGuard`, `AuthService`, the refresh-token utilities and env validation. Fully mocked — no database needed. Each historical bug has a named regression test, and all six were mutation-checked: reintroducing the bug makes the suite fail. Expanded to 153 tests in 11 spec files (2026-08-29) — reports, observations, restoration, notifications, gamification, media service coverage added.
- ~~CI on pull requests.~~ Done (2026-08-21); updated (2026-08-29) to add `pnpm audit --prod --audit-level=high` in the `verify` job and a parallel `docker-build` job (`docker build -f apps/api/Dockerfile`). Note the repo has no git remote yet, so nothing runs until one is added.
- ~~Install a working lint setup.~~ Done (2026-08-21). `.eslintrc.json` added for `apps/api`, `apps/web`, and `apps/admin`. `pnpm lint` now runs cleanly across all three apps; added to local verification workflow but deliberately kept out of CI until the rule set is stable.
- ~~API contract tests.~~ Done (2026-08-22). `@nature-grid/contracts` added as a devDependency to `apps/api`. `src/common/contract-types.typecheck.ts` uses TypeScript's structural type system to assert that every service's return type (after JSON serialisation — `Date`→`string` via a `Jsonified<T>` utility) is assignable to its contract type. Checked by the existing `tsc --noEmit` step in CI. Also fixed `include`→`select` discipline in `datasets.service.ts`, `reports.service.ts` (`getById`), `alerts.service.ts` (`getById`), and four weather read methods — eliminating unintended field leakage (e.g. `createdAt` from weather readings not in the contract).
- End-to-end tests for the public and authenticated flows.
- Accessibility pass.

### 6c. Notification delivery — Done (2026-08-22)

- ~~Per-user contact details plus verification.~~ Done — reused the existing `User.email` (already verified via login). No separate `notifyEmail` field needed for v1.
- ~~Transport for at least one channel.~~ Done — Nodemailer SMTP email. Optional: API starts without SMTP configured (one-time warn, sends silently skipped).
- ~~Delivery on `ACTIVE` alert transitions.~~ Done — `AlertsService.create()` (always ACTIVE) and `AlertsService.update()` (DRAFT → ACTIVE) both fire `notificationsService.dispatchForAlert()`, which creates PENDING `NotificationDelivery` records and enqueues per-user jobs via the BullMQ `email` queue (4-attempt exponential backoff).
- ~~Delivery status recorded so a failed send is visible rather than silent.~~ Done — `NotificationDelivery` records written as `PENDING` before enqueue, updated to `SENT` or `FAILED` by the `EmailProcessor`.
- ~~The `Notification` subscription model.~~ Done — `AlertSubscription` with districtId (nullable = nationwide), minSeverity threshold, and channel.

See `docs/progress.md` "Phase 6c: Notification Delivery" for design decisions and implementation detail.

Remaining gap: no SMS channel (EMAIL only). Government agency and emergency broadcast integration is Phase 7.

### 6d. Operations

- ~~Dockerfile for `apps/api`, `apps/web`, `apps/admin`.~~ Done (2026-08-22) — multi-stage Dockerfiles for all three, standalone Next.js output, `prisma migrate deploy` entrypoint, `docker-compose.prod.yml` with healthcheck-gated startup. Bug fix (2026-08-24): admin service was missing `API_URL` in `docker-compose.prod.yml` — would have caused all admin API calls to silently fail in production.
- ~~Deployment documentation and a repeatable path.~~ Done (`infrastructure/docker/README.md`). Single-host compose only; multi-host deferred.
- Backup/restore plan. — Not done.
- Observability. Audit *writes* are complete; a dashboard over `AuditEvent` is still missing.
- ~~Secure file/media handling~~ Done (2026-08-29) — `media` module fully implemented with `StorageService`, `MediaService`, `POST /media/upload`, `POST /media/presign`.

Exit criteria:

- ~~No secret falls back to a hardcoded default.~~ **Met** (2026-08-21) — see 6a.
- ~~Auth and RBAC have automated test coverage, and CI runs on every PR.~~ **Met** (2026-08-21) — pending a git remote for CI to actually execute.
- ~~Brute-force attempts leave a visible audit trail.~~ **Met** (2026-08-21) — `USER_LOGIN_FAILED` written on every rejected login; see 6a.
- An `EMERGENCY` alert reaches a subscribed user, and a failed delivery is visible. — **Not met.** See 6c.
- Public and authenticated flows are tested. — **Partially met.** 153 unit tests across 11 spec files cover auth, RBAC, env validation, reports, observations, restoration, notifications, gamification, and media services. No end-to-end tests yet, and `apps/web`/`apps/admin` still have no tests.
- Sensitive actions are auditable. — **Met** (complete as of 2026-08-27). All 25 `AuditAction` values are written. Every implemented mutating endpoint audits.
- Deployment and operations are repeatable. — **Not met.** No container image or deployment path exists.

---

## Phase 7: Advanced Platform Domains

Status: In Progress — emissions tracking done (2026-08-28); satellite radiation and marine weather implemented as data-ingestion additions (2026-08-28, not originally scoped in Phase 7 but logically grouped here); remaining domains still planned.

Goal: Extend Nature Grid into the richer environmental science domains that the core platform was designed to support but that require deeper infrastructure, specialist data sources, or a larger user base before they pay off. Each domain here either has a clear data dependency on Phase 3–6 work, or requires specialist review before scoping.

Order is not fixed. Satellite ingestion is the most infrastructure-heavy and depends on PostGIS, media storage, and the Python data-worker all landing first, so it is likely last.

| Domain | What it adds | Status |
| --- | --- | --- |
| **Emissions tracking** | Source-level pollution measurement (factories, industrial sites, vehicles) — distinct from ambient readings in `HourlyAirQuality`. `PollutionSource` + `EmissionEntry` models, 3 enums, 2 permissions (`emissions.manage`, `emissions.report`), 6 endpoints. | **Done (2026-08-28)** |
| **Satellite radiation data** | Daily solar radiation totals, sunshine duration, and daylight duration for all 64 districts via OpenMeteo Satellite API. `SatelliteRadiationReading` model, `RadiationScheduler`. | **Done (2026-08-28)** |
| **Marine weather data** | Bay of Bengal wave/swell/wind-wave forecasts for coastal Bangladesh districts via OpenMeteo Marine API. `MarineForecast` model, `MarineScheduler`. | **Done (2026-08-28)** |
| **Industrial Facility Registry** | Searchable directory of factories, garment units, brick fields, tanneries, power plants, shipbreaking yards, and other industrial sites that have measurable environmental impact. Each facility carries type, compliance status, operator, and full geographic anchor (district → upazila → union → lat/lng/PostGIS). Integrates with the existing `PollutionSource`/`EmissionEntry` graph (a facility owns its emission sources), links to `CitizenReport` (incidents at that facility), and exposes a `GET /facilities/nearby` spatial search. Government/admin registers facilities; researchers and moderators can update compliance status; the public can browse and filter. Inspection records (date, outcome, inspector) are a v2 addition. | *Planned* |
| **Climate forecasting** | Platform-generated predictions (flood risk, drought early warning, heat index). Adds a model registry, prediction storage, and accuracy tracking — separate from the provider forecasts already in `HourlyWeatherForecast`/`DailyWeatherForecast`. | *Planned* — requires Python data-worker + ML pipeline |
| **Carbon accounting** | Per-user and per-organisation footprint entries with calculation methodology and offset tracking. `HourlyAirQuality.carbonMonoxide` is a pollutant measurement and unrelated to this feature. | *Planned* |
| **Research platform** | Publication records, authorship, citations, and institution linkage. Gives the `RESEARCHER` role a meaningful place to publish and cite findings from the platform's own data. | *Planned* |
| **Structured surveys** | Solicited, structured data collection campaigns. Distinct from `CitizenReport` (unsolicited incident reporting) and `Observation` (point-in-time measurements) — surveys target specific questions with a defined form schema and response lifecycle. | *Planned* |
| **Satellite / remote sensing** | Satellite imagery ingestion (NASA MODIS, Sentinel-2), change-detection analysis, and automated deforestation/flooding alerts. Fills the gap where `DEFORESTATION` and `FLOODING` report categories currently only have citizen-reported evidence. | *Planned* — requires PostGIS geometry fields, object storage, Python data-worker |

Exit criteria:

- Each domain has a schema, at least one public read endpoint, and one write endpoint before the phase closes.
- Satellite ingestion has a running proof-of-concept change-detection job on at least one district.
- Research publications are searchable and linkable to dataset records and observations.

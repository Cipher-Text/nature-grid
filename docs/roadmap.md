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
- `lat/lng Float` should be replaced with PostGIS `geography` type
- ~~Prisma migration and seed not yet run (no live database)~~ Stale — migrations have run and the database has been live since M4.
- ~~Role-gated endpoints reject every user due to an enum-casing bug~~ Done (2026-08-17) — see `docs/progress.md` "Critical RBAC Fix". Open follow-up: no automated regression test guards against this recurring.

## Phase 3: Environmental Core

Status: In Progress — auth refresh/logout done (backend + frontend); citizen report and observation submission both now work end to end; all 7 app-shell pages built (Milestone 15 complete, 2026-08-17); Observations (M9), Restoration Projects (M11), and Biodiversity + GBIF (M10) modules all done (2026-08-17 through 2026-08-19) — 6 of 7 app-shell pages now show real data, only `/community` remains an honest empty state; Milestone 13 (Frontend Data Integration) is now fully complete (2026-08-19) — every homepage section is either live or an honest empty state

Goal: Add the primary environmental workflows and connect the frontend to real backend data.

Deliverables:

- ~~Observations module (schema in place; service/controller needed)~~ Done (2026-08-17) — full CRUD + trust-level workflow (`RESEARCHER`/`ADMIN` promote `UNVERIFIED` → `RESEARCH_GRADE`/etc.), wired to a real `/observations` page with a working submission form. See `docs/progress.md` "Observations Module".
- ~~Restoration projects module~~ Done (2026-08-19) — full CRUD, `ORGANIZATION_ADMIN`/`ADMIN`-gated creation, ownership-gated updates, idempotent citizen "join," wired to a real `/restoration` page. See `docs/progress.md` "Restoration Projects Module". (Not separately tracked as a Phase 3 deliverable before this — added here now that it's done.)
- ~~Biodiversity records~~ Done (2026-08-19) — daily GBIF sync (self-contained in `apps/api/src/biodiversity/`, not the generic `ingestion` module, same design deviation as weather), public species/occurrence endpoints, wired to a real `/biodiversity` page with name search. IUCN conservation-status enrichment deliberately skipped for v1 (no per-species API call built yet). See `docs/progress.md` "Biodiversity + GBIF Module".
- Media/evidence records
- Moderation queue
- Dataset download and access-request endpoints
- ~~Connect public web page to live API (replace static seed data)~~ Done (2026-08-19) — every homepage section now fetches live data with a fallback to static content if the API is unreachable: weather sidebar (2026-08-16), metrics cards (2026-08-19), dataset preview/reports/alerts previews/biodiversity+restoration highlights (2026-08-19); the community feed has no backend to wire to, so it shows an honest empty state instead (same treatment as the `/community` page). Nav is session-aware (real login state, 2026-08-16). See `docs/progress.md` "Homepage Preview Sections Wired" — a real honesty bug (treating an empty-but-successful response the same as an API failure) was caught and fixed during this pass.
- ~~Auth refresh / logout with Redis token store~~ Done (2026-08-16) — Postgres-backed, not Redis (see Phase 2 note above). Frontend login/register/logout flow also wired (2026-08-16): httpOnly cookie sessions, middleware-based route protection + token refresh, new `/login`/`/register`/`/profile` routes. `/profile` rebuilt (2026-08-17) to match its mockup's sidebar app-shell design, with honest empty states instead of the mock's fabricated eco score/badges/activity feed — this also established a reusable sidebar shell (`AppSidebar`). ~~Build `/data`, `/observations`, `/reports`, `/alerts`, `/biodiversity`, `/restoration`, `/community` as real routes (Milestone 15).~~ Done (2026-08-17) — `/data`, `/reports`, `/alerts` wired to real backend data (see `docs/progress.md` "App-Shell Pages: Data, Reports, Alerts"), `/reports` also gained a real submission form (see "Report Submission Form"), and `/observations`, `/biodiversity`, `/restoration`, `/community` shipped with honest empty states since none of them had a backend yet (see "App-Shell Pages: Observations, Biodiversity, Restoration, Community"). `/observations`, `/restoration`, and `/biodiversity` have since been upgraded to real data as their backends shipped (M9 2026-08-17, M11 and M10 both 2026-08-19); only `/community` remains an honest empty state.
- PostGIS geography fields (requires PostGIS extension + migration)

Exit criteria:

- ~~Citizens can submit reports and observations after login.~~ Done (2026-08-17) — both `POST /reports` (via `/reports`) and `POST /observations` (via `/observations`) work end to end, verified live with real submissions.
- Public users see only verified/publishable data from the live API.
- Moderators/admins can review and update status. — Also **not actually true** until 2026-08-17 for the same RBAC casing bug (see Phase 2 note); confirmed genuinely working now via `PATCH /reports/:id/status` and `PATCH /alerts/:id`.
- Advanced dataset access is gated correctly.

## Phase 4: Data and Ingestion

Status: In Progress

Goal: Bring real environmental data into the platform.

Deliverables:

- OpenMeteo ingestion job ✓ (2026-08-16 — weather + air quality, see `docs/progress.md` "Weather Ingestion"; scope was redesigned from the original ingestion-plan, notably without job lifecycle or response logging — see below)
- Ingestion job lifecycle (queue, track, retry, audit) — not done; deliberately skipped for the weather module, `IngestionJob` model remains unused
- Provider response logging — not done; deliberately skipped, no `ApiCallLog` model was built
- Dataset version/distribution records
- Weather and air quality summaries populated from ingestion ✓ (`GET /datasets/weather/current`, `GET /datasets/air-quality/current` now return live data)
- Python data-worker baseline for GIS/scientific processing

Exit criteria:

- Ingestion jobs can be queued, tracked, retried, and audited. — **Not met.** Weather ingestion runs on a cron scheduler with per-district try/catch logging, but there is no job queue, retry tracking, or audit trail.
- Public dataset summaries use real backend records. ✓ — weather/AQ summaries are live; other dataset categories still static.
- Data lineage is stored for imported/derived datasets. — Not yet; would need the response-logging deliverable above.

## Phase 5: Advanced Domains

Status: Planned

Goal: Add richer product areas after the core is stable.

Deliverables:

- Biodiversity taxonomy and occurrence model
- Restoration/project domain
- Community campaigns and education resources
- Notification subscriptions
- Environmental event/hazard history
- Researcher and government workflows

Exit criteria:

- Nature Grid can connect evidence, measurements, reports, alerts, projects, and outcomes.
- Advanced domains remain modular and do not overload generic observations.

## Phase 6: Production Hardening

Status: Planned

Goal: Prepare the system for real users and operational trust.

Ordered roughly by risk: the security items are cheap and block any real deployment, the test/CI items protect the 60% already built, and notification delivery closes the one gap that undermines a shipped feature.

### 6a. Security must-fixes

- ~~**Fail fast on a missing `JWT_SECRET`.**~~ Done (2026-08-21). `common/env.validation.ts` is wired into `ConfigModule.forRoot({ validate })`; both call sites now use `getOrThrow`, so no fallback exists. Rejects missing, empty, whitespace-only, known placeholders, and anything under 32 characters, and `JWT_SECRET` is documented in `.env.example`.
- Add `helmet`.
- Add rate limiting (`@nestjs/throttler`), at minimum on `/auth/login`, `/auth/register`, and `/auth/refresh`.
- Audit failed logins. `AuditAction` has no `USER_LOGIN_FAILED` value, so brute-force attempts currently leave no trace. Needs an additive enum migration.

### 6b. Regression safety net

- ~~First test suite covering `auth` and RBAC.~~ Done (2026-08-21). 56 tests across `RolesGuard`, `JwtAuthGuard`, `AuthService`, the refresh-token utilities and env validation. Fully mocked — no database needed. Each historical bug has a named regression test, and all six were mutation-checked: reintroducing the bug makes the suite fail.
- ~~CI on pull requests.~~ Done (2026-08-21). `.github/workflows/ci.yml` runs `prisma generate`/`validate`, `tsc --noEmit` on all three apps, the api test suite, and `pnpm build`. Note the repo has no git remote yet, so nothing runs until one is added.
- Install a working lint setup. `apps/api`'s `lint` script invokes `eslint`, but no `eslint` binary is present, so `pnpm lint` cannot run there.
- API contract tests. `apps/api` does not import `@nature-grid/contracts`, so backend routes can drift from the contract the frontend relies on with nothing to catch it.
- End-to-end tests for the public and authenticated flows.
- Accessibility pass.

### 6c. Notification delivery

Pulled into this phase rather than treated as a new domain: `Alert` already has an `EMERGENCY` severity and the subscription model is planned, but there is no way to reach anyone. An alerting platform that cannot deliver alerts is not shippable.

- Per-user contact details plus verification (currently `User` holds only `email` for login).
- Transport for at least one channel — email or SMS.
- Delivery on `ACTIVE`/`EMERGENCY` alert transitions.
- Delivery status recorded so a failed send is visible rather than silent.
- The `Notification` subscription model itself (already planned in `architecture/data-model.md`).

Deliberately out of scope here: government agency and emergency broadcast integration (see Phase 7 sourcing).

### 6d. Operations

- Dockerfile for `apps/api`, `apps/web`, `apps/admin`. None exists; `infrastructure/{docker,nginx,terraform}` hold README placeholders only.
- Deployment documentation and a repeatable path.
- Backup/restore plan.
- Observability. Audit *writes* are complete as of 2026-08-20; a dashboard over `AuditEvent` is still missing.
- Secure file/media handling — blocked on the `media` module, still an empty stub.

Exit criteria:

- ~~No secret falls back to a hardcoded default.~~ **Met** (2026-08-21) — see 6a.
- ~~Auth and RBAC have automated test coverage, and CI runs on every PR.~~ **Met** (2026-08-21) — pending a git remote for CI to actually execute.
- An `EMERGENCY` alert reaches a subscribed user, and a failed delivery is visible.
- Public and authenticated flows are tested. — **Partially met.** Auth, RBAC and env validation have unit coverage (56 tests). No end-to-end or contract tests yet, and `apps/web`/`apps/admin` still have no tests.
- Sensitive actions are auditable. — **Met for everything built** (2026-08-20). 14 of 17 `AuditAction` values are written; every implemented mutating endpoint audits. The three unwritten `DATASET_*` values belong to endpoints that do not exist yet.
- Deployment and operations are repeatable. — **Not met.** No container image or deployment path exists.

---

## Phase 7: Deferred Open Nature Domains

Status: Planned

Goal: Absorb the environmental domains that the Open Nature repos designed but Nature Grid has not carried over, so the legacy repos can be archived without losing design intent.

These were previously tracked only as an uncommitted gap register, which was retired into this roadmap on 2026-08-20 once its contents were scheduled. Each entry names its source so the original design work can be recovered rather than redone. Order within the phase is not fixed; satellite ingestion is the largest and most infrastructure-heavy, so it is likely last.

| Domain | Source | What it needs |
| --- | --- | --- |
| Emissions data | `open-nature-backend` `emissions_data` | A measurement domain distinct from ambient air quality — emissions are measured at source. Complements the planned `PollutionSource` model, which identifies sources but stores no quantities. |
| Climate prediction | `open-nature-backend` `climate_predictions`, `prediction_models` | Model registry, prediction storage, accuracy tracking. Nature Grid stores OpenMeteo's *provider* forecasts but has no concept of a platform-generated prediction. Prerequisite for the ML flood forecasting in `NEW_PROJECT.md` module 18. |
| Carbon footprint | `open-nature-backend` `carbon_footprint_entries`; `NEW_PROJECT.md` module 23 | Per-user/org footprint entries, calculation method, offset accounting. Note `HourlyAirQuality.carbonMonoxide` is an air-quality pollutant and unrelated. |
| Research publications | `open-nature-backend` `research_publications`; `NEW_PROJECT.md` module 25 | Paper records, authorship, citations, institution linkage. `RESEARCHER` is a first-class role with nowhere to put its output today. |
| Climate surveys | `open-nature-backend/survey.md` | Structured, solicited data collection — distinct from `CitizenReport` (unsolicited) and `Observation` (measurements). A worked two-table design already exists. |
| Satellite / remote sensing | `NEW_PROJECT.md` modules 9–11 | Imagery ingestion (NASA/Sentinel) and change detection. Today `DEFORESTATION` is only ever citizen-reported, never satellite-detected. Needs object storage, a processing runtime (`apps/data-worker`), and geometry beyond point lat/lng — so it depends on PostGIS and media storage landing first. |

Exit criteria:

- Each domain either ships, or is explicitly rejected and recorded in "Accepted Divergences" in the gap register.
- The remaining register holds only smaller items, so `open-nature`, `open-nature-backend`, and `open-nature-backend2` can be archived.

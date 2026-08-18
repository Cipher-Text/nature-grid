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

Status: In Progress — auth refresh/logout done (backend + frontend); citizen report and observation submission both now work end to end; all 7 app-shell pages built (Milestone 15 complete); Observations module (M9) done (all 2026-08-17)

Goal: Add the primary environmental workflows and connect the frontend to real backend data.

Deliverables:

- ~~Observations module (schema in place; service/controller needed)~~ Done (2026-08-17) — full CRUD + trust-level workflow (`RESEARCHER`/`ADMIN` promote `UNVERIFIED` → `RESEARCH_GRADE`/etc.), wired to a real `/observations` page with a working submission form. See `docs/progress.md` "Observations Module".
- Media/evidence records
- Moderation queue
- Biodiversity records
- Dataset download and access-request endpoints
- Connect public web page to live API (replace static seed data) — partially done: the homepage's "Current conditions" sidebar now fetches live weather/AQ data (2026-08-16), with fallback to static data if the API is unreachable; the nav is now session-aware (real login state, 2026-08-16). Everything else on the public page (metrics, reports/alerts previews, biodiversity/restoration/community) is still static.
- ~~Auth refresh / logout with Redis token store~~ Done (2026-08-16) — Postgres-backed, not Redis (see Phase 2 note above). Frontend login/register/logout flow also wired (2026-08-16): httpOnly cookie sessions, middleware-based route protection + token refresh, new `/login`/`/register`/`/profile` routes. `/profile` rebuilt (2026-08-17) to match its mockup's sidebar app-shell design, with honest empty states instead of the mock's fabricated eco score/badges/activity feed — this also established a reusable sidebar shell (`AppSidebar`). ~~Build `/data`, `/observations`, `/reports`, `/alerts`, `/biodiversity`, `/restoration`, `/community` as real routes (Milestone 15).~~ Done (2026-08-17) — `/data`, `/reports`, `/alerts` wired to real backend data (see `docs/progress.md` "App-Shell Pages: Data, Reports, Alerts"), `/reports` also gained a real submission form (see "Report Submission Form"), and `/observations`, `/biodiversity`, `/restoration`, `/community` shipped with honest empty states since none of them has a backend yet (see "App-Shell Pages: Observations, Biodiversity, Restoration, Community").
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

Deliverables:

- End-to-end tests
- API contract tests
- Accessibility pass
- Observability and audit dashboards
- Rate limiting
- Secure file/media handling
- Backup/restore plan
- Deployment documentation

Exit criteria:

- Public and authenticated flows are tested.
- Sensitive actions are auditable.
- Deployment and operations are repeatable.

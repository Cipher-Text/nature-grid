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

- Auth and JWT token flow (register, login, profile) ✓
- Users and role management ✓
- Organizations baseline ✓
- Geography — all 8 Bangladesh divisions, 64 districts, auto-seeded ✓
- Provider/provenance baseline ✓
- Dataset catalog with access policy ✓
- Evidence and audit primitives (AuditEvent on all write flows) ✓
- Shared type contracts (`packages/shared`, `packages/contracts`) ✓
- Global validation pipe and guard infrastructure ✓

Exit criteria met:

- Public read APIs exist for locations, dataset summaries, verified reports, and active alerts.
- Authenticated APIs exist for report and alert contribution.
- Moderator/admin permissions are enforced for status change flows.

Remaining gaps (carry into Phase 3):

- Auth refresh/logout needs Redis token store
- `lat/lng Float` should be replaced with PostGIS `geography` type
- Prisma migration and seed not yet run (no live database)

## Phase 3: Environmental Core

Status: Planned

Goal: Add the primary environmental workflows and connect the frontend to real backend data.

Deliverables:

- Observations module (schema in place; service/controller needed)
- Media/evidence records
- Moderation queue
- Biodiversity records
- Dataset download and access-request endpoints
- Connect public web page to live API (replace static seed data)
- Auth refresh / logout with Redis token store
- PostGIS geography fields (requires PostGIS extension + migration)

Exit criteria:

- Citizens can submit reports and observations after login.
- Public users see only verified/publishable data from the live API.
- Moderators/admins can review and update status.
- Advanced dataset access is gated correctly.

## Phase 4: Data and Ingestion

Status: Planned

Goal: Bring real environmental data into the platform.

Deliverables:

- OpenMeteo ingestion job
- Ingestion job lifecycle (queue, track, retry, audit)
- Provider response logging
- Dataset version/distribution records
- Weather and air quality summaries populated from ingestion
- Python data-worker baseline for GIS/scientific processing

Exit criteria:

- Ingestion jobs can be queued, tracked, retried, and audited.
- Public dataset summaries use real backend records.
- Data lineage is stored for imported/derived datasets.

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

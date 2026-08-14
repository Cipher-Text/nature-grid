# Roadmap

This roadmap keeps Nature Grid public-first while building toward a serious environmental intelligence platform. Dates are intentionally omitted until team capacity and release targets are known.

## Phase 0: Product and Architecture Baseline

Status: In progress

Goal: Define the product shape, access model, domain boundaries, and reviewable UI direction before deep implementation.

Deliverables:

- Monorepo scaffold
- Public-first product docs
- Role and access model
- Backend API catalog
- Business logic and flows
- Frontend static mocks
- Initial app/package skeletons

Exit criteria:

- Docs explain what is public, login-gated, and role-gated.
- Mocks show the public single-page board and major feature pages.
- Backend module direction is clear enough for implementation.

## Phase 1: Public Web Foundation

Status: Planned

Goal: Build the public `/` page as a useful environmental board without login.

Deliverables:

- Public home page
- Public metrics sections
- Public map preview layout
- Public alerts preview
- Verified reports preview
- Dataset summary preview
- Biodiversity/restoration/community highlights
- Responsive navigation and mobile layout

Exit criteria:

- The public page is usable without authentication.
- Login CTAs are only shown for contribution, download, profile, and advanced workflows.
- Layout is responsive across desktop, tablet, and mobile.

## Phase 2: Backend Foundation

Status: Planned

Goal: Implement stable backend primitives before broad feature work.

Deliverables:

- Auth and session/token flow
- Users and roles
- Organizations and membership baseline
- Geography/PostGIS baseline
- Provider/provenance baseline
- Dataset catalog baseline
- Evidence and audit primitives

Exit criteria:

- Public read APIs exist for locations, dataset summaries, verified reports, verified observations, and alerts.
- Authenticated APIs exist for contribution flows.
- Admin/moderator permissions are enforced for review flows.

## Phase 3: Environmental Core

Status: Planned

Goal: Add the primary environmental workflows.

Deliverables:

- Citizen reports
- Observations
- Environmental monitoring primitives
- Alerts
- Dataset access policies
- Dataset downloads and access requests
- Media evidence
- Moderation queue

Exit criteria:

- Citizen can submit reports and observations after login.
- Public users only see verified/publishable data.
- Moderator/admin can review and update status.
- Advanced dataset access is gated correctly.

## Phase 4: Data and Ingestion

Status: Planned

Goal: Bring real environmental data into the platform.

Deliverables:

- OpenMeteo ingestion
- Ingestion job lifecycle
- Provider response logging
- Dataset version/distribution records
- Weather and air quality summaries
- Python data-worker baseline for GIS/scientific processing

Exit criteria:

- Ingestion jobs can be queued, tracked, retried, and audited.
- Public dataset summaries use real or seeded backend records.
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
- Researcher/government workflows

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


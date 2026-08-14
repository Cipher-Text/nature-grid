# Implementation Plan

This plan defines the recommended build order. It is intentionally more concrete than the roadmap.

## Principle

Do not start by building every feature page. Start with the public page, shared contracts, and backend primitives that many features need.

## Milestone 1: Frontend Public Page

Target app: `apps/web`

Tasks:

1. Set up production frontend structure.
2. Add shared theme tokens.
3. Build responsive public navigation.
4. Build public hero and access model section.
5. Build dashboard metrics.
6. Build public map preview component.
7. Build alert/report/dataset/biodiversity/restoration/community preview sections.
8. Add mobile/tablet responsive states.

Definition of done:

- `/` works without login.
- No feature requires fake auth on the public page.
- CTA copy clearly separates public browse from login-required actions.

## Milestone 2: Shared Types and Contracts

Target packages:

- `packages/shared`
- `packages/contracts`

Tasks:

1. Define shared enums for roles, statuses, severity, dataset category, provider type.
2. Define DTO schemas for public summaries.
3. Define route contract helpers.
4. Add contract rule: frontend does not call undocumented backend routes.

Definition of done:

- Public page data shapes are represented in shared contracts.
- Backend and frontend use the same route definitions or generated contract types.

## Milestone 3: Backend Foundation

Target app: `apps/api`

Tasks:

1. Implement health endpoint.
2. Implement auth baseline.
3. Implement user role model.
4. Implement organization baseline.
5. Implement geography baseline.
6. Implement provider/provenance baseline.
7. Implement dataset catalog baseline.
8. Implement audit event baseline.

Definition of done:

- API has real persistence for core entities.
- Public read endpoints are unauthenticated.
- Write/moderation/admin endpoints are protected.

## Milestone 4: Database Foundation

Target package: `packages/database`

Tasks:

1. Replace placeholder Prisma schema with accepted domain v2 model.
2. Add migrations.
3. Add seed data for Bangladesh administrative locations.
4. Add seed providers.
5. Add seed public dataset summaries.

Definition of done:

- Local database can be created from migrations.
- Public web page can use seeded backend data.

## Milestone 5: Reports and Evidence

Target modules:

- `reports`
- `media`
- `audit`
- `moderation`

Tasks:

1. Implement report submission.
2. Implement media/evidence records.
3. Implement report status workflow.
4. Implement moderation queue.
5. Write audit entries for review actions.

Definition of done:

- Logged-in users can submit reports.
- Public users see only verified/publishable reports.
- Moderators/admins can review status changes.

## Milestone 6: Dataset Access and Downloads

Target modules:

- `datasets`
- `providers`
- `audit`

Tasks:

1. Implement public dataset summaries.
2. Implement dataset detail with access policy.
3. Implement download endpoint.
4. Implement access request endpoint.
5. Implement contribution endpoint for approved users.

Definition of done:

- Guests see summaries.
- Logged-in/approved users can download or request access.
- Dataset contribution is role-gated.

## Milestone 7: Environmental Monitoring

Target module: `monitoring`

Tasks:

1. Add station model.
2. Add sensor model.
3. Add observed property model.
4. Add unit model.
5. Add measurement/datastream model.
6. Add quality flags.

Definition of done:

- Measurements are not stored as generic observations.
- Dataset and ingestion modules can reference measurements.

## Milestone 8: Alerts and Events

Target modules:

- `events`
- `alerts`
- `notifications` later

Tasks:

1. Add environmental/hazard event model.
2. Link alerts to events.
3. Add alert severity, urgency, certainty, affected area, instructions, expiry.
4. Add publish/cancel workflow.
5. Add audit entries.

Definition of done:

- Alerts are operational and auditable.
- Events can group alerts, reports, observations, measurements, and media.

## Milestone 9: Data Worker

Target app: `apps/data-worker`

Tasks:

1. Add Python worker command structure.
2. Add job polling or queue integration.
3. Add GIS validation utilities.
4. Add import pipeline for geospatial files.
5. Add derived summary job example.

Definition of done:

- A processing job can be created, run, and marked succeeded/failed.
- Worker outputs can be consumed by the API.


# Progress

Last updated: 2026-08-15 (database live, migration applied, API running)

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
| Shared types and contracts — M2 | Done | Full enums, DTOs, paginated envelopes, request/response types, route contract map |
| Backend foundation — M3 | Done | Auth (JWT/bcrypt), users, orgs, locations (8 div/64 district auto-seed), providers, datasets (catalog seed), reports (status workflow + audit), alerts (severity + audit), global validation, guard infrastructure |
| Prisma schema | Done | 9 enums, 13 models — all core entities implemented; client regenerated |
| Database migration — M4 | Done | `20260814204043_init` applied; 13 tables live; Postgres on port 5433 (remapped — local Postgres occupies 5432) |
| Seed data | Done | LocationsService auto-seeds 8 divisions + 64 districts on boot; DatasetsService auto-seeds 5 catalog records; no separate seed script needed |
| Auth — refresh / logout | Planned | JWT refresh endpoint needs a token store (Redis); logout is a stub |
| PostGIS / geospatial fields | Planned | `lat/lng` Float for now; replace with PostGIS `geography` type when ready |
| Observations module | Planned | Schema ready; controller/service not yet implemented |
| Biodiversity module | Planned | Module stub only; no schema model yet |
| Media module | Planned | Module stub only; no schema model yet |
| Ingestion module | Planned | Module stub only; no ingestion job service yet |
| Environmental monitoring model | Planned | OGC SensorThings-style or simplified internal model — decision pending |
| Dataset downloads / access requests | Planned | Routes defined in contracts; endpoint not implemented |
| Restoration / projects | Planned | Not started; waiting on core reports/datasets stability |
| Community module | Planned | Static mock only; no API module |
| Admin frontend | Planned | Shell only at port 3002 |
| Data worker | Planned | Python skeleton; no active jobs |

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

- `packages/shared/src/index.ts` — 28 exported types and interfaces
- `packages/contracts/src/index.ts` — route map, request/response types, envelopes

### Database

- `packages/database/prisma/schema.prisma` — full domain schema (9 enums, 13 models)

### API (`apps/api/src/`)

- `database/prisma.service.ts`, `database/database.module.ts`
- `common/decorators/current-user.decorator.ts`
- `common/decorators/roles.decorator.ts`
- `common/guards/jwt-auth.guard.ts`
- `common/guards/roles.guard.ts`
- `auth/` — register, login, profile, JWT strategy, DTOs
- `users/` — list, get, update role, deactivate, DTOs
- `organizations/` — list, get
- `locations/` — all 5 endpoints, Bangladesh seed (8 div / 64 districts)
- `providers/` — list, get
- `datasets/` — list, get, weather/current, air-quality/current, catalog seed
- `reports/` — list (public), get, create, status workflow, audit log, DTOs
- `alerts/` — list (public), get, create, update, audit log, DTOs

### Web frontend (`apps/web/`)

- `app/globals.css` — full public-page CSS design system
- `app/layout.tsx` — Inter font via next/font/google
- `app/page.tsx` — composes all 8 public sections
- `lib/static-data.ts` — typed seed data with migration guide
- `components/public-nav.tsx`
- `components/hero-section.tsx`
- `components/metrics-section.tsx`
- `components/map-section.tsx`
- `components/dataset-preview.tsx`
- `components/reports-alerts-section.tsx`
- `components/biodiversity-restoration.tsx`
- `components/community-section.tsx`
- `components/public-footer.tsx`

## Next Work

1. ~~Review and approve the public-first mock direction.~~ Done.
2. ~~Revise mocks for production-level responsiveness and copy.~~ Done.
3. ~~Implement public web page from approved mock.~~ Done — M1.
4. ~~Define shared enums, DTOs, and route contracts.~~ Done — M2.
5. ~~Implement backend foundation.~~ Done — M3.
6. ~~Start the database and run migration.~~ Done — M4. Postgres on port 5433, Redis on 6379, API live at port 3001.
7. ~~Seed data.~~ Done — auto-seeded on first boot (8 div / 64 dist / 5 datasets).
8. Implement observations module (schema already in place).
9. Implement auth refresh / logout with Redis token store.
10. Replace `lat/lng Float` with PostGIS `geography` type — needs PostGIS extension.

## Open Questions

- Should dataset downloads require only login, or role approval per dataset?
- Should government users publish alerts directly, or must alerts always go through moderator/admin approval?
- Should restoration be a standalone `projects` module now, or wait until core reports/datasets are stable?
- Should environmental monitoring follow OGC SensorThings closely, or use a simplified internal model first?
- Should observations and biodiversity share a single schema or be separate modules?

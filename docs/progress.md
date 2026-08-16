# Progress

Last updated: 2026-08-16 (OpenMeteo weather ingestion built — District lat/lng backfilled, `weather` module live, datasets weather/AQ placeholders wired to real data)

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
| Prisma schema | Done | 9 enums, 17 models — core entities + 4 weather tables; client regenerated |
| Database migration — M4 | Done | `20260814204043_init` applied; 13 tables live; Postgres on port 5433 (remapped — local Postgres occupies 5432) |
| District coordinates | Done | Migration `add_district_coordinates`; all 64 districts backfilled with real lat/lng sourced from `open-nature`'s district registry (`LocationsService.onModuleInit` backfills on boot if missing) |
| Seed data | Done | LocationsService auto-seeds 8 divisions + 64 districts (with coordinates) on boot; DatasetsService auto-seeds 5 catalog records; ProvidersService auto-seeds the `OpenMeteo` provider; no separate seed script needed |
| Auth — refresh / logout | Planned | JWT refresh endpoint needs a token store (Redis); logout is a stub |
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

- `packages/shared/src/index.ts` — 28 exported types and interfaces
- `packages/contracts/src/index.ts` — route map, request/response types, envelopes

### Database

- `packages/database/prisma/schema.prisma` — full domain schema (9 enums, 17 models)

### API (`apps/api/src/`)

- `database/prisma.service.ts`, `database/database.module.ts`
- `common/decorators/current-user.decorator.ts`
- `common/decorators/roles.decorator.ts`
- `common/guards/jwt-auth.guard.ts`
- `common/guards/roles.guard.ts`
- `auth/` — register, login, profile, JWT strategy, DTOs
- `users/` — list, get, update role, deactivate, DTOs
- `organizations/` — list, get
- `locations/` — all 5 endpoints, Bangladesh seed (8 div / 64 districts, with lat/lng)
- `providers/` — list, get, OpenMeteo provider auto-seed
- `datasets/` — list, get, weather/current, air-quality/current (live via `weather` module), catalog seed
- `reports/` — list (public), get, create, status workflow, audit log, DTOs
- `alerts/` — list (public), get, create, update, audit log, DTOs
- `weather/` — OpenMeteo client, service, scheduler, controller (current/hourly/daily/air-quality)

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

See `docs/implementation-plan.md` for the full milestone list (M5–M14).

1. ~~Review and approve the public-first mock direction.~~ Done.
2. ~~Revise mocks for production-level responsiveness and copy.~~ Done.
3. ~~Implement public web page from approved mock.~~ Done — M1.
4. ~~Define shared enums, DTOs, and route contracts.~~ Done — M2.
5. ~~Implement backend foundation.~~ Done — M3.
6. ~~Start the database and run migration.~~ Done — M4. Postgres on port 5433, Redis on 6379, API live at port 3001.
7. ~~Seed data.~~ Done — auto-seeded on first boot (8 div / 64 dist / 5 datasets).
8. ~~Write ingestion plan — analyse Java backends, identify gaps, plan NestJS design.~~ Done — `docs/ingestion-plan.md`.
9. **M5 partial:** District lat/lng added and backfilled (2026-08-16). Still pending: `RefreshToken`, `ReportMedia`, `ReportComment`, `RestorationProject` models; auth refresh/logout.
10. ~~**M6:** Implement OpenMeteo ingestion — weather + air quality.~~ Done (2026-08-16), with a redesigned scope: self-contained `weather` module (not the generic `ingestion` module originally planned), no `ApiCallLog`/`IngestionJob` wiring. See `docs/ingestion-plan.md` and `docs/implementation-plan.md` for the design-deviation notes.
11. **Next up:** WAQI integration (M14) for station-level AQI, or resume M5's remaining schema items (RefreshToken, ReportMedia/Comment, RestorationProject).

## Open Questions

- ~~District lat/lng centroids: load from open-nature-backend2 CSVs or hardcode divisional capitals first?~~ Resolved — loaded from `open-nature`'s district CSV (all 64 districts, not just divisional capitals).
- WAQI API key: register at aqicn.org for dev/staging?
- Weather data retention policy: how long to keep raw hourly/daily rows? No aggregation tables were built, so this is now more pressing than originally scoped.
- Should a generic `ApiCallLog`/audit trail be added for external ingestion calls, or is per-request logging via the NestJS `Logger` sufficient? Currently skipped by deliberate decision for the weather module.
- Should government users publish alerts directly, or must alerts always go through moderator/admin approval?
- PostGIS `geography` fields: replace lat/lng Float when polygon queries needed (deferred to Phase 3).

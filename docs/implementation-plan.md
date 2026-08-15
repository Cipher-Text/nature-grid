# Implementation Plan

This plan defines the recommended build order. It is intentionally more concrete than the roadmap.

## Principle

Build persistence and ingestion before features. Real environmental data in the DB makes every module easier to build, test, and demo.

---

## ~~Milestone 1: Frontend Public Page~~ — Done

`apps/web` — 8 React components, full CSS design system, static seed data, responsive, runs at port 3000.

## ~~Milestone 2: Shared Types and Contracts~~ — Done

`packages/shared` + `packages/contracts` — 28 exported types/interfaces, full enums, DTOs, paginated envelopes, route contract map.

## ~~Milestone 3: Backend Foundation~~ — Done

`apps/api` — Auth (JWT/bcrypt), users, organizations, locations (8 div / 64 district auto-seed), providers, datasets (catalog seed), reports (status workflow + audit), alerts (severity + audit), global validation, guard infrastructure.

## ~~Milestone 4: Database Foundation~~ — Done

`packages/database` — Migration `20260814204043_init` applied. 9 enums, 13 models. PostgreSQL 16 on port 5433 (remapped — local Postgres occupies 5432). Auto-seed on boot via OnModuleInit.

---

## Milestone 5: Schema Expansion + Auth Refresh

Extend the Prisma schema with all models needed for ingestion, reports enrichment, and auth completeness. No logic yet — schema only.

**Target:** `packages/database/prisma/schema.prisma`

### New Prisma models to add

| Model | Purpose | Priority |
| --- | --- | --- |
| `RefreshToken` | Store issued refresh tokens for revocation | Auth |
| `WeatherReading` | One row per district per fetch | Ingestion |
| `AirQualityReading` | One row per district per AQ fetch | Ingestion |
| `WeatherAggregate` | Daily rollup per district | Ingestion |
| `AqiAggregate` | Daily AQI rollup per district | Ingestion |
| `ApiCallLog` | Every external HTTP call logged | Ingestion |
| `ReportMedia` | Photo/file attachments on citizen reports | Reports |
| `ReportComment` | Comments with nested reply support | Reports |
| `RestorationProject` | Community restoration/sustainability projects | Community |

Also add to `District` model: `lat Float?` and `lng Float?` for OpenMeteo centroid lookups.

### Tasks

1. Add `RefreshToken` model (token, userId, expiresAt, revokedAt, deviceId, ipAddress, userAgent).
2. Add `WeatherReading` model (districtId, providerId, observedAt, tempC, feelsLikeC, humidityPct, pressureHpa, windSpeedKmh, windDirDeg, precipMm, cloudCoverPct, uvIndex, weatherCode, rawJson). Composite unique on `(districtId, observedAt)`.
3. Add `AirQualityReading` model (districtId, providerId, measuredAt, aqiEuropean, pm25, pm10, o3, no2, so2, co, dominantPollutant, rawJson). Composite unique on `(districtId, measuredAt)`.
4. Add `WeatherAggregate` model (districtId, date, avgTempC, minTempC, maxTempC, totalPrecipMm, avgHumidityPct, avgWindSpeedKmh). Composite unique on `(districtId, date)`.
5. Add `AqiAggregate` model (districtId, date, avgAqi, maxAqi, hoursUnhealthy, dominantPollutant). Composite unique on `(districtId, date)`.
6. Add `ApiCallLog` model (provider, endpoint, httpStatus, responseMs, responseBytes, correlationId, errorMsg, districtId?, createdAt).
7. Add `ReportMedia` model (reportId, mediaType, url, thumbnailUrl?, caption?, metaJson?).
8. Add `ReportComment` model (reportId, userId, body, parentCommentId?, status).
9. Add `RestorationProject` model (title, description, category, status, organizationId?, districtId?, startDate?, endDate?, fundingGoal?, fundingRaised?, impactMetrics Json?, participantCount).
10. Add `lat Float?` and `lng Float?` to `District`.
11. Run `prisma migrate dev --name add_ingestion_models` and regenerate client.

### Auth refresh endpoint (same milestone)

12. Add `POST /auth/refresh` — verify refresh token from `RefreshToken` table, issue new access token, rotate refresh token.
13. Add `POST /auth/logout` — revoke refresh token (set `revokedAt`).

### Definition of done

- Migration applied, all new tables live.
- `POST /auth/refresh` and `POST /auth/logout` work.
- `District` has lat/lng columns (nullable, populated in next milestone).

---

## Milestone 6: OpenMeteo Ingestion

Implement the ingestion module: HTTP clients, scheduler, persistence. Priority 1 API — free, no key, already has working Java reference implementation in open-nature (client + scheduler done; persistence was a TODO there — fill it here).

**Target:** `apps/api/src/ingestion/`

**Reference:** `docs/ingestion-plan.md` — full parameter list, scheduler design, client pattern, retry utility.

### Directory structure

```
apps/api/src/ingestion/
  clients/
    openmeteo-weather.client.ts
    openmeteo-airquality.client.ts
  schedulers/
    weather.scheduler.ts       ← @Cron every 1h
    air-quality.scheduler.ts   ← @Cron every 2h
  services/
    weather-ingestion.service.ts
    air-quality-ingestion.service.ts
    ingestion-job.service.ts
    api-call-log.service.ts
  util/
    retry.ts
  ingestion.module.ts
```

### Tasks

1. Install `@nestjs/schedule` — add to api package.json and AppModule.
2. Write `retry.ts` — `withRetry<T>(fn, maxAttempts=3, baseDelayMs=2000)` with exponential backoff.
3. Write `api-call-log.service.ts` — `logCall(dto)` writes an `ApiCallLog` row.
4. Seed district centroids — hardcode lat/lng for all 64 districts and run a one-time update via `LocationsService.onModuleInit`. (Centroid data available from open-nature-backend2 CSVs.)
5. Write `openmeteo-weather.client.ts` — fetches current + hourly + daily for a given lat/lng. Calls `logCall` after every request. Parameters per `docs/ingestion-plan.md`.
6. Write `openmeteo-airquality.client.ts` — fetches hourly AQ. Same logging pattern.
7. Write `weather-ingestion.service.ts` — loops all active districts, calls weather client, upserts `WeatherReading` rows, records `IngestionJob` start/end.
8. Write `air-quality-ingestion.service.ts` — same pattern for `AirQualityReading`.
9. Write `weather.scheduler.ts` — `@Cron(CronExpression.EVERY_HOUR)` triggers `WeatherIngestionService.runAll()`.
10. Write `air-quality.scheduler.ts` — `@Cron('0 */2 * * *')` triggers `AirQualityIngestionService.runAll()`.
11. Write `ingestion-job.service.ts` — manages `IngestionJob` record lifecycle (QUEUED → RUNNING → SUCCEEDED/FAILED).
12. Wire `IngestionModule` and import into `AppModule`.
13. Expose read endpoints: `GET /ingestion/weather/latest?districtId=` and `GET /ingestion/air-quality/latest?districtId=`.

### Definition of done

- On scheduler tick, weather and AQ data is fetched for all 64 districts and saved to `WeatherReading`/`AirQualityReading`.
- Every HTTP call writes an `ApiCallLog` row.
- `IngestionJob` records track run lifecycle.
- Latest readings queryable via API.

---

## Milestone 7: Dataset Access + Downloads

Implement the access-policy-aware dataset endpoints that are currently stubs.

**Target:** `apps/api/src/datasets/`

### Tasks

1. Add `GET /datasets/:id/download` — checks `accessPolicy`, returns download URL or 403.
2. Add `POST /datasets/:id/access-request` — stores request (needs `DatasetAccessRequest` model or simple audit event) for APPROVED-tier datasets.
3. Add `POST /datasets` (admin) — create new dataset catalog entry.
4. Add `PATCH /datasets/:id` (admin) — update metadata, publish toggle.
5. Connect `Dataset.lastSyncedAt` update when ingestion succeeds.

### Definition of done

- PUBLIC datasets downloadable without auth.
- LOGIN_REQUIRED datasets return 401 for guests.
- RESEARCHER/APPROVED/GOVERNMENT datasets return 403 with access-request route.

---

## Milestone 8: Report Enrichment

Add media attachments and comments to citizen reports.

**Target:** `apps/api/src/reports/`

### Tasks

1. Add `POST /reports/:id/media` — upload metadata (URL from external storage, or later MinIO), create `ReportMedia` row.
2. Add `GET /reports/:id/media` — list media for a report.
3. Add `POST /reports/:id/comments` — authenticated users can comment. Creates `ReportComment`.
4. Add `GET /reports/:id/comments` — list comments (tree structure for replies).
5. Add `PATCH /reports/:id/comments/:commentId` (author or moderator) — edit or soft-delete.

### Definition of done

- Reports can have media attachments and comments.
- Nested replies supported.
- Comment moderation available to MODERATOR/ADMIN.

---

## Milestone 9: Observations Module

Environmental observations by citizens and researchers with trust levels.

**Target:** `apps/api/src/observations/`

### New Prisma model

`Observation` — observerId, districtId, lat, lng, category (ObservationCategory enum), trustLevel (ObservationTrustLevel enum), description, measuredAt, rawValue?, unit?, mediaUrls Json?

### Tasks

1. Add `Observation` Prisma model, migrate.
2. Add `POST /observations` — requires auth, defaults to LOW trust.
3. Add `GET /observations` — public, filterable by districtId/category/trustLevel/date.
4. Add `GET /observations/:id`.
5. Add `PATCH /observations/:id/trust` (RESEARCHER/ADMIN) — promote trust level.
6. Write audit events for trust changes.

### Definition of done

- Citizens can submit observations.
- Researchers can verify and promote trust level.
- Public can browse by district and category.

---

## Milestone 10: Biodiversity + GBIF

Connect to GBIF API for species occurrence data for Bangladesh.

**Target:** `apps/api/src/ingestion/` + new `apps/api/src/biodiversity/` module

### New Prisma models

| Model | Fields |
| --- | --- |
| `Species` | gbifKey, canonicalName, vernacularName, kingdom, phylum, class, order, family, genus, iucnStatus, imageUrl |
| `Occurrence` | speciesId, districtId, lat, lng, observedAt, recordedBy, basisOfRecord, datasetKey, rawJson |

### Tasks

1. Add `Species` and `Occurrence` Prisma models, migrate.
2. Write `gbif.client.ts` in `ingestion/clients/` — queries `https://api.gbif.org/v1/occurrence/search?country=BD`.
3. Write `biodiversity.scheduler.ts` — `@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)` triggers GBIF fetch.
4. Write `GbifIngestionService` — upserts `Species`, creates `Occurrence` rows.
5. Add `GET /biodiversity/species` — public, filterable by name/district.
6. Add `GET /biodiversity/occurrences` — public, filterable by districtId/date.

### Definition of done

- Daily GBIF sync runs and populates Species + Occurrence tables.
- Public endpoints expose occurrence data.

---

## Milestone 11: Restoration Projects

Community and organization restoration/sustainability project tracking.

**Target:** `apps/api/src/restoration/`

### Tasks

1. Add `RestorationModule` (model already added in M5).
2. Add `POST /restoration/projects` — ORGANIZATION_ADMIN or ADMIN.
3. Add `GET /restoration/projects` — public, filterable by category/status/districtId.
4. Add `GET /restoration/projects/:id`.
5. Add `PATCH /restoration/projects/:id` — owner or ADMIN.
6. Add `POST /restoration/projects/:id/join` — CITIZEN can register as participant.

### Definition of done

- Organizations can create and track restoration projects.
- Public can browse and citizens can join.

---

## Milestone 12: Admin Console Frontend

**Target:** `apps/admin`

Basic internal console for the operational views most needed first.

### Tasks

1. Wire admin app to API — auth flow, token storage.
2. Ingestion status dashboard — live `IngestionJob` list, ApiCallLog failures.
3. Report moderation queue — filterable, inline status transitions.
4. User management — list, role change, deactivate.
5. Alert management — create/update/cancel alerts.
6. Dataset management — publish/unpublish catalog entries.

### Definition of done

- Admin users can perform moderation and monitoring tasks without direct DB access.

---

## Milestone 13: Frontend Data Integration

Replace static seed data in `apps/web` with live API calls.

**Target:** `apps/web`

### Tasks

1. Add API client utility (typed fetch wrapper using contracts package).
2. Replace `lib/static-data.ts` calls with `fetch('/api/v1/...')` in Server Components.
3. Add `SWR` or React Query for client-side refreshing data (map, live alerts).
4. Wire auth — login/register flow, session persistence, role-aware nav.
5. Wire report submission form to `POST /reports`.
6. Wire observation submission.
7. Show live metrics from `GET /metrics` on the public homepage.

### Definition of done

- Public page shows real data from the database.
- Authenticated users can submit reports and observations.

---

## Milestone 14: WAQI Integration

Add urban AQI data from WAQI (World Air Quality Index) for station-level granularity.

**Reference:** `docs/ingestion-plan.md` — priority 2 API, free key at `aqicn.org/data-platform/token/`

### Tasks

1. Register WAQI API token, add to `.env` as `WAQI_API_KEY`.
2. Write `waqi.client.ts`.
3. Write `waqi.scheduler.ts` — `@Cron(CronExpression.EVERY_HOUR)`.
4. Persist results into `AirQualityReading` (same table as OpenMeteo AQ, different `providerId`).

### Definition of done

- WAQI data complements OpenMeteo AQ in the same `AirQualityReading` table.
- Station-level readings visible per district.

---

## Deferred / Later Phases

| Item | Why deferred |
| --- | --- |
| PostGIS `geography` fields | lat/lng Float is sufficient for M1–M9; PostGIS replaces when polygon queries needed |
| BMD / FFWC integration | Requires gov approval or scraping; start after OpenMeteo/WAQI proven |
| MinIO media storage | Use external URL reference for now; add MinIO when media upload is a real workflow |
| Extended user profiles (CitizenProfile, ResearcherProfile, OrganizationProfile) | Add when profile UI is built — schema straightforward, not blocking |
| Notification / subscription system | Depends on alert and observation modules being stable |
| Python data worker (apps/data-worker) | GIS processing and ML jobs — defer until API data layer is complete |
| OGC SensorThings model | Evaluate after observations module ships; may replace or extend it |

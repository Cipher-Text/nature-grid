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

## Milestone 5: Schema Expansion + Auth Refresh — Partial

Extend the Prisma schema with all models needed for ingestion, reports enrichment, and auth completeness. No logic yet — schema only.

**Status (2026-08-16):** Task 10 (`District.lat`/`lng`, done via Milestone 6 as a prerequisite, with real per-district coordinates rather than the divisional-capital placeholder originally scoped) and the auth refresh endpoint (tasks 1, 12, 13 — done, with a different design than specified here, see below) are complete. `ReportMedia`, `ReportComment`, `RestorationProject` are still not implemented. The ingestion-specific models below (`WeatherReading`, `AirQualityReading`, `WeatherAggregate`, `AqiAggregate`, `ApiCallLog`) were superseded by a different, smaller design — see Milestone 6.

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

1. ~~Add `RefreshToken` model (token, userId, expiresAt, revokedAt, deviceId, ipAddress, userAgent).~~ Done (2026-08-16), with one change: field is `tokenHash` (SHA-256 of the token), not a raw stored `token` — same reasoning as `User.passwordHash`. See task 12 below for why the token itself is opaque, not a JWT.
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

### Auth refresh endpoint (same milestone) — Done (2026-08-16)

12. ~~Add `POST /auth/refresh` — verify refresh token from `RefreshToken` table, issue new access token, rotate refresh token.~~ Done, exactly as specified — rotation implemented (old token revoked on use, fresh pair issued).
13. ~~Add `POST /auth/logout` — revoke refresh token (set `revokedAt`).~~ Done, idempotent.

**Design change from what's written above:** the refresh token itself is now a random opaque string (`crypto.randomBytes(48)`), not a JWT. Found while implementing this: the *existing* `register`/`login` already issued a "refresh token" that was actually a JWT signed with the same secret as the access token — meaning it could be used directly as a bearer access token, since nothing distinguished token type. Making it opaque closes that gap; it can only ever be redeemed via `/auth/refresh`. A `RefreshTokenCleanupScheduler` (`@Cron`, daily at 2 AM) also deletes tokens expired 30+ days ago — not originally scoped here, added since `@nestjs/schedule` was already available from Milestone 6.

### Definition of done

- Migration applied, all new tables live. — `RefreshToken` ✓; `ReportMedia`/`ReportComment`/`RestorationProject` still pending.
- `POST /auth/refresh` and `POST /auth/logout` work. ✓ — verified live: register → refresh (rotates) → old token rejected → refresh token rejected as a Bearer access token → logout → refresh rejected → logout again still succeeds.
- `District` has lat/lng columns (nullable, populated in next milestone). ✓

---

## ~~Milestone 6: OpenMeteo Ingestion~~ — Done (redesigned)

Implemented 2026-08-16, with a smaller scope than originally planned here. Full rationale for each deviation: `docs/ingestion-plan.md` → "Implementation status".

**Target (actual):** `apps/api/src/weather/` — a self-contained module, not `apps/api/src/ingestion/` as originally scoped. `IngestionModule` remains a stub for future generic job bookkeeping.

### Directory structure (actual)

```
apps/api/src/weather/
  dto/
    open-meteo-response.dto.ts
  weather-openmeteo.client.ts   ← native fetch, manual 3-attempt retry, no circuit breaker
  weather.service.ts            ← fetch/map/upsert + read methods
  weather.scheduler.ts           ← @Cron: current 15min, hourly+AQ 2h, daily 12h
  weather.controller.ts          ← GET /weather/{current,hourly,daily,air-quality}[/:districtId]
  weather.module.ts
```

### Tasks — what was actually done

1. Installed `@nestjs/schedule`; registered `ScheduleModule.forRoot()` in `AppModule`.
2. Retry is inlined in `weather-openmeteo.client.ts` (no separate `util/retry.ts`) — 3 attempts, fixed backoff.
3. No `ApiCallLog`/`logCall` — failures logged via NestJS `Logger` only.
4. District coordinates: all 64 districts backfilled with real lat/lng from `open-nature`'s `district.csv` (not hardcoded divisional capitals), via `LocationsService.onModuleInit`.
5. `weather-openmeteo.client.ts` has one method per fetch type (current/hourly/daily/air-quality) against OpenMeteo's forecast + air-quality endpoints, with a trimmed parameter set (see `docs/ingestion-plan.md`).
6. Air quality fetch lives in the same client, not a separate `openmeteo-airquality.client.ts`.
7. `weather.service.ts` loops fetchable districts (`lat`/`lng` not null), calls the client, upserts into `CurrentWeatherReading` / `HourlyWeatherForecast` / `DailyWeatherForecast` / `HourlyAirQuality` — one row per `(districtId, time)`, no `IngestionJob` start/end tracking.
8. Air quality persistence is part of the same service, not a separate ingestion service.
9. `weather.scheduler.ts` — `@Cron('0 */15 * * * *')` for current weather.
10. Same scheduler — `@Cron('0 0 */2 * * *')` for hourly weather + air quality; `@Cron('0 0 */12 * * *')` for daily.
11. No `ingestion-job.service.ts` — `IngestionJob` model is unused by weather.
12. `WeatherModule` wired into `AppModule`; also imported by `DatasetsModule` so the pre-existing `GET /datasets/weather/current` and `GET /datasets/air-quality/current` placeholders now return real data instead of their "Connect OpenMeteo ingestion worker" stub text.
13. Read endpoints live at `/weather/*`, not `/ingestion/*`: `GET /weather/current[/:districtId]`, `GET /weather/hourly/:districtId`, `GET /weather/daily/:districtId`, `GET /weather/air-quality[/:districtId]`.

### Definition of done — actual

- On scheduler tick, weather and air quality data is fetched for all 64 districts and saved to their typed tables. ✓
- Every HTTP call writes an `ApiCallLog` row. — **Not done**, deliberately skipped (see deviations above).
- `IngestionJob` records track run lifecycle. — **Not done**, deliberately skipped.
- Latest readings queryable via API. ✓ — verified live against the real OpenMeteo API and local Postgres.

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

## Milestone 13: Frontend Data Integration — In Progress

Replace static seed data in `apps/web` with live API calls.

**Target:** `apps/web`

**Status (2026-08-16):** Tasks 1, 2 (partial), and 4 are done — see `docs/progress.md` "Public Weather Wiring" and "Public Auth Flow Wiring". Report/observation submission, live metrics, and the client-side refresh library question are still not started.

### Tasks

1. ~~Add API client utility (typed fetch wrapper using contracts package).~~ Done — `apps/web/lib/api.ts`. Simpler than "typed fetch wrapper using contracts package" implies: a single `apiGet<T>(path)` helper (server-only `API_URL` env var, no `NEXT_PUBLIC_` prefix needed since nothing runs client-side yet), with route paths and response types imported from `packages/contracts` at the call site rather than baked into the helper itself.
2. Replace `lib/static-data.ts` calls with `fetch('/api/v1/...')` in Server Components. — **Partial**: `map-section.tsx`'s "Current conditions" sidebar only (Dhaka PM2.5, Sylhet precipitation, Khulna humidity, Cox's Bazar wind, sync status), fetching `/weather/current` and `/weather/air-quality`. Falls back to the original static `CONDITIONS` array if the API is unreachable, rather than crashing the page. Every other component (`metrics-section`, `dataset-preview`, `reports-alerts-section`, `biodiversity-restoration`, `community-section`) is still fully static.
3. Add `SWR` or React Query for client-side refreshing data (map, live alerts). — Not needed for the weather slice done so far: `map-section.tsx` is a Server Component using Next.js's built-in `fetch` cache (`revalidate: 900`, matching the current-weather cron cadence) rather than client-side polling. Revisit if a component needs to refresh without a full page reload.
4. ~~Wire auth — login/register flow, session persistence, role-aware nav.~~ Done (2026-08-16), with one scope note: "role-aware nav" only distinguishes guest vs. any logged-in user, not per-role nav (moderator/admin nav is a Phase 3+ concern). Session persistence is httpOnly cookies rather than a client-side store — the natural fit given every existing component was already a Server Component. See `docs/progress.md` "Public Auth Flow Wiring" for the full design (middleware-based token refresh, Server Actions for login/register/logout, new `/login`/`/register`/`/profile` routes).
5. Wire report submission form to `POST /reports`.
6. Wire observation submission.
7. Show live metrics from `GET /metrics` on the public homepage.

### Definition of done

- Public page shows real data from the database. — **Partial**: the weather conditions sidebar and the nav's session state; everything else below is still pending.
- Authenticated users can submit reports and observations. — Users can now authenticate (register/login/logout, session persists) ✓; actually submitting reports/observations (tasks 5–6) is not done.

---

## Milestone 14: WAQI Integration

Add urban AQI data from WAQI (World Air Quality Index) for station-level granularity.

**Reference:** `docs/ingestion-plan.md` — priority 2 API, free key at `aqicn.org/data-platform/token/`

### Tasks

1. Register WAQI API token, add to `.env` as `WAQI_API_KEY`.
2. Write `waqi.client.ts` (in `apps/api/src/weather/`, following the pattern `weather-openmeteo.client.ts` established).
3. Add a `@Cron(CronExpression.EVERY_HOUR)` job, either on `WeatherScheduler` or a new one.
4. Persist results into `HourlyAirQuality` (the table `weather` module M6 actually built — needs a `providerId` or `source` column added if WAQI and OpenMeteo readings must coexist per district/time; currently the table has no such column since it only ever stored OpenMeteo data).

### Definition of done

- WAQI data complements OpenMeteo AQ in `HourlyAirQuality` (schema change needed first — see task 4).
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

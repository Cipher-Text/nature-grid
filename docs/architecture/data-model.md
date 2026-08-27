# Data Model

Nature Grid uses PostgreSQL as the primary database. The Prisma schema lives at `packages/database/prisma/schema.prisma`. The Prisma client is regenerated via `pnpm run db:generate` from the `packages/database` directory.

Current state: **39 models, 23 enums, 1 migration applied (`20260826150548_init`).**

## Enums

| Enum | Values |
| --- | --- |
| `UserRole` | `CITIZEN RESEARCHER ORGANIZATION_ADMIN GOVERNMENT MODERATOR ADMIN` |
| `OrganizationMemberRole` | `ADMIN MEMBER` |
| `ProfileVisibility` | `PUBLIC MEMBERS_ONLY PRIVATE` |
| `AlertSeverity` | `INFO WATCH WARNING EMERGENCY` |
| `AlertStatus` | `DRAFT ACTIVE EXPIRED CANCELLED` |
| `ReportStatus` | `SUBMITTED UNDER_REVIEW VERIFIED REJECTED RESOLVED` |
| `ReportCategory` | `WATER_POLLUTION ILLEGAL_DUMPING DEFORESTATION WILDLIFE_INCIDENT FLOODING AIR_POLLUTION OTHER` |
| `ObservationCategory` | `BIODIVERSITY WATER_QUALITY AIR_QUALITY LAND_USE RESTORATION` |
| `ObservationTrustLevel` | `RESEARCH_GRADE COMMUNITY UNVERIFIED FLAGGED` |
| `ProjectStatus` | `PLANNED ACTIVE COMPLETED PAUSED` |
| `RestorationCategory` | `TREE_PLANTING WETLAND_RESTORATION RIVERBANK_PROTECTION MANGROVE WASTE_MANAGEMENT OTHER` |
| `DatasetCategory` | `WEATHER AIR_QUALITY WATER BIODIVERSITY REPORTS MONITORING GEOSPATIAL` |
| `DatasetAccessPolicy` | `PUBLIC LOGIN_REQUIRED RESEARCHER APPROVED GOVERNMENT` |
| `DatasetAccessRequestStatus` | `PENDING APPROVED REJECTED` |
| `ProviderType` | `GOVERNMENT_AGENCY RESEARCH_INSTITUTION NGO INTERNATIONAL_ORG CITIZEN_SCIENCE SATELLITE IOT_SENSOR` |
| `OrganizationType` | `GOVERNMENT_AGENCY RESEARCH_INSTITUTION NGO COMMUNITY_GROUP PRIVATE_COMPANY INTERNATIONAL_ORG OTHER` |
| `IngestionStatus` | `QUEUED RUNNING SUCCEEDED FAILED CANCELLED` |
| `NotificationChannel` | `EMAIL` |
| `DeliveryStatus` | `PENDING SENT FAILED` |
| `PollutionSourceType` | `FACTORY POWER_PLANT VEHICLE_FLEET AGRICULTURE CONSTRUCTION WASTE_FACILITY OTHER` |
| `PollutantType` | `CO2 CH4 N2O PM25 PM10 NOX SOX VOC CO OTHER` |
| `EmissionUnit` | `TONS_PER_YEAR KG_PER_DAY GRAMS_PER_HOUR MG_PER_M3 OTHER` |
| `AuditAction` | `USER_REGISTER USER_LOGIN USER_LOGIN_FAILED USER_LOGOUT USER_ROLE_CHANGE USER_DEACTIVATE REPORT_SUBMIT REPORT_STATUS_CHANGE REPORT_COMMENT_ADD REPORT_MEDIA_ADD ALERT_CREATE ALERT_STATUS_CHANGE DATASET_ACCESS DATASET_DOWNLOAD DATASET_UPDATE OBSERVATION_SUBMIT OBSERVATION_TRUST_CHANGE OBSERVATION_UPDATE OBSERVATION_DELETE RESTORATION_PROJECT_CREATE RESTORATION_PROJECT_UPDATE RESTORATION_PROJECT_JOIN DATASET_ACCESS_DECISION PERMISSION_GRANT PERMISSION_REVOKE EMISSION_SOURCE_CREATE EMISSION_ENTRY_CREATE` |

All 27 `AuditAction` values are written by services. See the `audit` section in [modules.md](modules.md) for which services write what.

## Users & Auth

| Model | Key Fields | Relations |
| --- | --- | --- |
| `User` | `id cuid`, `email unique`, `displayName`, `passwordHash`, `role UserRole`, `isActive`, `lastLoginAt?` | → `CitizenReport[]`, `Observation[]`, `AuditEvent[]`, `RefreshToken[]`, `RestorationProject[]` (created), `RestorationParticipant[]`, `DatasetAccessRequest[]` (as requester and as decider) |
| `UserProfile` | `userId unique`, contact/professional fields, location, profile/contact/link visibility | → `User` |
| `UserSocialLink` | `userId`, `platform`, `url`, unique `(userId, platform)` | → `User` |
| `RefreshToken` | `id`, `userId`, `tokenHash unique`, `expiresAt`, `revokedAt?`, `deviceId?`, `ipAddress?`, `userAgent?` | → `User` |

`RefreshToken` stores a SHA-256 hash, never the raw token. Tokens are opaque random strings (not JWTs) so they can only be redeemed via `POST /auth/refresh`. Refresh rotates: the old row is revoked and a new pair issued. See `docs/progress.md` "Auth Refresh/Logout" for the rationale (Postgres rather than Redis).

## Organizations & Providers

| Model | Key Fields | Relations |
| --- | --- | --- |
| `Organization` | `id`, `name`, `type OrganizationType`, `description?`, `website?`, `country`, `isVerified` | → `Provider[]`, `RestorationProject[]` |
| `OrganizationMembership` | `organizationId`, `userId`, `role OrganizationMemberRole` | → `Organization`, `User`; unique `(organizationId, userId)` |
| `Provider` | `id`, `name`, `type ProviderType`, `country`, `organizationId?`, `isActive` | → `Organization?`, `Dataset[]`, `IngestionJob[]` |

## Geography

| Model | Key Fields | Relations |
| --- | --- | --- |
| `Division` | `id`, `name unique`, `bnName?`, `slug`, `pcode`, `lat`, `lng`, `areaSqKm`, `url`; climate: `avgTemp30d`, `minTemp30d`, `maxTemp30d`, `avgHumidity30d`, `totalPrecip30d`, `avgWindSpeed30d`, `avgCloudCover30d`, `avgPm25_30d`, `avgPm10_30d`, `avgUvIndex30d`, `climateUpdatedAt` | → `District[]` |
| `District` | `id`, `name`, `bnName?`, `slug`, `pcode`, `lat`, `lng`, `areaSqKm`, `url`, `centerLat`, `centerLng`, `boundary Json?`, `divisionId`; climate columns (same 11 as Division) | → `Division`, `Upazila[]`, `CitizenReport[]`, `Alert[]`, `Observation[]`, `RestorationProject[]`, `Occurrence[]`, plus all 4 weather tables; unique `(name, divisionId)` |
| `Upazila` | `id`, `name`, `bnName?`, `slug`, `pcode`, `lat`, `lng`, `areaSqKm`, `url`, `districtId`; climate columns (same 11 as Division) | → `District`, `Union[]`; unique `(name, districtId)` |
| `Union` | `id`, `name`, `bnName?`, `slug`, `pcode`, `lat`, `lng`, `areaSqKm`, `url`, `upazilaId`; climate columns (same 11 as Division) | → `Upazila`, `UnionDailyClimate[]`; unique `(name, upazilaId)` |
| `UnionDailyClimate` | `id`, `unionId`, `date Date`, `avgTemp`, `minTemp`, `maxTemp`, `avgHumidity`, `totalPrecip`, `avgWindSpeed`, `maxWindSpeed`, `avgCloudCover`, `avgPm25`, `avgPm10`, `avgUvIndex`, `avgOzone`, `fetchedAt`; unique `(unionId, date)` | → `Union` |

## Datasets

| Model | Key Fields | Relations |
| --- | --- | --- |
| `Dataset` | `id`, `name`, `category DatasetCategory`, `accessPolicy DatasetAccessPolicy`, `source`, `providerId?`, `description?`, `recordCount?`, `lastSyncedAt?`, `isPublished` | → `Provider?`, `DatasetAccessRequest[]` |
| `DatasetAccessRequest` | `id`, `datasetId`, `userId`, `status DatasetAccessRequestStatus`, `decidedById?`, `decidedAt?` | → `Dataset`, `User` (requester), `User?` (decider); unique `(datasetId, userId)` |

`DatasetAccessRequest` is implemented by `DatasetsService` and `DatasetsController`. `POST /datasets/:id/access-request` creates a request, admins can list and decide requests, and `GET /datasets/:id/download` applies the dataset policy before returning API access information. The unique constraint on `(datasetId, userId)` means one request per user per dataset; re-requesting after rejection still needs an explicit product decision.

## Reports

| Model | Key Fields | Relations |
| --- | --- | --- |
| `CitizenReport` | `id`, `title`, `description`, `category ReportCategory`, `status ReportStatus`, `summary?`, `reporterId?`, `districtId?`, `lat?`, `lng?`, `resolvedAt?` | → `User?`, `District?`, `ReportStatusEvent[]`, `ReportComment[]`, `ReportMedia[]` |
| `ReportStatusEvent` | `id`, `reportId`, `status ReportStatus`, `note?` | → `CitizenReport` |
| `ReportComment` | `id`, `reportId`, `authorId`, `body Text`, `isInternal Boolean default false`, `createdAt` | → `CitizenReport`, `User`; non-internal comments public; internal visible to MODERATOR/ADMIN only |
| `ReportMedia` | `id`, `reportId`, `uploadedById`, `url`, `mimeType?`, `fileSize?`, `caption?`, `createdAt` | → `CitizenReport`, `User`; URL-registered only — no server-side upload yet |

## Observations

| Model | Key Fields | Relations |
| --- | --- | --- |
| `Observation` | `id`, `category ObservationCategory`, `trustLevel ObservationTrustLevel`, `description`, `observerId?`, `districtId?`, `lat?`, `lng?`, `species?`, `observedAt` | → `User?`, `District?` |

Submissions always start at `UNVERIFIED`; only `RESEARCHER`/`ADMIN` can change `trustLevel`, and each change writes an `OBSERVATION_TRUST_CHANGE` audit event recording `from` and `to`. `species` is a free-text string here, deliberately not a FK to `Species` — generic observations are not required to resolve to a GBIF taxon.

## Restoration

| Model | Key Fields | Relations |
| --- | --- | --- |
| `RestorationProject` | `id`, `title`, `description`, `category RestorationCategory`, `status ProjectStatus`, `organizationId?`, `districtId?`, `startDate?`, `endDate?`, `impactSummary?`, `createdById` | → `Organization?`, `District?`, `User` (creator), `RestorationParticipant[]` |
| `RestorationParticipant` | `id`, `projectId`, `userId`, `joinedAt` | → `RestorationProject`, `User`; unique `(projectId, userId)` |

The unique constraint on `(projectId, userId)` is what makes joining a project idempotent. Field set is simplified relative to the original M5 scoping — see `docs/implementation-plan.md` M11.

## Biodiversity

| Model | Key Fields | Relations |
| --- | --- | --- |
| `Species` | `id`, `gbifKey Int unique`, `canonicalName`, `vernacularName?`, `kingdom?`, `phylum?`, `class?`, `order?`, `family?`, `genus?`, `iucnStatus?`, `imageUrl?` | → `Occurrence[]` |
| `Occurrence` | `id`, `gbifOccurrenceKey BigInt unique`, `speciesId`, `districtId?`, `lat`, `lng`, `observedAt?`, `recordedBy?`, `basisOfRecord?` | → `Species`, `District?` |

`gbifOccurrenceKey` is `BigInt`, not `Int` — GBIF occurrence keys exceed the 32-bit signed range and overflowed on first sync (fixed in migration `20260819150726_fix_gbif_occurrence_key_bigint`). `iucnStatus` is nullable and intentionally unpopulated: GBIF's occurrence search does not return IUCN status, and a per-species enrichment call was scoped out of v1. Separate from `Observation` by design — GBIF occurrences are externally sourced records, not user submissions.

## Alerts and Notifications

| Model | Key Fields | Relations |
| --- | --- | --- |
| `Alert` | `id`, `title`, `description`, `severity AlertSeverity`, `status AlertStatus`, `instructions?`, `districtId?`, `issuedAt`, `expiresAt?` | → `District?`, `NotificationDelivery[]` |
| `AlertSubscription` | `id`, `userId`, `districtId?` (null = nationwide), `channel NotificationChannel`, `minSeverity AlertSeverity` | → `User`, `District?`, `NotificationDelivery[]`; uniqueness enforced in service (Postgres `NULL != NULL` in unique indexes breaks naive deduplication for global subscriptions) |
| `NotificationDelivery` | `id`, `subscriptionId`, `alertId`, `userId`, `channel`, `address` (captured at send time), `status DeliveryStatus`, `sentAt?`, `failedAt?`, `error?` | → `AlertSubscription` (cascade delete), `Alert`, `User` |

## Ingestion & Audit

| Model | Key Fields | Relations |
| --- | --- | --- |
| `IngestionJob` | `id`, `providerId`, `status IngestionStatus`, `startedAt?`, `endedAt?`, `errorMsg?` | → `Provider` |
| `AuditEvent` | `id`, `action AuditAction`, `userId?`, `entityType?`, `entityId?`, `meta Json?`, `ipAddress?` | → `User?` |

`IngestionJob` records are written by `IngestionService.startJob`/`completeJob`/`failJob`, called from `WeatherScheduler`, `BiodiversityScheduler`, `FloodScheduler`, `RadiationScheduler`, `MarineScheduler`, and `LocationClimateScheduler` on every cron run. Successful jobs set `Dataset.lastSyncedAt` for matching dataset categories. See the `ingestion` module in [modules.md](modules.md).

## Permissions

| Model | Key Fields | Relations |
| --- | --- | --- |
| `Permission` | `id`, `key unique`, `description` | → `RolePermission[]` |
| `RolePermission` | `role UserRole`, `permissionId`; unique `(role, permissionId)` | → `Permission` |

Seeded on first boot by `PermissionsService.onModuleInit` with 13 named permissions and default role grants. Queried by `PermissionsGuard` for fine-grained access control on routes decorated with `@RequirePermissions(...)`. ADMIN bypasses all permission checks in the guard. Results cached per role for 5 minutes.

## Weather Models

| Model | Key Fields | Relations |
| --- | --- | --- |
| `CurrentWeatherReading` | `id`, `districtId`, `lat`, `lng`, `readingTime`, `temperature2m?`, `relativeHumidity2m?`, `apparentTemperature?`, `windSpeed10m?`, `windDirection10m?`, `precipitation?`, `weatherCode?`, `cloudCover?`, `isDay?` | → `District`; unique `(districtId, readingTime)` |
| `HourlyWeatherForecast` | `id`, `districtId`, `lat`, `lng`, `forecastTime`, `temperature2m?`, `relativeHumidity2m?`, `apparentTemperature?`, `precipitationProbability?`, `precipitation?`, `weatherCode?`, `windSpeed10m?`, `windDirection10m?`, `cloudCover?` | → `District`; unique `(districtId, forecastTime)` |
| `DailyWeatherForecast` | `id`, `districtId`, `lat`, `lng`, `forecastDate date`, `weatherCode?`, `temperature2mMax?`, `temperature2mMin?`, `apparentTemperatureMax?`, `apparentTemperatureMin?`, `precipitationSum?`, `precipitationProbabilityMax?`, `windSpeed10mMax?`, `uvIndexMax?`, `sunrise?`, `sunset?` | → `District`; unique `(districtId, forecastDate)` |
| `HourlyAirQuality` | `id`, `districtId`, `lat`, `lng`, `forecastTime`, `pm10?`, `pm25?`, `carbonMonoxide?`, `nitrogenDioxide?`, `sulphurDioxide?`, `ozone?`, `uvIndex?` | → `District`; unique `(districtId, forecastTime)` |

All 4 weather tables are keyed by `districtId`, not raw `lat`/`lng` proximity matching — every fetch already targets a known district's coordinates, so a direct FK is simpler and exact. `lat`/`lng` are still stored on each row for provenance, duplicating the district's coordinates at fetch time. Field sets are trimmed relative to the OpenMeteo API's full parameter list (see `docs/ingestion-plan.md` for the parameters actually requested) — no soil temperature/moisture or multi-height wind data. Populated by the `weather` module (`apps/api/src/weather/`); see `docs/progress.md` "Weather Ingestion".

## Satellite Radiation and Marine Models

| Model | Key Fields | Relations |
| --- | --- | --- |
| `SatelliteRadiationReading` | `id`, `districtId`, `lat`, `lng`, `readingDate Date`, `shortwaveRadiationSum Float?`, `sunshineDuration Float?`, `daylightDuration Float?`; unique `(districtId, readingDate)` | → `District` |
| `MarineForecast` | `id`, `districtId`, `lat`, `lng`, `forecastDate Date`, 11 Float? wave/swell/wind-wave fields (`waveHeightMax`, `waveDirectionDominant`, `wavePeriodMax`, `windWaveHeightMax`, `windWaveDirectionDominant`, `windWavePeriodMax`, `windWavePeakPeriodMax`, `swellWaveHeightMax`, `swellWaveDirectionDominant`, `swellWavePeriodMax`, `swellWavePeakPeriodMax`); unique `(districtId, forecastDate)` | → `District` |

`SatelliteRadiationReading` is populated daily at 1am by `RadiationScheduler` (`apps/api/src/radiation/`). Fetches 3 daily variables for all 64 districts via `satellite-api.open-meteo.com`. Public endpoints: `GET /radiation/daily` and `GET /radiation/daily/:districtId`.

`MarineForecast` is populated daily at 2am by `MarineScheduler` (`apps/api/src/marine/`). Fetches 11 daily wave/swell/wind-wave aggregates for all 64 district centroids via `marine-api.open-meteo.com`. Inland districts produce no valid marine grid cell — these are logged as `warn` and skipped; only coastal districts (Cox's Bazar, Chattogram, Khulna, Satkhira, Barguna, Patuakhali, Bhola, Noakhali, etc.) generate rows. Public endpoints: `GET /marine/forecast` and `GET /marine/forecast/:districtId`. SST and ocean current variables are hourly-only in the Marine API and are not yet stored.

## Emissions

| Model | Key Fields | Relations |
| --- | --- | --- |
| `PollutionSource` | `id`, `name`, `type PollutionSourceType`, `districtId?`, `lat?`, `lng?`, `organizationId?`, `createdById`, `isActive Boolean default true`, `description?` | → `District?`, `Organization?`, `User` (creator), `EmissionEntry[]` |
| `EmissionEntry` | `id`, `sourceId`, `pollutant PollutantType`, `value Float`, `unit EmissionUnit`, `measurementMethod?`, `periodStart DateTime?`, `periodEnd DateTime?`, `notes?`, `reportedById?` | → `PollutionSource`, `User?` |

`PollutionSource` records factory, power plant, vehicle fleet, and other anthropogenic emission points. `EmissionEntry` captures per-source pollutant measurements with unit, measurement method, and optional reporting period. Both write audit events (`EMISSION_SOURCE_CREATE`, `EMISSION_ENTRY_CREATE`). Gated by `emissions.manage` (create/update sources, requires GOVERNMENT or RESEARCHER) and `emissions.report` (log emission entries, additionally available to ORGANIZATION_ADMIN). Implemented in `apps/api/src/emissions/`; dataset catalog entry: "Emissions Inventory" (AIR_QUALITY / PUBLIC).

Note `carbonMonoxide` on `HourlyAirQuality` is an OpenMeteo air-quality pollutant reading. It is unrelated to carbon accounting or footprint tracking, which Nature Grid does not model yet — that is roadmap Phase 7.

## Geospatial

`lat Float?` / `lng Float?` are used on `District` (populated for all 64), `CitizenReport`, and `Observation`. `Occurrence` and the 4 weather tables carry non-nullable `lat`/`lng`. Replace with PostGIS `geography(Point, 4326)` when the PostGIS extension is enabled — the Docker image already provides it, but no migration has enabled it yet.

`FloodForecast` stores daily OpenMeteo/GloFAS river-discharge forecasts per district, including ensemble statistics where returned. The initial fetch uses district coordinates; these are monitoring proxies and should be replaced or supplemented with river-specific points for basin-level flood operations.

Future candidates for proper geometry fields:

- `Alert` — affected zone polygon
- `District` — administrative boundary polygon
- `Upazila` — boundary polygon
- `WaterBody` — shape (planned model, not yet in schema)

## Notable schema decisions

**Climate columns:** All four geography models (`Division`, `District`, `Upazila`, `Union`) carry 11 rolling-average climate columns (`avgTemp30d`, `minTemp30d`, `maxTemp30d`, `avgHumidity30d`, `totalPrecip30d`, `avgWindSpeed30d`, `avgCloudCover30d`, `avgPm25_30d`, `avgPm10_30d`, `avgUvIndex30d`, `climateUpdatedAt`). These are 30-day rolling averages recomputed nightly by `LocationClimateModule` via bulk SQL aggregation bottom-up from union level. Raw daily data per union is stored in `UnionDailyClimate` (one row per union per day). See `docs/integrations/openmeteo-climate.md` for implementation details.

## Planned Models (not yet in schema)

| Model | Phase | Purpose |
| --- | --- | --- |
| `Habitat` | Phase 3 | Habitat records linked to districts |
| `MediaAsset` | Phase 3 | Uploaded photos/files for reports and observations |
| `WaterBody` | Phase 3 | Rivers, haors, wetlands, ponds |
| `CampaignPost` | Phase 5 | Community campaigns and education resources |
| `Notification` | ~~Phase 5~~ **Done (Phase 6c, 2026-08-22)** | Built as `AlertSubscription` + `NotificationDelivery` — see schema above |

`Observation`, `Species`, and `RestorationProject` were previously listed here and are now in the schema (M9, M10, M11 — all 2026-08-17 to 2026-08-19).

Advanced domain models — climate forecasts, carbon footprint, research publications, structured surveys — are planned for Phase 7 and get their schema when that phase starts. Emissions tracking (`PollutionSource`, `EmissionEntry`) shipped in Phase 7 as the first domain (2026-08-28). See `docs/roadmap.md` Phase 7 and `docs/architecture/feature-map.md`.

## Status Workflows

### CitizenReport
```
SUBMITTED → UNDER_REVIEW → VERIFIED → RESOLVED
                         ↘ REJECTED
```
Each transition writes a `ReportStatusEvent` + `AuditEvent`. Only moderators and admins can advance status.

### Observation
```
UNVERIFIED → COMMUNITY → RESEARCH_GRADE
          ↘ FLAGGED
```
Not a strict state machine — `PATCH /observations/:id/trust` sets any target level directly. Only `RESEARCHER`/`ADMIN` may call it; each change writes an `OBSERVATION_TRUST_CHANGE` audit event. Public listings exclude `FLAGGED` unless `trustLevel` is filtered explicitly.

### Alert
```
DRAFT → ACTIVE → EXPIRED
              ↘ CANCELLED
```
Schema default is `DRAFT`; the create endpoint sets `ACTIVE`. Cancelled/expired via `PATCH /alerts/:id`.

### RestorationProject
```
PLANNED → ACTIVE → COMPLETED
       ↘ PAUSED ↗
```
Create defaults to `PLANNED`. Only the project creator or an `ADMIN` may update — enforced in `RestorationService.update`, not by a route-level `@Roles` guard.

### DatasetAccessRequest
```
PENDING → APPROVED
       ↘ REJECTED
```
Defined in the schema; no endpoint implements it yet.

### IngestionJob
```
QUEUED → RUNNING → SUCCEEDED
                ↘ FAILED → (retry → QUEUED)
         CANCELLED
```
`IngestionService` writes these transitions. Weather, GBIF, and Flood schedulers call `startJob` (→ `RUNNING`) then `completeJob` (→ `SUCCEEDED`) or `failJob` (→ `FAILED`). No manual trigger, retry endpoint, or `QUEUED`/`CANCELLED` transition is implemented yet — scheduled crons serve as periodic retry.

## Database Setup

Postgres runs locally on port 5432. The docker-compose no longer includes a Postgres container. `DATABASE_URL` in `.env` uses port 5432. When running the API in Docker, set `DATABASE_URL` to `host.docker.internal:5432`.

```bash
docker-compose up -d          # Start Redis 7 on :6379 (Postgres is local-only)
cd packages/database && pnpm run db:migrate   # Create/update schema
pnpm run db:generate          # Regenerate Prisma client after schema changes
pnpm run db:studio            # Open Prisma Studio at localhost:5555
```

**Migrations applied (1):**

| Migration | Adds |
| --- | --- |
| `20260826150548_init` | Full schema — all 39 tables and 23 enums in a single fresh migration (includes `SatelliteRadiationReading`, `MarineForecast`, `PollutionSource`, `EmissionEntry` and the 3 emission enums added 2026-08-28) |

39 tables live.

The `LocationsService`, `DatasetsService`, `ProvidersService`, `PermissionsService`, and `SeedService` auto-seed data on first boot via `OnModuleInit`. `LocationsService` seeds 8 divisions, 64 districts (56 with GeoJSON boundary), 494 upazilas, and 4,540 unions — all with lat/lng. All coordinates are hardcoded in `apps/api/src/locations/seed/bangladesh.ts`; no runtime file reads are required. `DatasetsService` seeds 9 catalog records (OpenMeteo Weather, OpenMeteo Flood, District Air Quality Index, Water Body Registry, Biodiversity Occurrences, Sundarbans Monitoring, Emissions Inventory, OpenMeteo Marine Weather, OpenMeteo Satellite Radiation). `ProvidersService` seeds both the OpenMeteo and GBIF provider records. `PermissionsService` seeds 13 named permissions and default role grants. `SeedService` seeds 6 dev user accounts (one per role) and a seed organization for local development. No separate seed script is required for those tables.

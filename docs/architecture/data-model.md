# Data Model

Nature Grid uses PostgreSQL as the primary database. The Prisma schema lives at `packages/database/prisma/schema.prisma`. The Prisma client is regenerated via `pnpm run db:generate` from the `packages/database` directory.

Current state: **30 models, 17 enums, 1 migration applied (`20260826150548_init`).**

## Enums

| Enum | Values |
| --- | --- |
| `UserRole` | `CITIZEN RESEARCHER ORGANIZATION_ADMIN GOVERNMENT MODERATOR ADMIN` |
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
| `AuditAction` | `USER_REGISTER USER_LOGIN USER_LOGIN_FAILED USER_LOGOUT USER_ROLE_CHANGE USER_DEACTIVATE REPORT_SUBMIT REPORT_STATUS_CHANGE REPORT_COMMENT_ADD REPORT_MEDIA_ADD ALERT_CREATE ALERT_STATUS_CHANGE DATASET_ACCESS DATASET_DOWNLOAD DATASET_UPDATE OBSERVATION_SUBMIT OBSERVATION_TRUST_CHANGE RESTORATION_PROJECT_CREATE RESTORATION_PROJECT_UPDATE RESTORATION_PROJECT_JOIN DATASET_ACCESS_DECISION` |

18 of these 21 actions are written by a service. The three unwritten (`DATASET_ACCESS`, `DATASET_DOWNLOAD`, `DATASET_ACCESS_DECISION`) belong to the dataset download and access-request endpoints, which are not yet implemented. See the `audit` section in [modules.md](modules.md) for which services write what.

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

`IngestionJob` exists in the schema but **no code writes to it** — neither the `weather` nor the `biodiversity` module uses job tracking. See the `ingestion` module note in [modules.md](modules.md).

## Weather Models

| Model | Key Fields | Relations |
| --- | --- | --- |
| `CurrentWeatherReading` | `id`, `districtId`, `lat`, `lng`, `readingTime`, `temperature2m?`, `relativeHumidity2m?`, `apparentTemperature?`, `windSpeed10m?`, `windDirection10m?`, `precipitation?`, `weatherCode?`, `cloudCover?`, `isDay?` | → `District`; unique `(districtId, readingTime)` |
| `HourlyWeatherForecast` | `id`, `districtId`, `lat`, `lng`, `forecastTime`, `temperature2m?`, `relativeHumidity2m?`, `apparentTemperature?`, `precipitationProbability?`, `precipitation?`, `weatherCode?`, `windSpeed10m?`, `windDirection10m?`, `cloudCover?` | → `District`; unique `(districtId, forecastTime)` |
| `DailyWeatherForecast` | `id`, `districtId`, `lat`, `lng`, `forecastDate date`, `weatherCode?`, `temperature2mMax?`, `temperature2mMin?`, `apparentTemperatureMax?`, `apparentTemperatureMin?`, `precipitationSum?`, `precipitationProbabilityMax?`, `windSpeed10mMax?`, `uvIndexMax?`, `sunrise?`, `sunset?` | → `District`; unique `(districtId, forecastDate)` |
| `HourlyAirQuality` | `id`, `districtId`, `lat`, `lng`, `forecastTime`, `pm10?`, `pm25?`, `carbonMonoxide?`, `nitrogenDioxide?`, `sulphurDioxide?`, `ozone?`, `uvIndex?` | → `District`; unique `(districtId, forecastTime)` |

All 4 weather tables are keyed by `districtId`, not raw `lat`/`lng` proximity matching — every fetch already targets a known district's coordinates, so a direct FK is simpler and exact. `lat`/`lng` are still stored on each row for provenance, duplicating the district's coordinates at fetch time. Field sets are trimmed relative to the OpenMeteo API's full parameter list (see `docs/ingestion-plan.md` for the parameters actually requested) — no soil temperature/moisture or multi-height wind data. Populated by the `weather` module (`apps/api/src/weather/`); see `docs/progress.md` "Weather Ingestion".

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
| `PollutionSource` | Phase 3 | Known or reported pollution source points |
| `CampaignPost` | Phase 5 | Community campaigns and education resources |
| `Notification` | ~~Phase 5~~ **Done (Phase 6c, 2026-08-22)** | Built as `AlertSubscription` + `NotificationDelivery` — see schema above |

`Observation`, `Species`, and `RestorationProject` were previously listed here and are now in the schema (M9, M10, M11 — all 2026-08-17 to 2026-08-19).

Advanced domain models — emissions sources, climate forecasts, carbon footprint, research publications, structured surveys — are planned for Phase 7 and get their schema when that phase starts. See `docs/roadmap.md` Phase 7 and `docs/architecture/feature-map.md`.

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
Defined in the schema; no code writes these transitions yet.

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
| `20260826150548_init` | Full schema — all 30 tables and 17 enums in a single fresh migration |

30 tables live.

The `LocationsService`, `DatasetsService`, and `ProvidersService` auto-seed geography, catalog, and provider data on first boot via `OnModuleInit`. `LocationsService` seeds 8 divisions, 64 districts (56 with GeoJSON boundary), 494 upazilas, and 4,540 unions — all with lat/lng. All coordinates are hardcoded in `apps/api/src/locations/seed/bangladesh.ts`; no runtime file reads are required. `DatasetsService` seeds 6 catalog records. `ProvidersService` seeds both the OpenMeteo and GBIF provider records. No separate seed script is required for those tables.

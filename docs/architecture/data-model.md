# Data Model

Nature Grid uses PostgreSQL as the primary database. The Prisma schema lives at `packages/database/prisma/schema.prisma`. The Prisma client is regenerated via `pnpm run db:generate` from the `packages/database` directory.

Current state: **24 models, 15 enums, 10 migrations applied.**

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
| `IngestionStatus` | `QUEUED RUNNING SUCCEEDED FAILED CANCELLED` |
| `AuditAction` | `USER_REGISTER USER_LOGIN USER_LOGOUT USER_ROLE_CHANGE USER_DEACTIVATE REPORT_SUBMIT REPORT_STATUS_CHANGE ALERT_CREATE ALERT_STATUS_CHANGE DATASET_ACCESS DATASET_DOWNLOAD OBSERVATION_SUBMIT OBSERVATION_TRUST_CHANGE RESTORATION_PROJECT_CREATE RESTORATION_PROJECT_UPDATE RESTORATION_PROJECT_JOIN DATASET_ACCESS_DECISION` |

14 of these 17 actions are written by a service. Only the three `DATASET_*` actions are unwritten, pending the dataset download/access-request endpoints. See the `audit` section in [modules.md](modules.md) for which services write what.

## Users & Auth

| Model | Key Fields | Relations |
| --- | --- | --- |
| `User` | `id cuid`, `email unique`, `displayName`, `passwordHash`, `role UserRole`, `isActive`, `lastLoginAt?` | → `CitizenReport[]`, `Observation[]`, `AuditEvent[]`, `RefreshToken[]`, `RestorationProject[]` (created), `RestorationParticipant[]`, `DatasetAccessRequest[]` (as requester and as decider) |
| `RefreshToken` | `id`, `userId`, `tokenHash unique`, `expiresAt`, `revokedAt?`, `deviceId?`, `ipAddress?`, `userAgent?` | → `User` |

`RefreshToken` stores a SHA-256 hash, never the raw token. Tokens are opaque random strings (not JWTs) so they can only be redeemed via `POST /auth/refresh`. Refresh rotates: the old row is revoked and a new pair issued. See `docs/progress.md` "Auth Refresh/Logout" for the rationale (Postgres rather than Redis).

## Organizations & Providers

| Model | Key Fields | Relations |
| --- | --- | --- |
| `Organization` | `id`, `name`, `type ProviderType`, `description?`, `website?`, `country`, `isVerified` | → `Provider[]`, `RestorationProject[]` |
| `Provider` | `id`, `name`, `type ProviderType`, `country`, `organizationId?`, `isActive` | → `Organization?`, `Dataset[]`, `IngestionJob[]` |

## Geography

| Model | Key Fields | Relations |
| --- | --- | --- |
| `Division` | `id`, `name unique`, `bnName?` | → `District[]` |
| `District` | `id`, `name`, `bnName?`, `lat?`, `lng?`, `divisionId` | → `Division`, `Upazila[]`, `CitizenReport[]`, `Alert[]`, `Observation[]`, `RestorationProject[]`, `Occurrence[]`, plus all 4 weather tables; unique `(name, divisionId)` |
| `Upazila` | `id`, `name`, `bnName?`, `districtId` | → `District`, `Union[]`; unique `(name, districtId)` |
| `Union` | `id`, `name`, `bnName?`, `upazilaId` | → `Upazila`; unique `(name, upazilaId)` |

## Datasets

| Model | Key Fields | Relations |
| --- | --- | --- |
| `Dataset` | `id`, `name`, `category DatasetCategory`, `accessPolicy DatasetAccessPolicy`, `source`, `providerId?`, `description?`, `recordCount?`, `lastSyncedAt?`, `isPublished` | → `Provider?`, `DatasetAccessRequest[]` |
| `DatasetAccessRequest` | `id`, `datasetId`, `userId`, `status DatasetAccessRequestStatus`, `decidedById?`, `decidedAt?` | → `Dataset`, `User` (requester), `User?` (decider); unique `(datasetId, userId)` |

**`DatasetAccessRequest` is schema-only.** The model and its migration (`20260819173836_add_dataset_access_requests`) are applied, but no service or controller consumes it — `POST /datasets/:id/access-request` and `GET /datasets/:id/download` are still unimplemented. The unique constraint on `(datasetId, userId)` means one request per user per dataset, so a re-request after rejection needs an explicit decision on whether to update in place or relax the constraint.

## Reports

| Model | Key Fields | Relations |
| --- | --- | --- |
| `CitizenReport` | `id`, `title`, `description`, `category ReportCategory`, `status ReportStatus`, `summary?`, `reporterId?`, `districtId?`, `lat?`, `lng?`, `resolvedAt?` | → `User?`, `District?`, `ReportStatusEvent[]` |
| `ReportStatusEvent` | `id`, `reportId`, `status ReportStatus`, `note?` | → `CitizenReport` |

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

## Alerts

| Model | Key Fields | Relations |
| --- | --- | --- |
| `Alert` | `id`, `title`, `description`, `severity AlertSeverity`, `status AlertStatus`, `instructions?`, `districtId?`, `issuedAt`, `expiresAt?` | → `District?` |

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

Future candidates for proper geometry fields:

- `Alert` — affected zone polygon
- `District` — administrative boundary polygon
- `Upazila` — boundary polygon
- `WaterBody` — shape (planned model, not yet in schema)

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

Features from the Open Nature repos with no model planned at all — emissions, climate predictions, carbon footprint, research publications, climate surveys — are scheduled in `docs/roadmap.md` Phase 7, and get their models when that phase starts.

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

> **Port note:** Docker Postgres is mapped to `5433` (not the default 5432) because a local Postgres instance occupies 5432 on this machine. `DATABASE_URL` in `.env` uses port 5433 accordingly.

```bash
docker-compose up -d          # Start PostgreSQL 16/PostGIS on :5433, Redis 7 on :6379
cd packages/database && pnpm run db:migrate   # Create/update schema
pnpm run db:generate          # Regenerate Prisma client after schema changes
pnpm run db:studio            # Open Prisma Studio at localhost:5555
```

**Migrations applied (10, in order):**

| Migration | Adds |
| --- | --- |
| `20260814204043_init` | 13 core tables |
| `20260816113512_add_district_coordinates` | `District.lat` / `lng` |
| `20260816115338_add_weather_tables` | 4 weather tables |
| `20260816140931_add_refresh_tokens` | `RefreshToken` |
| `20260817181448_add_observations` | `Observation` |
| `20260819104332_add_restoration_projects` | `RestorationProject`, `RestorationParticipant` |
| `20260819145646_add_biodiversity` | `Species`, `Occurrence` |
| `20260819150726_fix_gbif_occurrence_key_bigint` | `Occurrence.gbifOccurrenceKey` → `BigInt` |
| `20260819173836_add_dataset_access_requests` | `DatasetAccessRequest` |
| `20260819185617_add_user_deactivate_audit_action` | `AuditAction.USER_DEACTIVATE` |

24 tables live.

The `LocationsService`, `DatasetsService`, and `ProvidersService` auto-seed geography, catalog, and provider data on first boot via `OnModuleInit`. `LocationsService` also backfills district coordinates if missing. No separate seed script is required for those tables.

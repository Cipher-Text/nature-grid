# Data Model

Nature Grid uses PostgreSQL as the primary database. The Prisma schema lives at `packages/database/prisma/schema.prisma`. The Prisma client is regenerated via `pnpm run db:generate` from the `packages/database` directory.

## Enums

| Enum | Values |
| --- | --- |
| `UserRole` | `CITIZEN RESEARCHER ORGANIZATION_ADMIN GOVERNMENT MODERATOR ADMIN` |
| `AlertSeverity` | `INFO WATCH WARNING EMERGENCY` |
| `AlertStatus` | `DRAFT ACTIVE EXPIRED CANCELLED` |
| `ReportStatus` | `SUBMITTED UNDER_REVIEW VERIFIED REJECTED RESOLVED` |
| `ReportCategory` | `WATER_POLLUTION ILLEGAL_DUMPING DEFORESTATION WILDLIFE_INCIDENT FLOODING AIR_POLLUTION OTHER` |
| `DatasetCategory` | `WEATHER AIR_QUALITY WATER BIODIVERSITY REPORTS MONITORING GEOSPATIAL` |
| `DatasetAccessPolicy` | `PUBLIC LOGIN_REQUIRED RESEARCHER APPROVED GOVERNMENT` |
| `ProviderType` | `GOVERNMENT_AGENCY RESEARCH_INSTITUTION NGO INTERNATIONAL_ORG CITIZEN_SCIENCE SATELLITE IOT_SENSOR` |
| `IngestionStatus` | `QUEUED RUNNING SUCCEEDED FAILED CANCELLED` |
| `AuditAction` | `USER_REGISTER USER_LOGIN USER_LOGOUT USER_ROLE_CHANGE REPORT_SUBMIT REPORT_STATUS_CHANGE ALERT_CREATE ALERT_STATUS_CHANGE DATASET_ACCESS DATASET_DOWNLOAD OBSERVATION_SUBMIT` |

## Implemented Models

| Model | Key Fields | Relations |
| --- | --- | --- |
| `User` | `id cuid`, `email unique`, `displayName`, `passwordHash`, `role UserRole`, `isActive`, `lastLoginAt` | → `CitizenReport[]`, `AuditEvent[]` |
| `Organization` | `id`, `name`, `type ProviderType`, `description`, `website`, `country`, `isVerified` | → `Provider[]` |
| `Provider` | `id`, `name`, `type ProviderType`, `country`, `isActive` | → `Organization?`, `Dataset[]`, `IngestionJob[]` |
| `Division` | `id`, `name unique`, `bnName` | → `District[]` |
| `District` | `id`, `name`, `bnName`, `divisionId` | → `Division`, `Upazila[]`, `CitizenReport[]`, `Alert[]` |
| `Upazila` | `id`, `name`, `bnName`, `districtId` | → `District`, `Union[]` |
| `Union` | `id`, `name`, `bnName`, `upazilaId` | → `Upazila` |
| `Dataset` | `id`, `name`, `category DatasetCategory`, `accessPolicy DatasetAccessPolicy`, `source`, `providerId?`, `description`, `recordCount`, `lastSyncedAt`, `isPublished` | → `Provider?` |
| `CitizenReport` | `id`, `title`, `description`, `category ReportCategory`, `status ReportStatus`, `summary?`, `reporterId?`, `districtId?`, `lat?`, `lng?`, `resolvedAt?` | → `User?`, `District?`, `ReportStatusEvent[]` |
| `ReportStatusEvent` | `id`, `reportId`, `status ReportStatus`, `note?` | → `CitizenReport` |
| `Alert` | `id`, `title`, `description`, `severity AlertSeverity`, `status AlertStatus`, `instructions?`, `districtId?`, `issuedAt`, `expiresAt?` | → `District?` |
| `IngestionJob` | `id`, `providerId`, `status IngestionStatus`, `startedAt?`, `endedAt?`, `errorMsg?` | → `Provider` |
| `AuditEvent` | `id`, `action AuditAction`, `userId?`, `entityType?`, `entityId?`, `meta Json?`, `ipAddress?` | → `User?` |

## Geospatial

Currently using `lat Float?` and `lng Float?` on `CitizenReport`. Replace with PostGIS `geography(Point, 4326)` in Phase 3 when the PostGIS extension is enabled. Future candidates for proper geometry fields:

- `Alert` — affected zone polygon
- `District` — administrative boundary polygon
- `Upazila` — boundary polygon
- `WaterBody` — shape (planned model, not yet in schema)

## Planned Models (not yet in schema)

| Model | Phase | Purpose |
| --- | --- | --- |
| `Observation` | Phase 3 | Environmental observations with trust level |
| `Species` | Phase 3 | Biodiversity taxonomy |
| `Habitat` | Phase 3 | Habitat records linked to districts |
| `MediaAsset` | Phase 3 | Uploaded photos/files for reports and observations |
| `WaterBody` | Phase 3 | Rivers, haors, wetlands, ponds |
| `PollutionSource` | Phase 3 | Known or reported pollution source points |
| `RestorationProject` | Phase 5 | Community/org restoration projects |
| `CampaignPost` | Phase 5 | Community campaigns and education resources |
| `Notification` | Phase 5 | Alert/event subscriptions |

## Status Workflows

### CitizenReport
```
SUBMITTED → UNDER_REVIEW → VERIFIED → RESOLVED
                         ↘ REJECTED
```
Each transition writes a `ReportStatusEvent` + `AuditEvent`. Only moderators and admins can advance status.

### Alert
```
DRAFT → ACTIVE → EXPIRED
              ↘ CANCELLED
```
Create defaults to `ACTIVE`. Cancelled/expired via `PATCH /alerts/:id`.

### IngestionJob
```
QUEUED → RUNNING → SUCCEEDED
                ↘ FAILED → (retry → QUEUED)
         CANCELLED
```

## Database Setup

```bash
docker-compose up -d          # Start PostgreSQL 16 + Redis 7
pnpm db:migrate               # Run migrations (from monorepo root)
pnpm db:generate              # Regenerate Prisma client after schema changes
pnpm db:studio                # Open Prisma Studio at localhost:5555
```

The `LocationsService` and `DatasetsService` auto-seed geography and catalog data on first boot via `OnModuleInit`, so no separate seed script is required for those tables.

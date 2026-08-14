# Modules

All NestJS modules live under `apps/api/src/`. The `DatabaseModule` is global and injects `PrismaService` everywhere.

Legend: ✓ Implemented | ~ Stub only | ✗ Not started

## database

Global module. Provides `PrismaService` (extends `PrismaClient`) with connect/disconnect lifecycle hooks. ✓

## auth ✓

Owns login, token refresh, session lifecycle, and authentication guards.

Endpoints:

| Method | Path | Access |
| --- | --- | --- |
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| POST | `/auth/refresh` | — stub, needs Redis token store |
| POST | `/auth/logout` | — stub, needs Redis token store |
| GET  | `/auth/profile` | Authenticated |

JWT strategy validates every non-`@Public()` route. `JwtAuthGuard` and `RolesGuard` are applied globally in `main.ts`.

## users ✓

Owns user profiles, roles, and user lifecycle.

Roles (all in `UserRole` enum): `CITIZEN | RESEARCHER | ORGANIZATION_ADMIN | GOVERNMENT | MODERATOR | ADMIN`

Endpoints (all admin-only):

| Method | Path |
| --- | --- |
| GET | `/users` |
| GET | `/users/:id` |
| PATCH | `/users/:id/role` |
| PATCH | `/users/:id/deactivate` |

## organizations ✓

Owns NGOs, research groups, public agencies, and institutions.

Endpoints (public read):

| Method | Path |
| --- | --- |
| GET | `/organizations` |
| GET | `/organizations/:id` |

## locations ✓

Owns administrative geography for Bangladesh.

Entities: `Division → District → Upazila → Union`

Seeded on first boot: 8 divisions, 64 districts (auto-seeded via `OnModuleInit`).

Endpoints (all public):

| Method | Path |
| --- | --- |
| GET | `/locations/divisions` |
| GET | `/locations/districts` (filterable by `?divisionId`) |
| GET | `/locations/districts/:id` |
| GET | `/locations/upazilas` (filterable by `?districtId`) |
| GET | `/locations/unions` (filterable by `?upazilaId`) |

## providers ✓

Owns data source provenance: government agencies, research institutions, NGOs, satellite feeds, IoT sensors.

Endpoints (public read):

| Method | Path |
| --- | --- |
| GET | `/providers` (filterable by `?type`) |
| GET | `/providers/:id` |

## datasets ✓

Owns dataset catalog, metadata, access policy, and source references.

Access policies: `PUBLIC | LOGIN_REQUIRED | RESEARCHER | APPROVED | GOVERNMENT`

Seeded on first boot: 5 catalog records (OpenMeteo weather, District AQI, Water body registry, Biodiversity occurrences, Sundarbans monitoring).

Endpoints:

| Method | Path | Access |
| --- | --- | --- |
| GET | `/datasets` | Public |
| GET | `/datasets/:id` | Public |
| GET | `/datasets/weather/current` | Public |
| GET | `/datasets/air-quality/current` | Public |
| GET | `/datasets/:id/download` | Role-gated — not yet implemented |
| POST | `/datasets/:id/access-request` | Authenticated — not yet implemented |

## reports ✓

Owns citizen issue reports, verification status, status history, and audit log.

Categories: `WATER_POLLUTION | ILLEGAL_DUMPING | DEFORESTATION | WILDLIFE_INCIDENT | FLOODING | AIR_POLLUTION | OTHER`

Status workflow: `SUBMITTED → UNDER_REVIEW → VERIFIED/REJECTED → RESOLVED`

Every status transition writes a `ReportStatusEvent` and an `AuditEvent`.

Endpoints:

| Method | Path | Access |
| --- | --- | --- |
| GET | `/reports` | Public (verified/resolved only) |
| GET | `/reports/:id` | Public if publishable |
| POST | `/reports` | Authenticated |
| PATCH | `/reports/:id/status` | Moderator / Admin |

## alerts ✓

Owns disaster and environmental alert records.

Severities: `INFO | WATCH | WARNING | EMERGENCY`

Statuses: `DRAFT | ACTIVE | EXPIRED | CANCELLED`

Default public list returns `ACTIVE` alerts, ordered by severity descending.

Every create and status update writes an `AuditEvent`.

Endpoints:

| Method | Path | Access |
| --- | --- | --- |
| GET | `/alerts` | Public |
| GET | `/alerts/:id` | Public |
| POST | `/alerts` | Government / Moderator / Admin |
| PATCH | `/alerts/:id` | Government / Moderator / Admin |

## observations ~

Owns environmental observations submitted by users, researchers, or ingestion systems.

Categories: `BIODIVERSITY | WATER_QUALITY | AIR_QUALITY | LAND_USE | RESTORATION`

Trust levels: `RESEARCH_GRADE | COMMUNITY | UNVERIFIED | FLAGGED`

Status: Module stub only. Schema model not yet added to Prisma. Implement in Phase 3.

## biodiversity ~

Owns species, taxa, habitats, and biodiversity-specific records. Separate from generic observations.

Status: Module stub only. Schema model not yet added. Implement in Phase 3.

## media ~

Owns uploaded evidence and attachments for reports, observations, datasets, and organizations.

Status: Module stub only. No schema model. Implement in Phase 3.

## ingestion ~

Owns provider integrations, ingestion job lifecycle, and retry logic.

Uses `IngestionJob` model in Prisma (`QUEUED | RUNNING | SUCCEEDED | FAILED | CANCELLED`).

Status: Module stub only. No service implementation. Implement in Phase 4.

## audit (embedded)

Audit events are written directly from services (reports, alerts) rather than as a separate injectable service. `AuditEvent` Prisma model stores: `action`, `userId`, `entityType`, `entityId`, `meta`, `ipAddress`, `createdAt`.

If audit event volume grows, extract to a dedicated `AuditModule` with its own service and queue.

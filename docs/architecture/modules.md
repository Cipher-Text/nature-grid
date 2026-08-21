# Modules

All NestJS modules live under `apps/api/src/`. The `DatabaseModule` is global and injects `PrismaService` everywhere.

Global prefix is `/api/v1` (see `packages/contracts/src/index.ts` for the canonical route map). `JwtAuthGuard` and `RolesGuard` are applied globally in `main.ts`, so every route is authenticated unless marked `@Public()`.

Legend: ✓ Implemented | ~ Stub only | ✗ Not started

Registered in `app.module.ts`: `database`, `auth`, `users`, `organizations`, `locations`, `providers`, `datasets`, `reports`, `alerts`, `biodiversity`, `observations`, `restoration`, `media`, `ingestion`, `weather`, `metrics`.

## database ✓

Global module. Provides `PrismaService` (extends `PrismaClient`) with connect/disconnect lifecycle hooks.

## health ✓

Not a module — a single `HealthController` registered directly in `app.module.ts`.

| Method | Path | Access |
| --- | --- | --- |
| GET | `/health` | Public — returns `status`, `service`, `timestamp`, `version` |

## auth ✓

Owns registration, login, token refresh, session lifecycle, and authentication guards.

| Method | Path | Access |
| --- | --- | --- |
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| POST | `/auth/refresh` | Public — redeems an opaque refresh token |
| POST | `/auth/logout` | Public — revokes a refresh token, idempotent |
| GET | `/auth/profile` | Authenticated |

`JWT_SECRET` is required: `common/env.validation.ts` validates it at boot via `ConfigModule.forRoot({ validate })`, and both `auth.module.ts` and `jwt.strategy.ts` read it with `getOrThrow` — there is no fallback value. A missing, placeholder, or under-32-character secret aborts startup before the database is touched.

Access tokens are JWTs; refresh tokens are opaque random strings stored as SHA-256 hashes in the `RefreshToken` table, **not** JWTs and **not** Redis-backed. Refresh rotates the pair and revokes the old token, so a stolen refresh token stops working once the legitimate client refreshes. `RefreshTokenCleanupScheduler` runs daily at 2 AM and deletes tokens expired 30+ days ago.

Registration, login, and logout each write an audit event (`USER_REGISTER`, `USER_LOGIN`, `USER_LOGOUT`) with the caller's IP. Logout stays idempotent but audits only a real revocation — repeat logouts and unknown tokens still return success without logging a duplicate or unattributable event. Failed logins also write `USER_LOGIN_FAILED` (added 2026-08-21) — unknown email gets `userId: null` with the attempted address in meta; wrong password or deactivated account gets the real `userId` with a `reason` field. The HTTP response is a generic 401 either way; the audit trail is the only place the distinction is visible. See `docs/progress.md` "Auth Refresh/Logout" for why Postgres was chosen over Redis.

## users ✓

Owns user profiles, roles, and user lifecycle.

Roles (all in `UserRole`): `CITIZEN | RESEARCHER | ORGANIZATION_ADMIN | GOVERNMENT | MODERATOR | ADMIN`

| Method | Path | Access |
| --- | --- | --- |
| GET | `/users` | Admin |
| GET | `/users/:id` | Admin |
| PATCH | `/users/:id/role` | Admin |
| PATCH | `/users/:id/deactivate` | Admin |

`@Roles('ADMIN')` is applied at the controller level, so all four routes are admin-only.

Both mutating routes audit in the same transaction as the update, recording the acting admin as `userId` and the target as `entityId`: `PATCH /users/:id/role` writes `USER_ROLE_CHANGE` with `{from, to}` in `meta`, and `PATCH /users/:id/deactivate` writes `USER_DEACTIVATE` with `{wasActive}`.

## organizations ✓

Owns NGOs, research groups, public agencies, and institutions.

| Method | Path | Access |
| --- | --- | --- |
| GET | `/organizations` | Public (`?type`, `?page`, `?pageSize`) |
| GET | `/organizations/:id` | Public |

## locations ✓

Owns administrative geography for Bangladesh.

Entities: `Division → District → Upazila → Union`

Seeded on first boot via `OnModuleInit`: 8 divisions, 64 districts with real lat/lng. Coordinates are backfilled on boot if missing.

| Method | Path | Access |
| --- | --- | --- |
| GET | `/locations/divisions` | Public |
| GET | `/locations/districts` | Public (`?divisionId`) |
| GET | `/locations/districts/:id` | Public |
| GET | `/locations/upazilas` | Public (`?districtId`) |
| GET | `/locations/unions` | Public (`?upazilaId`) |

## providers ✓

Owns data source provenance: government agencies, research institutions, NGOs, satellite feeds, IoT sensors.

Auto-seeds the `OpenMeteo` provider on first boot.

| Method | Path | Access |
| --- | --- | --- |
| GET | `/providers` | Public (`?type`, `?page`, `?pageSize`) |
| GET | `/providers/:id` | Public |

## datasets ✓

Owns dataset catalog, metadata, access policy, and source references.

Access policies: `PUBLIC | LOGIN_REQUIRED | RESEARCHER | APPROVED | GOVERNMENT`

Seeded on first boot: 5 catalog records (OpenMeteo weather, District AQI, Water body registry, Biodiversity occurrences, Sundarbans monitoring).

| Method | Path | Access |
| --- | --- | --- |
| GET | `/datasets` | Public (`?category`, `?accessPolicy`, `?page`, `?pageSize`) |
| GET | `/datasets/:id` | Public |
| GET | `/datasets/weather/current` | Public — delegates to `weather` module |
| GET | `/datasets/air-quality/current` | Public — delegates to `weather` module |

`@Public()` is applied at the controller level, so every implemented dataset route is public.

**Not implemented:** `GET /datasets/:id/download` and `POST /datasets/:id/access-request`. Both are defined in `packages/contracts`, and the `DatasetAccessRequest` model plus its migration are applied, but no service or controller consumes them. The `DATASET_ACCESS_DECISION` audit action is likewise declared and unused.

## reports ✓

Owns citizen issue reports, verification status, status history, and audit log.

Categories: `WATER_POLLUTION | ILLEGAL_DUMPING | DEFORESTATION | WILDLIFE_INCIDENT | FLOODING | AIR_POLLUTION | OTHER`

Status workflow: `SUBMITTED → UNDER_REVIEW → VERIFIED/REJECTED → RESOLVED`

Submission writes a `REPORT_SUBMIT` audit event. Every status transition writes a `ReportStatusEvent` and a `REPORT_STATUS_CHANGE` audit event in one transaction.

| Method | Path | Access |
| --- | --- | --- |
| GET | `/reports` | Public — verified/resolved only (`?status`, `?category`, `?districtId`, `?page`, `?pageSize`) |
| GET | `/reports/:id` | Public if publishable |
| POST | `/reports` | Authenticated |
| PATCH | `/reports/:id/status` | Moderator / Admin |

## alerts ✓

Owns disaster and environmental alert records.

Severities: `INFO | WATCH | WARNING | EMERGENCY`

Statuses: `DRAFT | ACTIVE | EXPIRED | CANCELLED`

Default public list returns `ACTIVE` alerts, ordered by severity descending. Every create and status update writes an `AuditEvent`.

| Method | Path | Access |
| --- | --- | --- |
| GET | `/alerts` | Public (`?status`, `?severity`, `?districtId`, `?page`, `?pageSize`) |
| GET | `/alerts/:id` | Public |
| POST | `/alerts` | Government / Moderator / Admin |
| PATCH | `/alerts/:id` | Government / Moderator / Admin |

## observations ✓

Owns environmental observations submitted by users and researchers. Built in M9 (2026-08-17).

Categories: `BIODIVERSITY | WATER_QUALITY | AIR_QUALITY | LAND_USE | RESTORATION`

Trust levels: `RESEARCH_GRADE | COMMUNITY | UNVERIFIED | FLAGGED`

| Method | Path | Access |
| --- | --- | --- |
| GET | `/observations` | Public (`?category`, `?trustLevel`, `?districtId`, `?page`, `?pageSize`) |
| GET | `/observations/:id` | Public |
| POST | `/observations` | Authenticated |
| PATCH | `/observations/:id/trust` | Researcher / Admin |

Submissions always start at `UNVERIFIED` regardless of submitter role. Public listings exclude `FLAGGED` unless `trustLevel` is filtered explicitly. Trust changes write an `OBSERVATION_TRUST_CHANGE` audit event recording the `from`/`to` levels. `species` is free text, not a FK to `Species` — see `architecture/data-model.md`.

## biodiversity ✓

Owns species taxonomy and occurrence records sourced from GBIF. Separate from generic observations. Built in M10 (2026-08-19).

| Method | Path | Access |
| --- | --- | --- |
| GET | `/biodiversity/species` | Public (`?search`, `?page`, `?pageSize`) |
| GET | `/biodiversity/species/:id` | Public |
| GET | `/biodiversity/occurrences` | Public (`?speciesId`, `?districtId`, `?page`, `?pageSize`) |

`gbif.client.ts` queries `api.gbif.org/v1/occurrence/search` filtered to `country=BD&hasCoordinate=true`. `BiodiversityScheduler` syncs daily at midnight, catching and logging failures without crashing the run. `iucnStatus` is intentionally unpopulated — GBIF occurrence search does not return it, and per-species enrichment was scoped out of v1.

## restoration ✓

Owns community and organization restoration projects with a participant join workflow. Built in M11 (2026-08-19).

Categories: `TREE_PLANTING | WETLAND_RESTORATION | RIVERBANK_PROTECTION | MANGROVE | WASTE_MANAGEMENT | OTHER`

Statuses: `PLANNED | ACTIVE | COMPLETED | PAUSED`

| Method | Path | Access |
| --- | --- | --- |
| GET | `/restoration/projects` | Public (`?category`, `?status`, `?districtId`, `?page`, `?pageSize`) |
| GET | `/restoration/projects/:id` | Public |
| POST | `/restoration/projects` | Organization Admin / Admin |
| PATCH | `/restoration/projects/:id` | Authenticated — creator or Admin only |
| POST | `/restoration/projects/:id/join` | Authenticated |

Note the controller prefix is `restoration/projects`, not `restoration`. `PATCH` has no route-level `@Roles` guard: ownership is enforced inside `RestorationService.update`, which throws `ForbiddenException` unless the caller is the project creator or an `ADMIN`. Joining is idempotent via the `(projectId, userId)` unique constraint on `RestorationParticipant`. Create, update, and join each write an audit event.

## weather ✓

Owns OpenMeteo integration: HTTP client, fetch/persist service, cron scheduler, and read endpoints. Self-contained — not built under `ingestion/` (see `docs/ingestion-plan.md` "Implementation status" for why).

Tables: `CurrentWeatherReading`, `HourlyWeatherForecast`, `DailyWeatherForecast`, `HourlyAirQuality` — all keyed by `districtId` (not raw lat/lng proximity matching), unique on `(districtId, time)`.

Scheduler cadence: current every 15 min (`0 */15 * * * *`), hourly + air quality every 2h (`0 0 */2 * * *`), daily every 12h (`0 0 */12 * * *`). Per-district fetch failures are caught and logged via NestJS `Logger` without stopping the run for other districts — no job queue, retry tracking, or audit trail.

| Method | Path | Access |
| --- | --- | --- |
| GET | `/weather/current` | Public — latest reading for every district |
| GET | `/weather/current/:districtId` | Public |
| GET | `/weather/hourly/:districtId` | Public (`?from`, `?to`) |
| GET | `/weather/daily/:districtId` | Public (`?from`, `?to`) |
| GET | `/weather/air-quality` | Public — latest reading for every district |
| GET | `/weather/air-quality/:districtId` | Public |

Also consumed by `DatasetsModule` to serve `/datasets/weather/current` and `/datasets/air-quality/current`, and by `apps/web`'s `map-section.tsx` (public homepage "Current conditions" sidebar, with fallback to static data if the API is unreachable).

## metrics ✓

Owns live platform counters for the public homepage. Built as M13 task 7 (2026-08-19).

| Method | Path | Access |
| --- | --- | --- |
| GET | `/metrics/platform` | Public |

Returns `activeAlerts`, `emergencyAlerts`, `verifiedReports`, `publicDatasets`, `researchGradeObservations`, and `districtsWithResearchGradeObservations` — six real counts computed in a single `Promise.all`, no cached or precomputed values.

## media ~

Intended to own uploaded evidence and attachments for reports, observations, datasets, and organizations.

Status: **empty `@Module({})`** — no controller, service, or schema model. `MediaAsset` is a planned model (`architecture/data-model.md`, Phase 3).

## ingestion ~

Intended to own generic provider job lifecycle and retry logic — queueing, tracking, and auditing external data fetches across providers, using the `IngestionJob` model (`QUEUED | RUNNING | SUCCEEDED | FAILED | CANCELLED`).

Status: **empty `@Module({})`** — no service implementation. **Used by neither `weather` nor `biodiversity`.** Both were built with direct per-request try/catch logging instead of job tracking, so no cross-provider failure history exists anywhere. `IngestionJob` rows are never written. Revisit before adding a third provider (WAQI, BMD) so ingestion failures stay visible.

## audit (embedded)

Audit events are written directly from services rather than via a separate injectable service. `AuditEvent` stores `action`, `userId`, `entityType`, `entityId`, `meta`, `ipAddress`, `createdAt`.

Services that write audit events:

| Service | Actions written |
| --- | --- |
| `auth` | `USER_REGISTER`, `USER_LOGIN`, `USER_LOGOUT` |
| `users` | `USER_ROLE_CHANGE`, `USER_DEACTIVATE` |
| `alerts` | `ALERT_CREATE`, `ALERT_STATUS_CHANGE` |
| `observations` | `OBSERVATION_SUBMIT`, `OBSERVATION_TRUST_CHANGE` |
| `reports` | `REPORT_SUBMIT`, `REPORT_STATUS_CHANGE` |
| `restoration` | `RESTORATION_PROJECT_CREATE`, `RESTORATION_PROJECT_UPDATE`, `RESTORATION_PROJECT_JOIN` |

`AuditAction` declares 17 values; 14 are written. The only unwritten values are `DATASET_ACCESS`, `DATASET_DOWNLOAD`, and `DATASET_ACCESS_DECISION`, all pending the dataset download/access-request endpoints — so audit coverage is complete for every implemented mutating endpoint.

`auth` is the only service that populates `AuditEvent.ipAddress`, because it already captures request metadata for `RefreshToken` rows. The others leave it null.

`USER_DEACTIVATE` was added in migration `20260819185617_add_user_deactivate_audit_action` (2026-08-20), so every sensitive action in `auth` and `users` is now audited. `REPORT_SUBMIT` was wired the same day, bringing `reports` in line with `observations` (both now audit submission as well as status/trust changes).

If audit event volume grows, extract to a dedicated `AuditModule` with its own service and queue.

## Coverage note

`app.module.ts` registers 16 modules: `database` plus 15 feature modules, of which 13 are implemented and 2 (`media`, `ingestion`) are empty stubs. Together they cover the domains Nature Grid has adopted. Domains present in the Open Nature repos with no module here — satellite ingestion, climate prediction, emissions, carbon footprint, research publications, climate surveys, notification delivery — are scheduled in `docs/roadmap.md` Phase 6c and Phase 7.

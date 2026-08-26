# Modules

All NestJS modules live under `apps/api/src/`. The `DatabaseModule` is global and injects `PrismaService` everywhere.

Global prefix is `/api/v1` (see `packages/contracts/src/index.ts` for the canonical route map). `JwtAuthGuard` and `RolesGuard` are applied globally in `main.ts`, so every route is authenticated unless marked `@Public()`.

Legend: ✓ Implemented | ~ Stub only | ✗ Not started

Registered in `app.module.ts`: `database`, `auth`, `users`, `organizations`, `locations`, `locations/climate`, `providers`, `datasets`, `reports`, `alerts`, `biodiversity`, `observations`, `restoration`, `media`, `ingestion`, `weather`, `flood`, `metrics`, `notifications`.

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

Owns NGOs, research groups, public agencies, community groups, and institutions. Organization classification uses `OrganizationType`; `ProviderType` is reserved for data-source providers.

Admin management uses `OrganizationMembership` as a many-to-many link between users and organizations. Each membership is either `ADMIN` or `MEMBER`; users may belong to multiple organizations. The management endpoints use the RBAC permission `organizations.manage`, currently granted to the platform `ADMIN` role.

| Method | Path | Access |
| --- | --- | --- |
| GET | `/organizations` | Public (`?type`, `?page`, `?pageSize`) |
| GET | `/organizations/:id` | Public |
| GET/POST | `/admin/organizations` | `organizations.manage` |
| POST/PATCH/DELETE | `/admin/organizations/:id/members[/:userId]` | `organizations.manage` |

## locations ✓

Owns administrative geography for Bangladesh.

Entities: `Division → District → Upazila → Union`

Seeded on first boot via `OnModuleInit`: 8 divisions, 64 districts (56 with GeoJSON boundary), 494 upazilas, 4,540 unions — all with lat/lng. All coordinates are hardcoded in `apps/api/src/locations/seed/bangladesh.ts`; no runtime file reads are required.

| Method | Path | Access |
| --- | --- | --- |
| GET | `/locations/divisions` | Public |
| GET | `/locations/districts` | Public (`?divisionId`) |
| GET | `/locations/districts/:id` | Public |
| GET | `/locations/upazilas` | Public (`?districtId`) |
| GET | `/locations/upazilas/:id` | Public |
| GET | `/locations/unions` | Public (`?upazilaId`) |
| GET | `/locations/unions/:id` | Public |

## locations/climate ✓

Owns the daily union-level climate ingestion pipeline. No HTTP endpoints — scheduler only.

`LocationClimateScheduler` runs daily at midnight (`@Cron('0 0 0 * * *')`). `LocationClimateService` calls the OpenMeteo forecast API (daily temp max/min/mean, precipitation, wind speed, UV index) and air-quality API (PM2.5, PM10, ozone, UV index) in batch: up to 1,000 union coordinates per HTTP request, so 4,540 unions require just 6 requests total. The service reuses `WeatherOpenMeteoClient` exported from `WeatherModule`.

Raw daily results are upserted into `UnionDailyClimate` (one row per union per day, unique on `(unionId, date)`). After inserting, 30-day rolling averages are recomputed bottom-up — Union → Upazila → District → Division — via bulk `UPDATE … FROM (SELECT … GROUP BY)` SQL, updating the 11 climate columns on each geography model in a single pass per level.

## providers ✓

Owns data source provenance: government agencies, research institutions, NGOs, satellite feeds, IoT sensors.

Auto-seeds the `OpenMeteo` and `GBIF` provider records on first boot.

| Method | Path | Access |
| --- | --- | --- |
| GET | `/providers` | Public (`?type`, `?page`, `?pageSize`) |
| GET | `/providers/:id` | Public |

## datasets ✓

Owns dataset catalog, metadata, access policy, and source references.

Access policies: `PUBLIC | LOGIN_REQUIRED | RESEARCHER | APPROVED | GOVERNMENT`

Seeded on first boot: 6 catalog records, including OpenMeteo flood forecasts. Existing installations add the flood catalog entry idempotently on the next API boot.

| Method | Path | Access |
| --- | --- | --- |
| GET | `/datasets` | Public (`?category`, `?accessPolicy`, `?page`, `?pageSize`) |
| GET | `/datasets/:id` | Public |
| GET | `/datasets/weather/current` | Public — delegates to `weather` module |
| GET | `/datasets/air-quality/current` | Public — delegates to `weather` module |

`@Public()` is applied at the controller level, so every implemented dataset route is public.

Dataset access is implemented: `GET /datasets/:id/download` applies the dataset access policy, `POST /datasets/:id/access-request` creates a request, and admins can list and approve/reject requests. Dataset detail pages live at `/data/:id` in `apps/web`; they show metadata, API endpoints, and live previews for OpenMeteo, Flood, and GBIF datasets.

## reports ✓

Owns citizen issue reports, verification status, status history, and audit log.

Categories: `WATER_POLLUTION | ILLEGAL_DUMPING | DEFORESTATION | WILDLIFE_INCIDENT | FLOODING | AIR_POLLUTION | OTHER`

Status workflow: `SUBMITTED → UNDER_REVIEW → VERIFIED/REJECTED → RESOLVED`

Submission writes a `REPORT_SUBMIT` audit event. Every status transition writes a `ReportStatusEvent` and a `REPORT_STATUS_CHANGE` audit event in one transaction.

| Method | Path | Access |
| --- | --- | --- |
| GET | `/reports` | Public — verified/resolved only (`?status`, `?category`, `?districtId`, `?page`, `?pageSize`) |
| GET | `/reports/mine` | Authenticated — caller's own reports, all statuses |
| GET | `/reports/:id` | Public |
| POST | `/reports` | Authenticated |
| PATCH | `/reports/:id/status` | Moderator / Admin |
| GET | `/reports/:id/comments` | Public — non-internal only |
| GET | `/reports/:id/comments/all` | Moderator / Admin — includes internal notes |
| POST | `/reports/:id/comments` | Authenticated |
| GET | `/reports/:id/media` | Public |
| POST | `/reports/:id/media` | Authenticated |

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
| GET | `/observations/mine` | Authenticated — caller's own observations, all trust levels |
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

Owns OpenMeteo integration: HTTP client, fetch/persist service, cron scheduler, and read endpoints. Provider-specific field and endpoint details live in `docs/integrations/openmeteo.md`.

Tables: `CurrentWeatherReading`, `HourlyWeatherForecast`, `DailyWeatherForecast`, `HourlyAirQuality` — all keyed by `districtId` (not raw lat/lng proximity matching), unique on `(districtId, time)`.

Scheduler cadence: current every 15 min (`0 */15 * * * *`), hourly + air quality every 2h (`0 0 */2 * * *`), daily every 12h (`0 0 */12 * * *`). Per-district fetch failures are caught and logged via NestJS `Logger` without stopping the run for other districts. Each outer scheduler run creates an `IngestionJob` when the `OpenMeteo` provider exists and marks it `SUCCEEDED` or `FAILED`.

| Method | Path | Access |
| --- | --- | --- |
| GET | `/weather/current` | Public — latest reading for every district |
| GET | `/weather/current/:districtId` | Public |
| GET | `/weather/hourly/:districtId` | Public (`?from`, `?to`) |
| GET | `/weather/daily/:districtId` | Public (`?from`, `?to`) |
| GET | `/weather/air-quality` | Public — latest reading for every district |
| GET | `/weather/air-quality/:districtId` | Public |

Also consumed by `DatasetsModule` to serve `/datasets/weather/current` and `/datasets/air-quality/current`, and by `apps/web`'s `map-section.tsx` (public homepage "Current conditions" sidebar, with fallback to static data if the API is unreachable).

## flood ✓

Owns the OpenMeteo Flood / GloFAS integration: provider client, daily discharge persistence, six-hour scheduler, ingestion tracking, and public read endpoints. District coordinates are initial monitoring proxies; the provider selects the nearest supported river/grid cell.

| Method | Path | Access |
| --- | --- | --- |
| GET | `/flood/forecast` | Public — latest stored forecast day for every district |
| GET | `/flood/forecast/:districtId` | Public — forecast rows (`?from`, `?to`) |

When `FloodForecast` is empty, the module starts an initial sync on application boot. It then fetches a 30-day forecast for every district with coordinates at `0:30` every six hours. The stored data has daily resolution. OpenMeteo Flood returns simulated river discharge, not an official Bangladesh flood warning; official FFWC integration remains a separate future source.

## metrics ✓

Owns live platform counters for the public homepage. Built as M13 task 7 (2026-08-19).

| Method | Path | Access |
| --- | --- | --- |
| GET | `/metrics/platform` | Public |

Returns `activeAlerts`, `emergencyAlerts`, `verifiedReports`, `publicDatasets`, `researchGradeObservations`, and `districtsWithResearchGradeObservations` — six real counts computed in a single `Promise.all`, no cached or precomputed values.

## media ~

Intended to own uploaded evidence and attachments for reports, observations, datasets, and organizations.

Status: **empty `@Module({})`** — no controller, service, or schema model. `MediaAsset` is a planned model (`architecture/data-model.md`, Phase 3).

## ingestion ✓

Owns provider job visibility for scheduled external data fetches, using the `IngestionJob` model (`QUEUED | RUNNING | SUCCEEDED | FAILED | CANCELLED`).

Status: implemented service + read controller. `WeatherScheduler` and `BiodiversityScheduler` call `IngestionService.startJob`, `completeJob`, and `failJob`; successful jobs update `Dataset.lastSyncedAt` for matching dataset categories. Admin/moderator routes expose `GET /ingestion/jobs` and `GET /ingestion/jobs/:id`. There is no queue worker, manual trigger endpoint, or retry endpoint yet; recurring cron jobs are the retry mechanism.

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

`AuditAction` declares 21 values and all 21 are written. Dataset access, access decisions, dataset updates, report enrichment, authentication, moderation, observations, and restoration actions are covered.

`auth` is the only service that populates `AuditEvent.ipAddress`, because it already captures request metadata for `RefreshToken` rows. The others leave it null.

`USER_DEACTIVATE` was added in migration `20260819185617_add_user_deactivate_audit_action` (2026-08-20), so every sensitive action in `auth` and `users` is now audited. `REPORT_SUBMIT` was wired the same day, bringing `reports` in line with `observations` (both now audit submission as well as status/trust changes).

If audit event volume grows, extract to a dedicated `AuditModule` with its own service and queue.

## Coverage note

`app.module.ts` registers 20 modules: `database` plus 19 feature modules (including `locations/climate`, `flood`, and `notifications`). All are implemented except the `media` stub; `ingestion` now owns provider job tracking. Advanced domains not yet represented by a module — satellite ingestion, long-range climate projections, emissions, carbon accounting, research publications, structured surveys — are planned for Phase 7. See `docs/roadmap.md` and `docs/architecture/feature-map.md`.

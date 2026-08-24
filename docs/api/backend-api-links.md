# Backend API Links

Default local API base URL:

```text
http://localhost:3001/api/v1
```

Legend: ✓ Implemented | ~ Stub / planned | ✗ Not started

## Health

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/health` | Public | ✓ | API health check |

## Auth

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | Public | ✓ | Create account (bcrypt, JWT) |
| POST | `/auth/login` | Public | ✓ | Login and issue token pair |
| POST | `/auth/refresh` | Public + refresh token | ✓ | Rotate token pair; old refresh token revoked |
| POST | `/auth/logout` | Public + refresh token | ✓ | Revoke refresh token; idempotent |
| GET  | `/auth/profile` | Authenticated | ✓ | Current user from DB |

Refresh tokens are opaque, Postgres-backed, and rotated on use — not Redis, not JWTs. Register/login/logout each write an audit event with the caller's IP.

## Users

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/users` | Admin | ✓ | Paginated user list |
| GET | `/users/:id` | Admin | ✓ | User detail |
| PATCH | `/users/:id/role` | Admin | ✓ | Update user role (audited, records from/to) |
| PATCH | `/users/:id/deactivate` | Admin | ✓ | Deactivate user (audited) |

## Organizations

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/organizations` | Public | ✓ | List organizations (`?type=OrganizationType`) |
| GET | `/organizations/:id` | Public | ✓ | Organization detail + providers |
| POST | `/organizations` | Authenticated | ✗ | Request org creation |
| PATCH | `/organizations/:id` | Org admin / Admin | ✗ | Update org |
| GET | `/admin/organizations` | `organizations.manage` | ✓ | Admin organization list with memberships |
| POST | `/admin/organizations` | `organizations.manage` | ✓ | Create organization |
| POST | `/admin/organizations/:id/members` | `organizations.manage` | ✓ | Attach or update a user membership |
| PATCH | `/admin/organizations/:id/members/:userId` | `organizations.manage` | ✓ | Change membership role (`ADMIN` / `MEMBER`) |
| DELETE | `/admin/organizations/:id/members/:userId` | `organizations.manage` | ✓ | Remove membership |

## Locations

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/locations/divisions` | Public | ✓ | All 8 divisions |
| GET | `/locations/districts` | Public | ✓ | All 64 districts (`?divisionId` filter) |
| GET | `/locations/districts/:id` | Public | ✓ | District detail |
| GET | `/locations/upazilas` | Public | ✓ | Upazilas (`?districtId` filter) |
| GET | `/locations/unions` | Public | ✓ | Unions (`?upazilaId` filter) |
| GET | `/locations/water-bodies` | Public | ✗ | Water body registry |
| GET | `/locations/pollution-sources` | Public | ✗ | Known pollution sources |

## Providers

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/providers` | Public | ✓ | List active providers (`?type` filter) |
| GET | `/providers/:id` | Public | ✓ | Provider detail + datasets |

## Datasets

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/datasets` | Public | ✓ | Dataset catalog (`?category`, `?accessPolicy` filters) |
| GET | `/datasets/:id` | Public | ✓ | Dataset detail |
| GET | `/datasets/weather/current` | Public | ✓ | Live current weather for all districts, via `weather` module |
| GET | `/datasets/air-quality/current` | Public | ✓ | Live current air quality for all districts, via `weather` module |
| GET | `/datasets/:id/download` | Role-gated | ✓ | Policy-checked API access information |
| POST | `/datasets/:id/access-request` | Authenticated | ✓ | Request access |
| POST | `/datasets` | Admin | ✓ | Create dataset record |
| PATCH | `/datasets/:id` | Admin | ✓ | Update metadata |

## Weather

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/weather/current` | Public | ✓ | Latest current-weather reading for every district |
| GET | `/weather/current/:districtId` | Public | ✓ | Latest current-weather reading for one district |
| GET | `/weather/hourly/:districtId` | Public | ✓ | Hourly forecast (`?from`, `?to`) |
| GET | `/weather/daily/:districtId` | Public | ✓ | Daily forecast (`?from`, `?to`) |
| GET | `/weather/air-quality` | Public | ✓ | Latest air quality reading for every district |
| GET | `/weather/air-quality/:districtId` | Public | ✓ | Latest air quality reading for one district |

Source: OpenMeteo, via a `@nestjs/schedule` cron scheduler (current every 15min, hourly + AQ every 2h, daily every 12h). See `docs/architecture/modules.md` "weather" for design notes and `docs/integrations/openmeteo.md` for provider details.

### Flood (OpenMeteo / GloFAS)

| Method | Path | Access | Status | Notes |
|---|---|---|---|---|
| GET | `/flood/forecast` | Public | ✓ | Latest stored discharge forecast day for every district |
| GET | `/flood/forecast/:districtId` | Public | ✓ | Daily 30-day forecast by default; accepts `from` and `to` |

Source: OpenMeteo Flood API, persisted as `FloodForecast`. An empty table triggers an initial sync; normal refresh runs every six hours. See `docs/integrations/openmeteo-flood.md`.

## Reports

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/reports` | Public (verified/resolved only) | ✓ | Paginated public reports |
| GET | `/reports/:id` | Public if publishable | ✓ | Report detail + status history |
| POST | `/reports` | Authenticated | ✓ | Submit report (audited) |
| PATCH | `/reports/:id/status` | Moderator / Admin | ✓ | Advance status (with audit) |
| GET | `/reports/moderation/queue` | Moderator / Admin | ✗ | Review queue (all statuses) |
| PATCH | `/reports/:id` | Owner / Moderator | ✗ | Edit report before review |

## Alerts

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/alerts` | Public | ✓ | Active alerts by default (`?status`, `?severity` filters) |
| GET | `/alerts/:id` | Public | ✓ | Alert detail |
| POST | `/alerts` | Government / Moderator / Admin | ✓ | Create and activate alert |
| PATCH | `/alerts/:id` | Government / Moderator / Admin | ✓ | Update status/instructions/expiry |

## Observations

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/observations` | Public | ✓ | Observations (`?category`, `?trustLevel`, `?districtId`); excludes `FLAGGED` by default |
| GET | `/observations/:id` | Public | ✓ | Observation detail |
| POST | `/observations` | Authenticated | ✓ | Submit observation (audited; always starts `UNVERIFIED`) |
| PATCH | `/observations/:id/trust` | Researcher / Admin | ✓ | Update trust level (audited, records from/to) |

Note the implemented path is `/trust`, not the `/verification` originally planned here, and moderators are **not** granted trust-level changes — only `RESEARCHER` and `ADMIN`.

## Restoration

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/restoration/projects` | Public | ✓ | Projects (`?category`, `?status`, `?districtId`) |
| GET | `/restoration/projects/:id` | Public | ✓ | Project detail + participants |
| POST | `/restoration/projects` | Org admin / Admin | ✓ | Create project (audited) |
| PATCH | `/restoration/projects/:id` | Creator / Admin | ✓ | Update project (audited; ownership checked in the service, not by a route guard) |
| POST | `/restoration/projects/:id/join` | Authenticated | ✓ | Join project (audited; idempotent) |

Controller prefix is `restoration/projects`, not `restoration`.

## Media

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| POST | `/media` | Authenticated | ✗ | Create upload record |
| GET | `/media/:id` | Permission-based | ✗ | Media metadata |
| DELETE | `/media/:id` | Owner / Moderator / Admin | ✗ | Remove media |

## Biodiversity

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/biodiversity/species` | Public | ✓ | Species catalog (`?search`) |
| GET | `/biodiversity/species/:id` | Public | ✓ | Species detail |
| GET | `/biodiversity/occurrences` | Public | ✓ | Occurrences (`?speciesId`, `?districtId`) |
| GET | `/biodiversity/habitats` | Public | ✗ | Habitat catalog — no `Habitat` model yet |
| POST | `/biodiversity/species` | Researcher / Admin | ✗ | Create species record — species are GBIF-sourced only today |

Populated by a daily GBIF sync (`country=BD&hasCoordinate=true`). `iucnStatus` is stored but unpopulated — GBIF's occurrence search does not return it. See `docs/integrations/gbif.md` for provider details.

## Ingestion

Provider job-tracking API for scheduled external syncs. Weather, GBIF, and Flood schedulers create `IngestionJob` rows and update `Dataset.lastSyncedAt` on successful runs.

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/ingestion/jobs` | Moderator / Admin | ✓ | List ingestion jobs (`?status`, `?providerId`, `?page`, `?pageSize`) |
| POST | `/ingestion/jobs` | Admin | ✗ | Create ingestion job manually |
| GET | `/ingestion/jobs/:id` | Moderator / Admin | ✓ | Job detail |
| POST | `/ingestion/jobs/:id/retry` | Admin | ✗ | Retry failed job |
| POST | `/ingestion/providers/openmeteo/sync` | Admin | ✗ | Trigger OpenMeteo sync — superseded by the cron scheduler in `weather`, likely unnecessary now |

## Metrics

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/metrics/platform` | Public | ✓ | Six live counts: active/emergency alerts, verified reports, public datasets, research-grade observations, districts covered |

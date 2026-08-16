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
| POST | `/auth/refresh` | Public + refresh token | ~ | Refresh access token — needs Redis |
| POST | `/auth/logout` | Authenticated | ~ | End session — needs Redis |
| GET  | `/auth/profile` | Authenticated | ✓ | Current user from DB |

## Users

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/users` | Admin | ✓ | Paginated user list |
| GET | `/users/:id` | Admin | ✓ | User detail |
| PATCH | `/users/:id/role` | Admin | ✓ | Update user role |
| PATCH | `/users/:id/deactivate` | Admin | ✓ | Deactivate user |

## Organizations

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/organizations` | Public | ✓ | List organizations |
| GET | `/organizations/:id` | Public | ✓ | Organization detail + providers |
| POST | `/organizations` | Authenticated | ✗ | Request org creation |
| PATCH | `/organizations/:id` | Org admin / Admin | ✗ | Update org |

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
| GET | `/datasets/:id/download` | Role-gated | ✗ | Download dataset |
| POST | `/datasets/:id/access-request` | Authenticated | ✗ | Request access |
| POST | `/datasets` | Researcher / Admin | ✗ | Create dataset record |
| PATCH | `/datasets/:id` | Owner / Admin | ✗ | Update metadata |

## Weather

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/weather/current` | Public | ✓ | Latest current-weather reading for every district |
| GET | `/weather/current/:districtId` | Public | ✓ | Latest current-weather reading for one district |
| GET | `/weather/hourly/:districtId` | Public | ✓ | Hourly forecast (`?from`, `?to`) |
| GET | `/weather/daily/:districtId` | Public | ✓ | Daily forecast (`?from`, `?to`) |
| GET | `/weather/air-quality` | Public | ✓ | Latest air quality reading for every district |
| GET | `/weather/air-quality/:districtId` | Public | ✓ | Latest air quality reading for one district |

Source: OpenMeteo, via a `@nestjs/schedule` cron scheduler (current every 15min, hourly + AQ every 2h, daily every 12h). See `docs/architecture/modules.md` "weather" for design notes.

## Reports

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/reports` | Public (verified/resolved only) | ✓ | Paginated public reports |
| GET | `/reports/:id` | Public if publishable | ✓ | Report detail + status history |
| POST | `/reports` | Authenticated | ✓ | Submit report |
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
| GET | `/observations` | Public | ✗ | Verified observations |
| POST | `/observations` | Authenticated | ✗ | Submit observation |
| GET | `/observations/:id` | Public | ✗ | Observation detail |
| PATCH | `/observations/:id/verification` | Researcher / Moderator / Admin | ✗ | Update trust level |

## Media

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| POST | `/media` | Authenticated | ✗ | Create upload record |
| GET | `/media/:id` | Permission-based | ✗ | Media metadata |
| DELETE | `/media/:id` | Owner / Moderator / Admin | ✗ | Remove media |

## Biodiversity

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/biodiversity/species` | Public | ✗ | Species catalog |
| GET | `/biodiversity/species/:id` | Public | ✗ | Species detail |
| GET | `/biodiversity/habitats` | Public | ✗ | Habitat catalog |
| POST | `/biodiversity/species` | Researcher / Admin | ✗ | Create species record |

## Ingestion

Generic job-tracking API — none of this is implemented, and OpenMeteo sync does **not** go through it (see `## Weather` above; it runs its own cron scheduler with no job records). This table describes a future generic layer for tracking/retrying provider fetches once a second provider (WAQI, GBIF) is added.

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/ingestion/jobs` | Admin | ✗ | List ingestion jobs |
| POST | `/ingestion/jobs` | Admin | ✗ | Create ingestion job |
| GET | `/ingestion/jobs/:id` | Admin | ✗ | Job detail |
| POST | `/ingestion/jobs/:id/retry` | Admin | ✗ | Retry failed job |
| POST | `/ingestion/providers/openmeteo/sync` | Admin | ✗ | Trigger OpenMeteo sync — superseded by the cron scheduler in `weather`, likely unnecessary now |

## Metrics

| Method | Path | Access | Status | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/metrics/platform` | Public | ✗ | Platform-level summary counts |

# Backend API Links

Default local API base URL:

```text
http://localhost:3001/api/v1
```

When OpenAPI is enabled, expected docs:

```text
http://localhost:3001/api/docs
http://localhost:3001/api-json
```

Current implementation is an early scaffold. Links below define the target route catalog for the first backend milestone.

## Health

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | Public | API health check |

## Auth

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Create account |
| POST | `/auth/login` | Public | Login and issue tokens |
| POST | `/auth/refresh` | Public with refresh token | Refresh access token |
| POST | `/auth/logout` | Authenticated | End current session |
| GET | `/auth/profile` | Authenticated | Get current user profile |

## Users

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/users/me` | Authenticated | Get current user |
| PATCH | `/users/me` | Authenticated | Update current user |
| GET | `/users` | Admin | List users |
| GET | `/users/:id` | Admin | Get user detail |
| PATCH | `/users/:id/role` | Admin | Update user role |

## Organizations

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/organizations` | Public | List verified organizations |
| POST | `/organizations` | Authenticated | Request organization creation |
| GET | `/organizations/:id` | Public | Organization profile |
| PATCH | `/organizations/:id` | Org admin/Admin | Update organization |
| POST | `/organizations/:id/members` | Org admin/Admin | Add member |

## Locations

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/locations/divisions` | Public | List divisions |
| GET | `/locations/districts` | Public | List districts |
| GET | `/locations/districts/:id` | Public | District detail |
| GET | `/locations/upazilas` | Public | List upazilas |
| GET | `/locations/unions` | Public | List unions |
| GET | `/locations/water-bodies` | Public | List water bodies |
| GET | `/locations/pollution-sources` | Public | List known pollution sources |

## Observations

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/observations` | Public | List public observations |
| POST | `/observations` | Authenticated | Submit observation |
| GET | `/observations/:id` | Public | Observation detail |
| PATCH | `/observations/:id` | Owner/Moderator/Admin | Update observation |
| PATCH | `/observations/:id/verification` | Researcher/Moderator/Admin | Update trust level |

## Reports

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/reports` | Public filtered view | List verified/public reports |
| POST | `/reports` | Authenticated | Submit report |
| GET | `/reports/:id` | Public if publishable, otherwise owner/moderator | Report detail |
| PATCH | `/reports/:id` | Owner before review/Moderator/Admin | Update report |
| PATCH | `/reports/:id/status` | Moderator/Admin | Update report status |
| GET | `/reports/moderation/queue` | Moderator/Admin | Review queue |

## Media

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/media` | Authenticated | Create upload record |
| GET | `/media/:id` | Permission-based | Media metadata |
| DELETE | `/media/:id` | Owner/Moderator/Admin | Remove media |

## Datasets

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/datasets` | Public | Public dataset catalog and summaries |
| POST | `/datasets` | Researcher/Admin | Create dataset metadata |
| GET | `/datasets/:id` | Public summary, advanced fields gated | Dataset detail |
| PATCH | `/datasets/:id` | Owner/Admin | Update dataset metadata |
| GET | `/datasets/weather/current` | Public | Current weather summaries |
| GET | `/datasets/air-quality/current` | Public | Current air quality summaries |
| GET | `/datasets/:id/download` | Authenticated/role-gated | Download dataset |
| POST | `/datasets/:id/access-requests` | Authenticated | Request advanced/download/API access |
| POST | `/datasets/:id/contributions` | Researcher/Org Admin/Government/Admin | Contribute dataset update |

## Alerts

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/alerts` | Public | Active/public alerts |
| POST | `/alerts` | Moderator/Government/Admin | Create alert |
| GET | `/alerts/:id` | Public if active/history-visible | Alert detail |
| PATCH | `/alerts/:id` | Moderator/Government/Admin | Update alert |
| POST | `/alerts/:id/publish` | Moderator/Government/Admin | Publish alert |
| POST | `/alerts/:id/cancel` | Moderator/Government/Admin | Cancel alert |

## Biodiversity

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/biodiversity/species` | Public | Species catalog |
| POST | `/biodiversity/species` | Researcher/Admin | Create species record |
| GET | `/biodiversity/species/:id` | Public | Species detail |
| GET | `/biodiversity/habitats` | Public | Habitat catalog |

## Ingestion

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/ingestion/jobs` | Admin | List ingestion jobs |
| POST | `/ingestion/jobs` | Admin | Create ingestion job |
| GET | `/ingestion/jobs/:id` | Admin | Job detail |
| POST | `/ingestion/jobs/:id/retry` | Admin | Retry failed job |
| POST | `/ingestion/providers/openmeteo/sync` | Admin | Trigger OpenMeteo sync |

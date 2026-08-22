# Feature Map

Nature Grid's feature set is organised by domain area. Status reflects what is built and live as of the last progress update — see `docs/progress.md` for detail on each item.

Legend: **Done** | **Partial** | *Planned* | ~~Deferred~~

---

## Foundation

| Feature | Module / App | Status |
| --- | --- | --- |
| Authentication (register, login, JWT, refresh, logout) | `auth` | **Done** |
| Users and role management | `users` | **Done** |
| Organizations | `organizations` | **Done** |
| Administrative geography (divisions, districts, upazilas, unions) | `locations` | **Done** |
| Shared type contracts and route map | `packages/contracts` | **Done** |
| Database schema and migrations | `packages/database` | **Done** |
| Audit trail (`AuditEvent` on all mutations) | `common` | **Done** |
| Security headers, rate limiting, JWT secret validation | `common` | **Done** |
| Automated tests (auth, RBAC, env validation) | `apps/api` | **Done** |
| CI pipeline | `.github/workflows/ci.yml` | **Done** — awaits git remote |
| Production Dockerfiles | `infrastructure/docker` | **Done** |

---

## Environmental Data

| Feature | Module / App | Status |
| --- | --- | --- |
| Weather ingestion — current, hourly, daily (OpenMeteo) | `weather` | **Done** |
| Air quality ingestion — hourly (OpenMeteo) | `weather` | **Done** |
| Urban AQI — station-level (WAQI) | `weather` | *Planned* — free key needed at aqicn.org |
| Dataset catalog with access policy | `datasets` | **Done** |
| Dataset download + access request endpoints | `datasets` | *Planned* |
| Biodiversity — species and occurrence records (GBIF daily sync) | `biodiversity` | **Done** |
| Ingestion job lifecycle (queue, track, retry, audit) | `ingestion` | *Planned* — stub only |
| BMD / FFWC government data | `ingestion` | *Planned* — requires gov access or scraping |

---

## Citizen Engagement

| Feature | Module / App | Status |
| --- | --- | --- |
| Citizen report submission and tracking | `reports` | **Done** |
| Report status workflow (moderation → verified → resolved) | `reports` | **Done** |
| Report comments (public + internal moderator notes) | `reports` | **Done** |
| Report media attachments (URL registration) | `reports` | **Done** |
| Report media upload (file storage) | `reports`, `media` | *Planned* — needs MinIO/S3 |
| Environmental observations with trust levels | `observations` | **Done** |
| Restoration project creation, tracking, and joining | `restoration` | **Done** |
| Structured survey campaigns | — | *Planned* (Phase 7) |
| Community content and campaigns | — | *Planned* — no API module yet |

---

## Alerts and Notifications

| Feature | Module / App | Status |
| --- | --- | --- |
| Environmental alerts (create, severity, lifecycle) | `alerts` | **Done** |
| Alert subscription (district or nationwide, min severity) | `notifications` | **Done** |
| Email delivery on alert activation | `notifications` | **Done** |
| SMS / multi-channel delivery | `notifications` | *Planned* (Phase 7) |
| Government / emergency broadcast integration | `notifications` | *Planned* (Phase 7) |

---

## Platform Intelligence

| Feature | Module / App | Status |
| --- | --- | --- |
| Live platform metrics | `metrics` | **Done** |
| Emissions source tracking | — | *Planned* (Phase 7) |
| Climate forecasting and ML predictions | `data-worker` | *Planned* (Phase 7) |
| Carbon footprint accounting | — | *Planned* (Phase 7) |

---

## Research and Governance

| Feature | Module / App | Status |
| --- | --- | --- |
| Research publication records | — | *Planned* (Phase 7) |
| Dataset access request workflow | `datasets` | **Partial** — schema only; endpoints not built |
| Government and researcher role-gated datasets | `datasets` | **Partial** — access policy enforced on reads; download endpoint not built |

---

## Geospatial

| Feature | Module / App | Status |
| --- | --- | --- |
| District-level point coordinates (lat/lng) | `locations` | **Done** — all 64 districts backfilled |
| PostGIS geometry (polygons, boundaries) | `packages/database` | *Planned* — Docker image ready; no migration yet |
| Satellite / remote sensing ingestion | `data-worker` | *Planned* (Phase 7) — depends on PostGIS + object storage |
| Change detection (deforestation, flooding) | `data-worker` | *Planned* (Phase 7) |

---

## Admin Console

| Feature | App | Status |
| --- | --- | --- |
| Login / logout (MODERATOR + ADMIN only) | `apps/admin` | **Done** |
| Report moderation queue | `apps/admin` | **Done** |
| User management (role change, deactivate) | `apps/admin` | **Done** |
| Alert management (create, cancel, status tabs) | `apps/admin` | **Done** |
| Dataset management (publish toggle, access policy) | `apps/admin` | **Done** |
| Ingestion monitoring dashboard | `apps/admin` | *Planned* — blocked until ingestion module ships |

---

## Public Web (`apps/web`)

| Route | Data Source | Status |
| --- | --- | --- |
| `/` | Weather, metrics, datasets, reports, alerts, biodiversity, restoration | **Done** — all sections live or honest empty state |
| `/data` | `GET /datasets`, `GET /providers` | **Done** |
| `/reports` | `GET /reports` | **Done** — public verified/resolved only; submission form; rows link to detail |
| `/reports/:id` | `GET /reports/:id`, `/comments`, `/media` | **Done** — description, status history, comments, media |
| `/alerts` | `GET /alerts` | **Done** — clickable cards and history rows |
| `/alerts/:id` | `GET /alerts/:id` | **Done** — description, instructions, subscription CTA |
| `/observations` | `GET /observations` | **Done** — submission form; rows link to detail |
| `/observations/:id` | `GET /observations/:id` | **Done** — trust level, description, details grid |
| `/biodiversity` | `GET /biodiversity/species`, `GET /biodiversity/occurrences` | **Done** — name search; rows link to detail |
| `/biodiversity/species/:id` | `GET /biodiversity/species/:id`, `/occurrences?speciesId` | **Done** — taxonomy, per-species occurrences |
| `/restoration` | `GET /restoration/projects` | **Done** — creation form, join action; title links to detail |
| `/restoration/:id` | `GET /restoration/projects/:id` | **Done** — description, details grid, join form |
| `/community` | — | *Planned* — honest empty state; no API module |
| `/profile` | `GET /auth/profile`, `GET /reports/mine`, `GET /observations/mine`, `GET /notifications/subscriptions` | **Done** — live report + observation history; alert subscription management |
| `/login`, `/register` | `POST /auth/login`, `POST /auth/register` | **Done** |

# Feature Map

This document translates the existing Open Nature feature logic into the Nature Grid target architecture.

## Phase 1: Foundation

| Feature | App/API Module | Status |
| --- | --- | --- |
| Public single-page home | `apps/web` | Start first |
| Authentication | `apps/api/src/auth` | Start first |
| Users and roles | `apps/api/src/users` | Start first |
| Administrative locations | `apps/api/src/locations` | Start first |
| Public web shell | `apps/web` | Start first |
| Admin shell | `apps/admin` | Start first |
| Shared contracts | `packages/contracts` | Start first |
| Database schema | `packages/database` | Start first |

## Phase 2: Environmental Core

| Feature | App/API Module | Notes |
| --- | --- | --- |
| Observations | `observations` | Public verified explorer; login-gated contribution |
| Citizen reports | `reports`, `media`, `locations` | Public verified list; login-gated submission and tracking |
| Datasets | `datasets`, `weather` | Public summaries; login-gated advanced access/download/contribution. Weather/AQ summaries are now live, not stubs. |
| Weather + air quality ingestion | `weather` | Done — OpenMeteo current/hourly/daily/AQ, self-contained module (not built under `ingestion`) |
| Ingestion job lifecycle | `ingestion`, `data-worker` | Still a stub — no job tracking/audit trail exists yet, deliberately skipped for weather. Needed before adding a 2nd provider (WAQI, GBIF). |
| Alerts | `alerts` | Disaster and environmental warnings |

## Phase 3: Advanced Domains

| Feature | Module | Notes |
| --- | --- | --- |
| Biodiversity | `biodiversity` | Species, taxa, sightings, habitats |
| Restoration projects | Future `projects` or existing `observations` + `organizations` | Decide after real workflow design |
| Community content | Future `community` | Keep out of core until content workflow is clear |
| Analytics | `datasets`, `data-worker` | Derived metrics and geospatial summaries |

## Frontend Route Direction

| Route | App | Data Source Direction |
| --- | --- | --- |
| `/` | `web` | Public single-page board showing all major platform areas |
| `/data` | `web` | Public dataset summaries; login for advanced views/downloads |
| `/observations` | `web` | Public observation explorer; login to submit |
| `/reports` | `web` | Public verified reports; login to submit/track |
| `/alerts` | `web` | Public alerts and warning map |
| `/profile` | `web` | Login-required user profile and activity |
| `/contribute` | `web` | Login-required contribution hub |
| `/downloads` | `web` | Login/role-gated dataset downloads |
| `/admin` | `admin` | Separate admin app, not a route inside web |

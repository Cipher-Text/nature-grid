# Architecture

Nature Grid is a modular environmental platform. It starts as a monorepo with independently deployable apps and a modular NestJS API, then grows into separate services only when a domain needs its own runtime, scaling profile, or ownership model.

## Primary Apps

| App | Runtime | Responsibility |
| --- | --- | --- |
| `apps/web` | Next.js | Public citizen, researcher, and organization experience |
| `apps/admin` | Next.js | Internal moderation, data operations, alerts, and platform management |
| `apps/api` | NestJS | Core API and business workflows |
| `apps/data-worker` | Python | GIS processing, scientific data jobs, ingestion, and batch tasks |

## Core Data Infrastructure

| Component | Purpose |
| --- | --- |
| PostgreSQL | Primary relational database |
| PostGIS | Geospatial data: points, polygons, administrative boundaries, water bodies |
| Redis | Job queues, rate limiting, and short-lived cache |
| BullMQ | Background job orchestration for Node/Nest workflows |

## Initial API Shape

The API begins as a modular monolith. Modules own their routes, services, persistence access, and contracts.

```text
apps/api/src/
├── auth/
├── users/
├── biodiversity/
├── locations/
├── observations/
├── datasets/
├── organizations/
├── reports/
├── alerts/
├── media/
└── ingestion/
```

## Open Nature Feature Carryover

Open Nature had a strong environmental dashboard UI and a backend centered on authentication, district/location data, weather ingestion, and district-level weather statistics. Nature Grid keeps that logic but maps it into clearer domains:

| Open Nature Area | Nature Grid Domain |
| --- | --- |
| JWT auth and user roles | `auth`, `users`, `organizations` |
| District/division/upazila/union data | `locations` |
| OpenMeteo ingestion | `ingestion`, `datasets`, `alerts` later |
| District weather statistics | `locations`, `datasets` |
| Citizen reports UI | `reports`, `media`, `observations` |
| Disaster alerts UI | `alerts` |
| Restoration projects UI | `observations`, `organizations`, future `projects` module if needed |
| Community content and campaigns UI | future `community` module, not part of API core yet |
| Data hub UI | `datasets`, `biodiversity`, `locations` |

## Boundary Rules

- Frontends call the API through typed contracts from `packages/contracts`.
- Apps do not import each other directly.
- Shared UI belongs in `packages/ui`.
- Shared domain-neutral TypeScript belongs in `packages/shared`.
- Database schema and migration tooling belongs in `packages/database`.
- The Python worker communicates through database records, queues, object storage, or API contracts. It should not import TypeScript app code.
- A domain is extracted from the NestJS API only after operational pressure justifies it.


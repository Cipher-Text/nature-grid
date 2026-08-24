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
| Redis | **Not in use.** `docker-compose.yml` starts a Redis 7 container and `.env` sets `REDIS_URL`, but no Redis client exists in any manifest or source file. Refresh tokens went to Postgres instead. |
| BullMQ | **Not in use.** No queue library is installed; `@nestjs/schedule` cron handles all background work today. |

## API Module Layout

The API is a modular NestJS monolith. Modules own their routes, services, persistence access, and contracts.

```text
apps/api/src/
├── common/
│   ├── decorators/        # @CurrentUser, @Roles, @Public
│   └── guards/            # JwtAuthGuard, RolesGuard
├── database/              # PrismaService (global module)
├── auth/                  # ✓ register, login, profile, JWT strategy
├── users/                 # ✓ list, get, role update (admin-only)
├── organizations/         # ✓ list, get
├── locations/             # ✓ divisions, districts, upazilas, unions + auto-seed
├── providers/             # ✓ list, get
├── datasets/              # ✓ catalog + access policy, auto-seed
├── reports/               # ✓ submit, list (public), status workflow + audit
├── alerts/                # ✓ list (public), create, update + audit
├── observations/          # ✓ CRUD + trust-level workflow
├── biodiversity/          # ✓ species/occurrences + daily GBIF sync
├── restoration/           # ✓ projects + idempotent join workflow
├── metrics/               # ✓ live platform counters
├── media/                 # ~ stub
├── weather/               # ✓ OpenMeteo client, service, scheduler, current/hourly/daily/AQ
├── flood/                 # ✓ OpenMeteo Flood/GloFAS client, daily discharge, scheduler
└── ingestion/             # ✓ provider job tracking for scheduled OpenMeteo + GBIF syncs
```

Legend: ✓ Implemented | ~ Stub only

`weather` and `biodiversity` keep their provider clients and schedulers in their own modules. The shared `ingestion` module now tracks scheduled provider runs as `IngestionJob` records and updates dataset `lastSyncedAt` values on success. Provider-specific details live in `docs/integrations/`.

## Domain Map

| Domain | API Module(s) | What it covers |
| --- | --- | --- |
| Authentication and sessions | `auth` | JWT access tokens, opaque refresh tokens, login/register/logout, audit trail |
| Users and roles | `users` | 6 roles (CITIZEN → ADMIN), role updates, deactivation |
| Organizations | `organizations` | Org records linked to providers and restoration projects |
| Geography | `locations` | 8 divisions, 64 districts (with lat/lng), upazilas, unions — auto-seeded |
| Environmental data | `datasets`, `weather`, `flood` | Dataset catalog, access policy, OpenMeteo weather/AQ and Flood/GloFAS ingestion |
| Biodiversity | `biodiversity` | GBIF species and occurrence records, daily sync |
| Citizen engagement | `reports`, `observations`, `restoration` | Reports (status workflow + comments + media), observations (trust levels), restoration projects |
| Alerts and notifications | `alerts`, `notifications` | Severity-tiered alerts, email delivery, subscription by district/nationwide |
| Platform metrics | `metrics` | Live counters for the public homepage |
| Admin console | `apps/admin` | Moderation, user management, alert creation, dataset publishing, organization membership management |

Advanced domains (emissions tracking, climate forecasting, carbon accounting, research publications, structured surveys, satellite remote sensing) are planned for Phase 7 — see `docs/roadmap.md` and `docs/architecture/feature-map.md`.

## Boundary Rules

- Frontends call the API through typed contracts from `packages/contracts`.
- Apps do not import each other directly.
- Shared UI belongs in `packages/ui`.
- Shared domain-neutral TypeScript belongs in `packages/shared`.
- Database schema and migration tooling belongs in `packages/database`.
- The Python worker communicates through database records, queues, object storage, or API contracts. It should not import TypeScript app code.
- A domain is extracted from the NestJS API only after operational pressure justifies it.

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
└── ingestion/             # ~ stub — generic job tracking, unused by weather
```

Legend: ✓ Implemented | ~ Stub only

`weather` is self-contained (not built under `ingestion/`) — see `docs/ingestion-plan.md` "Implementation status" for why. `ingestion` remains a stub reserved for future generic provider job tracking (WAQI, GBIF, etc.), which weather deliberately does not use.

## Open Nature Feature Carryover

Open Nature had a strong environmental dashboard UI and a backend centered on authentication, district/location data, weather ingestion, and district-level weather statistics. Nature Grid keeps that logic but maps it into clearer domains:

| Open Nature Area | Nature Grid Domain |
| --- | --- |
| JWT auth and user roles | `auth`, `users`, `organizations` |
| District/division/upazila/union data | `locations` (now with lat/lng, backfilled from Open Nature's district registry) |
| OpenMeteo ingestion | `weather` — done; current/hourly/daily/air-quality, also surfaced via `datasets` |
| District weather statistics | `locations`, `datasets` |
| Citizen reports UI | `reports`, `media`, `observations` |
| Disaster alerts UI | `alerts` |
| Restoration projects UI | `observations`, `organizations`, future `projects` module if needed |
| Community content and campaigns UI | future `community` module, not part of API core yet |
| Data hub UI | `datasets`, `biodiversity`, `locations` |

Features from the Open Nature repos that were **not** carried over are scheduled in `docs/roadmap.md` Phase 6c (notification delivery) and Phase 7 (emissions, climate prediction, carbon footprint, research publications, climate surveys, satellite). Anything still deferred sits in `docs/implementation-plan.md` "Deferred / Later Phases".

## Boundary Rules

- Frontends call the API through typed contracts from `packages/contracts`.
- Apps do not import each other directly.
- Shared UI belongs in `packages/ui`.
- Shared domain-neutral TypeScript belongs in `packages/shared`.
- Database schema and migration tooling belongs in `packages/database`.
- The Python worker communicates through database records, queues, object storage, or API contracts. It should not import TypeScript app code.
- A domain is extracted from the NestJS API only after operational pressure justifies it.


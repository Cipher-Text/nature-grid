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
| PostGIS | Docker image provides it, but **not yet enabled** — no migration enables the extension; all geography fields use plain `Float` lat/lng for now |
| Redis | **Not in use.** `docker-compose.yml` starts a Redis 7 container and `.env` sets `REDIS_URL`, but no Redis client exists in any manifest or source file. Refresh tokens went to Postgres instead. |
| BullMQ | **Not in use.** No queue library is installed; `@nestjs/schedule` cron handles all background work today. |

## API Module Layout

The API is a modular NestJS monolith. Modules own their routes, services, persistence access, and contracts.

```text
apps/api/src/
├── common/
│   ├── decorators/        # @CurrentUser, @Roles, @Public, @RequirePermissions
│   └── guards/            # JwtAuthGuard, RolesGuard, PermissionsGuard
├── database/              # PrismaService (global module)
├── seed/                  # ✓ SeedService — dev users + seed org on boot (in AppModule, not its own module)
├── auth/                  # ✓ register, login, profile, JWT strategy
├── users/                 # ✓ list, get, role update, deactivate, reactivate, audit events (admin-only)
├── organizations/         # ✓ list, get, admin CRUD + memberships
├── locations/             # ✓ divisions, districts, upazilas, unions + auto-seed
├── providers/             # ✓ list, get
├── datasets/              # ✓ catalog + access policy + download + access requests, auto-seed
├── reports/               # ✓ submit, list (public), status workflow + comments + media + audit
├── alerts/                # ✓ list (public), create, update + audit
├── observations/          # ✓ CRUD + trust-level workflow
├── biodiversity/          # ✓ species/occurrences + daily GBIF sync
├── restoration/           # ✓ projects + idempotent join workflow
├── metrics/               # ✓ live platform counters
├── permissions/           # ✓ DB-backed permission model, admin grant/revoke endpoints
├── analytics/             # ✓ role-scoped dashboard queries (admin/moderator/government/researcher/orgadmin)
├── media/                 # ~ stub
├── weather/               # ✓ OpenMeteo client, service, scheduler, current/hourly/daily/AQ
├── flood/                 # ✓ OpenMeteo Flood/GloFAS client, daily discharge, scheduler
├── locations/climate/     # ✓ union-level climate pipeline, daily cron, 30d rolling averages
├── ingestion/             # ✓ provider job tracking for scheduled weather + GBIF + flood syncs
└── notifications/         # ✓ AlertSubscription, email delivery via Nodemailer
```

Legend: ✓ Implemented | ~ Stub only

`weather` and `biodiversity` keep their provider clients and schedulers in their own modules. The shared `ingestion` module tracks scheduled provider runs as `IngestionJob` records and updates dataset `lastSyncedAt` values on success. `permissions` owns the `Permission` and `RolePermission` models and is used by `PermissionsGuard` for fine-grained access control. Provider-specific details live in `docs/integrations/`.

## Domain Map

| Domain | API Module(s) | What it covers |
| --- | --- | --- |
| Authentication and sessions | `auth` | JWT access tokens, opaque refresh tokens, login/register/logout, audit trail |
| Users and roles | `users` | 6 roles (CITIZEN → ADMIN), role updates, deactivation, reactivation, audit event listing |
| Organizations | `organizations` | Org records + memberships (ADMIN/MEMBER) linked to providers and restoration projects |
| Geography | `locations`, `locations/climate` | 8 divisions, 64 districts, 494 upazilas, 4,540 unions — auto-seeded; nightly union-level climate pipeline + 30d rolling averages |
| Environmental data | `datasets`, `weather`, `flood` | Dataset catalog, access policy, download enforcement, OpenMeteo weather/AQ and Flood/GloFAS ingestion |
| Biodiversity | `biodiversity` | GBIF species and occurrence records, daily sync |
| Citizen engagement | `reports`, `observations`, `restoration` | Reports (status workflow + comments + media), observations (trust levels), restoration projects |
| Alerts and notifications | `alerts`, `notifications` | Severity-tiered alerts, email delivery, subscription by district/nationwide |
| Platform metrics | `metrics` | Live counters for the public homepage |
| Permissions | `permissions` | DB-backed permission model; fine-grained role grants managed by `PermissionsGuard` |
| Analytics dashboards | `analytics` | Role-scoped aggregated stats for admin, moderator, government, researcher, org admin |
| Admin console | `apps/admin` | Moderation, user management, alert creation, dataset publishing, organization membership management, ingestion monitoring |

Advanced domains (emissions tracking, climate forecasting, carbon accounting, research publications, structured surveys, satellite remote sensing) are planned for Phase 7 — see `docs/roadmap.md` and `docs/architecture/feature-map.md`.

## Boundary Rules

- Frontends call the API through typed contracts from `packages/contracts`.
- Apps do not import each other directly.
- Shared UI belongs in `packages/ui`.
- Shared domain-neutral TypeScript belongs in `packages/shared`.
- Database schema and migration tooling belongs in `packages/database`.
- The Python worker communicates through database records, queues, object storage, or API contracts. It should not import TypeScript app code.
- A domain is extracted from the NestJS API only after operational pressure justifies it.

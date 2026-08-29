# Tech Stack

## Monorepo

| Tool | Use |
| --- | --- |
| pnpm workspaces | Package and dependency workspace management |
| Nx | Task orchestration, affected builds/tests, project graph |
| TypeScript | Shared language for frontend, admin, API, contracts |

## Applications

| App | Stack | Purpose |
| --- | --- | --- |
| `apps/web` | Next.js, React, TypeScript | Public frontend |
| `apps/admin` | Next.js, React, TypeScript | Internal/admin frontend |
| `apps/api` | NestJS, TypeScript | Core backend API |
| `apps/data-worker` | Python | GIS, scientific processing, heavy ingestion jobs |

## Backend

| Tool | Use |
| --- | --- |
| NestJS | Modular API framework |
| PostgreSQL | Primary transactional database |
| PostGIS | Docker image provides it, but **not yet enabled** — no migration enables the extension; all geography fields use plain `Float` lat/lng for now |
| Prisma | Database schema, migrations, typed client |
| `@nestjs/schedule` | Cron scheduling for weather, GBIF, Flood, location-climate, and token cleanup jobs |
| BullMQ (`bullmq`, `@nestjs/bullmq`) | Job queues for async processing: `email` queue (password-reset, email-verification, alert-notification jobs with 4-attempt exponential backoff) and `gamification` queue (badge evaluation, deduped by userId). `BullModule.forRootAsync` in AppModule parses `REDIS_URL` for connection. |
| JWT | API authentication |
| OpenAPI / Swagger | API documentation — available at `/api/docs` when the API is running |

## Frontend

| Tool | Use |
| --- | --- |
| Next.js App Router | Public/admin React apps |
| React | UI composition |
| TypeScript | Type safety |
| Shared `packages/ui` | Reusable design-system components |
| Shared `packages/contracts` | Typed API routes/schemas/client helpers |

## Data Processing

| Tool | Use |
| --- | --- |
| Python | GIS/scientific data processing |
| GeoPandas/Shapely | Planned geospatial processing |
| Rasterio | Planned raster/satellite workflows |
| Celery or queue consumer | Optional later if Python jobs need independent orchestration |

## Deployment Direction

| Service | Deployment |
| --- | --- |
| `web` | Vercel or Docker |
| `admin` | Vercel or Docker, private access |
| `api` | Docker |
| `data-worker` | Docker |
| PostgreSQL/PostGIS | Managed DB or Docker for local |
| Redis | Container runs locally; consumed by BullMQ queues (`email` and `gamification`) via `REDIS_URL` |

Kafka and Kubernetes are explicitly later-stage choices, not part of the initial architecture.

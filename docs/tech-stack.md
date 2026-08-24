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
| PostGIS | Geospatial storage and queries |
| Prisma | Database schema, migrations, typed client |
| `@nestjs/schedule` | Cron scheduling for weather, GBIF, Flood, and token cleanup jobs — the only background-job mechanism actually in use |
| Redis / BullMQ | **Planned, not installed.** A Redis container runs in `docker-compose.yml` and `REDIS_URL` is set, but no client or queue library is in any manifest. Revisit when a job needs retry, concurrency control, or worker isolation. |
| JWT | API authentication |
| OpenAPI | API documentation and frontend contract source |

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
| Redis | Container runs locally but is unused — see the Backend table above |

Kafka and Kubernetes are explicitly later-stage choices, not part of the initial architecture.

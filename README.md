# Nature Grid

Nature Grid is a monorepo for environmental data, biodiversity observations, citizen reports, alerts, and GIS/data-processing workflows.

## Mission and Vision

Mission: make environmental information easier to collect, verify, analyze, and act on.

Vision: build a trusted civic environmental intelligence platform for Bangladesh first, then other regions later.

Full project brief: [docs/project-brief.md](docs/project-brief.md)

## Product Access Model

The public web root `/` is a single-page environmental board available without login. Login is required for contribution, dataset downloads, advanced dataset access, saved preferences, and personal profile workflows.

Access model: [docs/access-model.md](docs/access-model.md)

## Architecture

This repo uses pnpm workspaces and Nx to keep multiple independently deployable applications in one repository.

```text
nature-grid/
├── apps/
│   ├── web/                # Next.js public frontend
│   ├── admin/              # Next.js internal/admin panel
│   ├── api/                # NestJS core API
│   └── data-worker/        # Python GIS/data-processing worker
├── packages/
│   ├── ui/                 # Shared React components
│   ├── contracts/          # Shared API schemas/types
│   ├── database/           # Prisma/Drizzle schema + migrations
│   ├── config/             # ESLint, TSConfig, env helpers
│   └── shared/             # Shared TypeScript utilities
├── infrastructure/
│   ├── docker/
│   ├── nginx/
│   └── terraform/
├── docs/
│   ├── architecture/
│   ├── api/
│   └── decisions/
├── docker-compose.yml
├── pnpm-workspace.yaml
├── nx.json
└── package.json
```

## Application Boundaries

- `apps/web`: public user-facing Next.js application.
- `apps/admin`: internal/admin Next.js application.
- `apps/api`: NestJS modular monolith for core business domains.
- `apps/data-worker`: Python worker for scientific, GIS, ingestion, and batch-processing workloads.

Each app should be independently deployable, even though development happens in one monorepo.

## Initial Backend Modules

The API starts as a modular monolith:

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

Heavy domains can be extracted later while staying in the same monorepo.

## Preferred Stack

- Monorepo: pnpm workspaces + Nx
- Frontend: Next.js
- Admin: Next.js
- Core API: NestJS modular monolith
- Database: PostgreSQL + PostGIS
- Background jobs: Redis + BullMQ
- GIS/scientific processing: Python worker
- Deployment: independent Docker services
- Kafka/Kubernetes: later, only when justified

Detailed stack: [docs/tech-stack.md](docs/tech-stack.md)

## Product Docs

- [Documentation index](docs/README.md)
- [Roles and permissions](docs/roles-and-permissions.md)
- [Access model](docs/access-model.md)
- [Business logic](docs/business-logic.md)
- [User and system flows](docs/flows.md)
- [Roadmap](docs/roadmap.md)
- [Progress](docs/progress.md)
- [Implementation plan](docs/implementation-plan.md)
- [Backend API links](docs/api/backend-api-links.md)

## Getting Started

Install dependencies after the app implementations are added:

```bash
pnpm install
```

Common command shape:

```bash
pnpm dev
pnpm build
pnpm test
```

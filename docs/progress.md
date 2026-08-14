# Progress

Last updated: 2026-08-15 (mocks revised)

## Status Legend

| Status | Meaning |
| --- | --- |
| Done | Completed enough to use as baseline |
| In Progress | Started but not finished |
| Planned | Agreed direction, not started |
| Blocked | Cannot continue without decision/input |

## Overall Status

| Area | Status | Notes |
| --- | --- | --- |
| Monorepo scaffold | Done | `apps`, `packages`, `docs`, `infrastructure`, Nx/pnpm config |
| Public-first product model | Done | Public `/`, login-gated contribution/download/advanced access |
| Documentation baseline | Done | Mission, vision, stack, roles, business logic, flows, API catalog |
| Frontend mocks | Done | All 11 pages revised — proper nav linking, consistent sidebar, design system, trust levels, feed components, admin console, theme reference |
| Backend API scaffold | In Progress | NestJS shell and early controllers/services exist |
| Database schema baseline | In Progress | Prisma baseline exists, domain model needs refinement |
| Real frontend implementation | Planned | Not started beyond minimal shell |
| Auth implementation | Planned | Placeholder only |
| PostGIS/geography implementation | Planned | Needs richer model |
| Provider/provenance model | Planned | Needed before serious dataset work |
| Environmental monitoring model | Planned | Needed before sensor/measurement work |
| Evidence/audit model | Planned | Needed before moderation/alerts production flow |
| Dataset downloads/access policy | Planned | Docs only |
| Data ingestion | Planned | Docs only |

## Completed Files

Project docs:

- `docs/project-brief.md`
- `docs/access-model.md`
- `docs/tech-stack.md`
- `docs/roles-and-permissions.md`
- `docs/business-logic.md`
- `docs/flows.md`
- `docs/roadmap.md`
- `docs/progress.md`
- `docs/implementation-plan.md`

Architecture docs:

- `docs/architecture/README.md`
- `docs/architecture/feature-map.md`
- `docs/architecture/modules.md`
- `docs/architecture/data-model.md`
- `docs/architecture/refactor-plan.md`

API docs:

- `docs/api/README.md`
- `docs/api/initial-api.md`
- `docs/api/backend-api-links.md`

Mocks:

- `mocks/frontend-design/index.html`
- `mocks/frontend-design/data.html`
- `mocks/frontend-design/observations.html`
- `mocks/frontend-design/reports.html`
- `mocks/frontend-design/alerts.html`
- `mocks/frontend-design/biodiversity.html`
- `mocks/frontend-design/restoration.html`
- `mocks/frontend-design/community.html`
- `mocks/frontend-design/profile.html`
- `mocks/frontend-design/admin.html`
- `mocks/frontend-design/theme.html`

## Next Work

1. ~~Review and approve the public-first mock direction.~~ Done.
2. ~~Revise mocks for production-level responsiveness and copy.~~ Done.
3. Add the domain model v2 doc for geography, providers, monitoring, evidence, audit, datasets, and projects.
4. Update backend module scaffold to match the accepted domain model.
5. Implement public web page from approved mock.
6. Implement backend foundation: auth, users, geography, providers, datasets.

## Open Questions

- Should dataset downloads require only login, or role approval per dataset?
- Should government users publish alerts directly, or should alerts always require moderator/admin approval?
- Should restoration be a standalone `projects` module now, or wait until core reports/datasets are stable?
- Should environmental monitoring follow OGC SensorThings closely, or use a simplified internal model first?


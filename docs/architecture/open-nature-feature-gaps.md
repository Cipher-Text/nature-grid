# Open Nature Feature Gaps

Companion to the "Open Nature Feature Carryover" table in [architecture/README.md](README.md) and to [feature-map.md](feature-map.md). Those two documents record what **was** translated from the Open Nature repos into Nature Grid. This one records what **was not** — features that exist in `open-nature`, `open-nature-backend`, `open-nature-backend2`, or `open-nature-frontend` and currently have no counterpart anywhere in Nature Grid: not in the Prisma schema, not in a module, and not in any roadmap, implementation, or ingestion plan.

## How to read this document

This started as a pure gap register with nothing committed. As of 2026-08-20, seven of the eight major gaps have been adopted into `docs/roadmap.md` (one into Phase 6, six into the new Phase 7) and are listed below only as pointers. What remains here is genuinely uncommitted: one major gap deliberately left unscheduled, and the smaller items.

The purpose is unchanged — make sure no prior design work is silently lost as Nature Grid replaces the Open Nature backends, so that adopting or rejecting each item is a recorded decision rather than an omission nobody noticed.

Items already documented elsewhere are deliberately **excluded** from this file to avoid duplicate planning. That includes WAQI, BMD, and FFWC ingestion, flood and cyclone hazards, MinIO storage, PostGIS geometry, weather/AQI daily aggregates, `ReportComment`, `MediaAsset`, `Habitat`, `WaterBody`, `PollutionSource`, `CampaignPost`, `Notification`, rate limiting, API keys, analytics, and IoT sensors — all of which already appear in `docs/roadmap.md`, `docs/implementation-plan.md`, `docs/ingestion-plan.md`, or `architecture/data-model.md` with their own status. Gamification (eco score, badges, achievements, user activity feed) is also excluded: it is already recorded as an open product question in `docs/progress.md`.

Source references below point at the Open Nature repo that defines each feature, so the original design work can be recovered rather than redone.

## Scheduled (no longer gaps)

Seven of the eight original major gaps were adopted into the roadmap on 2026-08-20. They are recorded here only as a pointer — `docs/roadmap.md` is now the source of truth for their scope and sequencing.

| Domain | Now scheduled in |
| --- | --- |
| Notification delivery channels | **Phase 6c** — pulled forward as a production blocker, not a new domain: `Alert` already has an `EMERGENCY` severity but no way to reach anyone |
| Emissions data | Phase 7 |
| Climate prediction / forecasting models | Phase 7 |
| Carbon footprint | Phase 7 |
| Research publication repository | Phase 7 |
| Climate surveys | Phase 7 |
| Satellite / remote sensing | Phase 7 — largest of the set; depends on PostGIS and media storage landing first |

## Remaining Major Gap

One item from the original set was deliberately **not** scheduled.

### Role-specific profile tables

Open Nature splits per-role attributes into `citizen_profiles`, `researcher_profiles`, and `organization_profiles`. Nature Grid uses a flat `User` plus the `UserRole` enum, with `Organization` as a separate entity.

The flat model is likely the better default and this may never need changing, which is why it was not committed to a phase. It stays recorded so a future reader can tell this was a decision rather than an oversight. If role-specific fields are ever required — researcher credentials or affiliation, citizen contact preferences — this is the design to revisit. Note that Phase 6c (notification delivery) needs per-user contact details and verification, which is the first real pressure on the flat model; see also the "Extended user profiles" row in `docs/implementation-plan.md`'s deferred table.

## Smaller Gaps

| Gap | Source | Note |
| --- | --- | --- |
| Agricultural stress monitoring | `NEW_PROJECT.md` module 20 | Soil moisture, crop stress indicators, farmer alerts. Depends on satellite ingestion. |
| Tree-level restoration tracking | `NEW_PROJECT.md` module 22 | GPS-tagged individual trees, growth photos, survival-rate analytics. Nature Grid's `RestorationProject`/`RestorationParticipant` track projects and people, not individual plantings. |
| Backup weather/AQ providers | `NEW_PROJECT.md` modules 3, 6; `API_SOURCE.md` | OpenWeatherMap and AirNow as cross-check/fallback sources. Nature Grid documents WAQI and BMD as next providers but not these. |
| iNaturalist ingestion | `NEW_PROJECT.md` module 13 | Appears in Nature Grid only as a string in `apps/api/src/datasets/seed/catalog.ts`; no ingestion plan. GBIF is done. |
| Feature flags / campaign admin config | `NEW_PROJECT.md` module 30 | Dynamic module toggles and campaign management from the admin app. |
| Mobile-specific API layer | `NEW_PROJECT.md` module 33 | Citizen app and NGO field-survey endpoints. Only relevant if a mobile client is planned. |
| Prometheus metrics | `NEW_PROJECT.md` module 31 | `docs/roadmap.md` Phase 6 lists "observability" generically; no metrics backend is named. |

## Accepted Divergences

Recorded so they are not mistaken for gaps. No action implied.

| Open Nature approach | Nature Grid approach | Rationale |
| --- | --- | --- |
| Keycloak for identity (`NEW_PROJECT.md` module 29) | Own JWT + bcrypt + Postgres-backed rotating refresh tokens | Already built and verified end to end; no external IdP dependency. See `docs/progress.md` "Auth Refresh/Logout". |
| Java / Spring Modulith, 34 planned modules | NestJS modular monolith, 14 modules | Per `decisions/0001-monorepo-with-independent-apps.md`; extract a domain only under operational pressure. |
| Elasticsearch for search | Postgres queries | No search requirement has been scoped yet. |
| Kafka for sensor streams (`NEW_PROJECT.md` module 7) | Not present | `docs/tech-stack.md` mentions Kafka as a future option only. Revisit if real-time sensor ingestion is scoped. |

## Maintaining this document

When a gap here is adopted into the roadmap, replace its detail section with a pointer row under "Scheduled" and let `docs/roadmap.md` own the scope. When a gap is explicitly rejected, move it to "Accepted Divergences" with the reason. When "Remaining Major Gap" and "Smaller Gaps" are both empty, the Open Nature carryover audit is closed and `open-nature`, `open-nature-backend`, and `open-nature-backend2` can be archived without losing design intent.

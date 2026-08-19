# Roles and Permissions

Nature Grid starts with seven product roles. Keep the initial permission model simple, but design it so scopes can be added later.

> **Casing:** role names are written lowercase in this document as product terms. The actual runtime values are **UPPERCASE**, matching the Prisma `UserRole` enum exactly (`CITIZEN`, `RESEARCHER`, `ORGANIZATION_ADMIN`, `GOVERNMENT`, `MODERATOR`, `ADMIN`). Always pass the uppercase form to `@Roles(...)` — a case mismatch between the guard and the enum shipped a bug that rejected every user, including admins (see `docs/progress.md` "Critical RBAC Fix"). `guest` is **not** a Prisma value; unauthenticated requests carry no role at all.

## Roles

| Role | Purpose |
| --- | --- |
| `guest` | Unauthenticated public visitor |
| `citizen` | Individual contributor who submits reports and observations |
| `researcher` | Scientific contributor who can submit/validate datasets and observations |
| `organization_admin` | NGO, institution, or community organization manager |
| `government` | Public agency user who can view operational data and coordinate alerts |
| `moderator` | Reviews reports, media, observations, and community content |
| `admin` | Platform administrator with full operational access |

## Permission Matrix

| Capability | Guest | Citizen | Researcher | Org Admin | Government | Moderator | Admin |
| --- | --- | --- | --- | --- | --- | --- | --- |
| View public single-page board | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| View public dataset summaries | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Download datasets | No | Optional | Yes | Optional | Yes | Yes | Yes |
| Access advanced dataset filters | No | Optional | Yes | Yes | Yes | Yes | Yes |
| Contribute datasets | No | No | Yes | Yes | Optional | Yes | Yes |
| Submit report | No | Yes | Yes | Yes | Yes | Yes | Yes |
| Submit observation | No | Yes | Yes | Yes | Yes | Yes | Yes |
| Upload media | No | Yes | Yes | Yes | Yes | Yes | Yes |
| Validate research observation | No | No | Yes | No | No | No | Yes |
| Manage organization profile | No | No | No | Yes | Optional | No | Yes |
| Review reports | No | No | No | No | Optional | Yes | Yes |
| Issue public alerts | No | No | No | No | Optional | Yes | Yes |
| Manage users and roles | No | No | No | No | No | No | Yes |
| Manage system config | No | No | No | No | No | No | Yes |

## Initial Auth Rules

- Public read endpoints should be allowed for the single-page board, dataset summaries, locations, alerts, verified reports, verified observations, biodiversity highlights, restoration highlights, and community highlights.
- Write endpoints require authentication.
- Dataset downloads, advanced dataset detail, exports, API keys, and dataset contribution require login and may require researcher, organization, government, moderator, or admin role depending on the dataset.
- Moderation endpoints require `moderator` or `admin`.
- Admin endpoints require `admin`.

## Implemented Role Gates

What the code actually enforces today, for cross-checking against the matrix above:

| Endpoint | Roles |
| --- | --- |
| `POST /alerts`, `PATCH /alerts/:id` | `GOVERNMENT`, `MODERATOR`, `ADMIN` |
| `PATCH /reports/:id/status` | `MODERATOR`, `ADMIN` |
| `PATCH /observations/:id/trust` | `RESEARCHER`, `ADMIN` — **not** moderator |
| `POST /restoration/projects` | `ORGANIZATION_ADMIN`, `ADMIN` |
| `PATCH /restoration/projects/:id` | any authenticated user at the guard; creator-or-`ADMIN` enforced inside the service |
| All `/users/*` routes | `ADMIN` (controller-level `@Roles('ADMIN')`) |
| `POST /reports`, `POST /observations`, `POST /restoration/projects/:id/join` | any authenticated user |

Everything else public-facing is `@Public()`. Dataset download/access-request gating is not implemented yet, so the "Download datasets" and "Access advanced dataset filters" rows above are still aspirational.
- Government alert permissions should be configurable per organization or agency before production use.

## Future Scopes

If the role model becomes too coarse, add permission scopes such as:

- `reports:create`
- `reports:review`
- `alerts:create`
- `alerts:publish`
- `datasets:write`
- `observations:validate`
- `organizations:manage`
- `users:manage`
- `system:admin`

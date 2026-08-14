# Roles and Permissions

Nature Grid starts with seven product roles. Keep the initial permission model simple, but design it so scopes can be added later.

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
| Validate research observation | No | No | Yes | Optional | Optional | Yes | Yes |
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

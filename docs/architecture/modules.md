# Modules

## auth

Owns login, token refresh, session lifecycle, and authentication guards.

Initial endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/profile`

## users

Owns user profiles, roles, permissions, and user lifecycle.

Initial roles:

- `citizen`
- `researcher`
- `organization_admin`
- `government`
- `admin`

## organizations

Owns NGOs, research groups, public agencies, and other institutions.

## locations

Owns administrative and geospatial location data.

Initial entities:

- division
- district
- upazila
- union
- water body
- pollution source

## observations

Owns environmental observations submitted by users, researchers, or ingestion systems.

Examples:

- biodiversity sighting
- water quality observation
- air quality observation
- land-use or restoration observation

## reports

Owns citizen issue reports and verification status.

Examples:

- water pollution
- illegal dumping
- deforestation
- wildlife incident
- flooding impact

## media

Owns uploaded evidence and attachments for observations, reports, datasets, and organizations.

## datasets

Owns dataset metadata, catalog records, source references, and derived summaries.

## alerts

Owns disaster and environmental alert records.

Examples:

- flood
- cyclone
- heatwave
- wildfire
- severe air quality

## biodiversity

Owns species, taxa, habitats, and biodiversity-specific records.

## ingestion

Owns provider integrations and ingestion job lifecycle. Heavy GIS/scientific processing can move to `apps/data-worker`.


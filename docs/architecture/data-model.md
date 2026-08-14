# Data Model Direction

Nature Grid should use PostgreSQL with PostGIS as the primary database.

## Core Tables

| Table | Purpose |
| --- | --- |
| `users` | Accounts, identity, roles |
| `organizations` | NGOs, institutions, agencies, research groups |
| `divisions` | Bangladesh division records |
| `districts` | District records with geospatial metadata |
| `upazilas` | Upazila records |
| `unions` | Union records |
| `water_bodies` | Rivers, lakes, wetlands, ponds |
| `pollution_sources` | Known or reported pollution source points |
| `observations` | Environmental observations |
| `reports` | Citizen reports and moderation state |
| `media_assets` | Uploaded photos, videos, files |
| `datasets` | Dataset catalog and metadata |
| `ingestion_jobs` | Provider ingestion job state |
| `alerts` | Disaster/environmental warning records |

## Geospatial Fields

Use PostGIS geometry/geography fields for:

- location points
- administrative boundaries
- water body shapes
- alert zones
- observation/report coordinates

## Status Fields

Use explicit status enums for workflow-heavy records:

- report status: `submitted`, `under_review`, `verified`, `rejected`, `resolved`
- alert status: `draft`, `active`, `expired`, `cancelled`
- ingestion status: `queued`, `running`, `succeeded`, `failed`, `cancelled`


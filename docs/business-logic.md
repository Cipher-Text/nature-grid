# Business Logic

## Domain Principles

- A public-facing record should show trust state clearly: unverified, under review, verified, rejected, resolved, expired.
- Reports and observations are different. Reports describe issues needing action. Observations describe environmental facts or evidence.
- Datasets are source-managed and can be raw, imported, derived, or manually curated.
- Alerts are operational records and need stronger auditability than ordinary content.
- Geospatial context is first-class: most records should be linkable to a point, boundary, district, or water body.

## Citizen Report Logic

### Report Types

- water pollution
- air pollution
- illegal dumping
- deforestation
- wildlife incident
- flood impact
- heat impact
- other environmental issue

### Status Flow

```text
submitted
  -> under_review
  -> verified
  -> resolved

submitted
  -> under_review
  -> rejected
```

### Rules

- A report requires title, type, description, and approximate location.
- Media is optional at first, but reports with media can be prioritized.
- Moderators can change status and add review notes.
- Verified reports can be shown in public maps and analytics.
- Rejected reports remain visible to admins/moderators for audit, but should not appear as public verified records.

## Observation Logic

### Observation Types

- biodiversity sighting
- water quality reading
- air quality reading
- weather impact
- habitat condition
- restoration evidence

### Trust Levels

```text
unverified
community_supported
research_grade
flagged
```

### Rules

- Observations can be citizen-submitted, researcher-submitted, organization-submitted, or system-ingested.
- Research-grade observations require validation by researcher, moderator, or trusted organization workflow.
- Observations can become evidence for reports, datasets, biodiversity records, or restoration projects.

## Dataset Logic

### Dataset Categories

- weather
- air quality
- water
- biodiversity
- reports
- alerts
- geospatial reference

### Dataset Source Types

- external API
- uploaded file
- manual entry
- derived computation
- sensor feed

### Rules

- Every dataset has a source, owner, category, refresh policy, and quality state.
- Imported provider responses should be logged.
- Derived datasets should keep lineage back to source datasets.
- Dataset records exposed to the public must have a publishable status.

## Alert Logic

### Alert Types

- flood
- cyclone
- heatwave
- wildfire
- severe air quality
- severe water pollution
- other environmental warning

### Severity

```text
info
watch
warning
emergency
```

### Status Flow

```text
draft -> active -> expired
draft -> cancelled
active -> cancelled
```

### Rules

- Alerts require type, severity, title, affected location/zone, start time, and source.
- Published alerts must be auditable.
- Emergency alerts should require elevated permission.
- Expired alerts remain searchable in history.

## Ingestion Logic

### Job Status

```text
queued -> running -> succeeded
queued -> running -> failed
queued -> cancelled
```

### Rules

- Provider calls are wrapped in job records.
- Failures store error type and retry metadata.
- External API responses can be cached and logged.
- Heavy geospatial transforms should run in `apps/data-worker`.

## Organization Logic

Organizations can represent NGOs, academic groups, public agencies, community groups, or private environmental partners.

Rules:

- Platform admins manage organizations and memberships through the admin console. A user can belong to multiple organizations through `OrganizationMembership`; each membership is either `ADMIN` or `MEMBER`.
- The `organizations.manage` RBAC permission controls organization management. Organization membership does not currently grant platform management access.
- Organizations can own projects, datasets, campaigns, and observations.
- Sensitive capabilities such as issuing alerts need explicit permission, not only organization membership.

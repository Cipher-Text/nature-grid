# User and System Flows

## Public Discovery Flow

```text
Visitor opens /
  -> sees mission and platform purpose
  -> scans public metrics, map preview, active alerts, verified reports
  -> reviews dataset summaries, biodiversity/restoration/community highlights
  -> chooses a next action:
       - keep browsing public pages
       - sign in to contribute
       - sign in/request access for downloads and advanced datasets
```

## Advanced Dataset Access Flow

```text
Visitor opens public data preview
  -> sees summary charts and catalog metadata
  -> clicks advanced filters, download, export, or API access
  -> system asks for login
  -> role/access policy is checked
  -> approved user can download/export/contribute
  -> denied user can request access or organization/researcher verification
```

## Citizen Report Flow

```text
Visitor opens public Reports
  -> sees verified public reports
  -> clicks Submit Report
  -> system asks for login
  -> citizen opens report form
  -> selects report type
  -> enters description and location
  -> optionally uploads media
  -> submits report
  -> report status becomes submitted
  -> moderator reviews
  -> report becomes verified, rejected, or resolved
  -> verified/resolved records appear in public analytics
```

## Observation Flow

```text
Visitor opens public Observations
  -> sees RESEARCH_GRADE and COMMUNITY observations (FLAGGED hidden by default)
  -> clicks Add Observation
  -> system asks for login
  -> user adds observation type, location, date, and evidence
  -> system stores observation as UNVERIFIED
  -> researcher or admin validates (PATCH /observations/:id/trust)
  -> observation trust level updated to COMMUNITY or RESEARCH_GRADE (audit event written)
  -> observation contributes to maps, biodiversity records, or datasets
```

## Dataset Ingestion Flow

```text
Cron scheduler fires (weather every 15min/2h/12h; GBIF and flood daily/6h)
  -> IngestionService.startJob() creates IngestionJob with RUNNING status
  -> provider HTTP client fetches data (3-attempt retry with fixed backoff)
  -> records upserted into typed tables (no raw JSON stored)
  -> IngestionService.completeJob() marks SUCCEEDED, updates Dataset.lastSyncedAt
  -> on outer failure: IngestionService.failJob() marks FAILED with error message
  -> admin can view job history at GET /ingestion/jobs
```

No job queue or manual trigger exists — scheduled crons serve as periodic retry. `QUEUED` and `CANCELLED` statuses are defined in the schema but not yet written by any code.

## Alert Publishing Flow

```text
Government/moderator/admin creates draft alert
  -> selects type, severity, affected location/zone, source, validity window
  -> reviewer checks message and geography
  -> alert status active
  -> public web displays alert
  -> notification rules run
  -> alert expires or is cancelled
```

## Admin Moderation Flow

```text
Moderator opens admin queue
  -> filters by type, severity, age, location, or assignee
  -> opens item detail
  -> reviews metadata, map, media, and history
  -> updates status and notes
  -> system writes audit entry
```

## Data Worker Flow

```text
API creates ingestion/processing job
  -> queue dispatches work (planned; no queue exists yet — see docs/tech-stack.md)
  -> Python worker receives job or polls job table
  -> worker reads source data
  -> worker performs GIS/scientific processing
  -> worker writes outputs or artifacts
  -> API exposes results through datasets/alerts/observations
```

## Frontend Integration Flow

```text
API route is designed
  -> contract schema is added in packages/contracts
  -> backend implements controller/service
  -> web/admin apps consume typed contract
  -> mock data is removed from the UI module
```

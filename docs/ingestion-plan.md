# Ingestion Plan

Source analysis: `open-nature/apps/backend` (partial implementation, Spring Boot) and `open-nature-backend2` (entity model only). This document captures what was learned and translates it into a concrete NestJS/Prisma plan for nature-grid. No Java code will be ported — logic and patterns will be re-implemented in TypeScript.

---

## What the Java backends established

### open-nature (partially implemented)

| Component | Status | Notes |
| --- | --- | --- |
| OpenMeteo HTTP client | Done | Reactive WebClient, 60+ parameters, 4 fetch types |
| Resilience4j circuit breaker | Done | Sliding window 10, 50% failure threshold, 30s open |
| Retry with backoff | Done | 3 attempts, 2s base, 1.5x multiplier |
| Spring scheduler | Done | Hourly current, 2h hourly/AQ, 12h daily |
| ApiResponseLog entity | Done | All API calls logged with timing, error, correlation ID |
| OpenMeteo data → DB persistence | **Not done** | TODO comment in scheduler — fetch works, save does not |
| District stats aggregation | Partial | Service exists, has no source data yet |
| Air quality → DB persistence | **Not done** | Same issue |

### open-nature-backend2 (entity model only)

Added these well-designed entities not yet in nature-grid:
- `WeatherData` — full time-series per reading (temp, humidity, pressure, wind, precipitation, cloud, UV, AQI, raw JSON)
- `AirQualityData` — PM2.5, PM10, O3, NO2, SO2, CO, CO2, CH4, NH3, health recommendations
- `WeatherAggregate` / `AqiAggregate` — daily rollups per division/district
- `ReportMedia` — media attachments on citizen reports
- `ReportComment` — comments with nested reply support
- `RestorationProject` (SustainabilityProject) — community restoration tracking
- `CitizenProfile`, `ResearcherProfile`, `OrganizationProfile` — extended per-role profiles
- `ClimateAlert` — richer than current Alert (affected area polygon, estimated population, shelter locations)
- `ApiCallLog` — all external API calls tracked

---

## What nature-grid already has (do not duplicate)

| Model | Module | Notes |
| --- | --- | --- |
| `User` | auth / users | Role, passwordHash, isActive, lastLoginAt |
| `Organization` | organizations | Type, isVerified |
| `Provider` | providers | Type, isActive, linked to Organization |
| `Division` | locations | Auto-seeded, 8 divisions |
| `District` | locations | Auto-seeded, 64 districts |
| `Upazila` | locations | Model exists, not seeded |
| `Union` | locations | Model exists, not seeded |
| `Dataset` | datasets | Catalog metadata + access policy, auto-seeded |
| `CitizenReport` | reports | Category, status workflow, lat/lng, status history |
| `ReportStatusEvent` | reports | Per-transition audit row |
| `Alert` | alerts | Severity, status, district link |
| `IngestionJob` | ingestion | Status machine, retry fields, linked to Provider |
| `AuditEvent` | audit | All write operations |

---

## Gaps to fill — Prisma models to add

### Priority 1 — Auth completeness

| Model | Purpose | Key fields |
| --- | --- | --- |
| `RefreshToken` | Store issued refresh tokens for revocation | `token`, `userId`, `expiresAt`, `revokedAt`, `deviceId` |

### Priority 2 — Ingestion data storage

| Model | Purpose | Key fields |
| --- | --- | --- |
| `WeatherReading` | One row per district per fetch | `districtId`, `providerId`, `observedAt`, `tempC`, `feelsLikeC`, `humidityPct`, `pressureHpa`, `windSpeedKmh`, `windDirDeg`, `precipMm`, `cloudCoverPct`, `uvIndex`, `weatherCode`, `rawJson` |
| `AirQualityReading` | One row per district per fetch | `districtId`, `providerId`, `measuredAt`, `aqiEuropean`, `pm25`, `pm10`, `o3`, `no2`, `so2`, `co`, `dominantPollutant`, `rawJson` |
| `WeatherAggregate` | Daily rollup per district | `districtId`, `date`, `avgTempC`, `minTempC`, `maxTempC`, `totalPrecipMm`, `avgHumidityPct`, `avgWindSpeedKmh` |
| `AqiAggregate` | Daily AQI rollup per district | `districtId`, `date`, `avgAqi`, `maxAqi`, `hoursUnhealthy`, `dominantPollutant` |
| `ApiCallLog` | Every external HTTP call | `provider`, `endpoint`, `httpStatus`, `responseMs`, `responseBytes`, `correlationId`, `errorMsg`, `districtId`, `createdAt` |

### Priority 3 — Report enrichment

| Model | Purpose | Key fields |
| --- | --- | --- |
| `ReportMedia` | Attachments on citizen reports | `reportId`, `mediaType`, `url`, `thumbnailUrl`, `caption`, `metadata Json` |
| `ReportComment` | Comments with nested replies | `reportId`, `userId`, `body`, `parentCommentId`, `status` |

### Priority 4 — Extended profiles

| Model | Purpose | Key fields |
| --- | --- | --- |
| `CitizenProfile` | Extended data for citizen users | `userId`, `notificationPrefs Json`, `interestedTopics[]` |
| `ResearcherProfile` | Researcher-specific fields | `userId`, `institution`, `researchAreas[]`, `academicDegree`, `verified` |
| `OrganizationProfile` | Org-specific fields | `userId`, `websiteUrl`, `missionStatement`, `staffCount`, `verified`, `verificationDocs Json` |

### Priority 5 — Restoration and community

| Model | Purpose | Key fields |
| --- | --- | --- |
| `RestorationProject` | Restoration/sustainability projects | `title`, `description`, `category`, `status`, `organizationId`, `districtId`, `startDate`, `endDate`, `fundingGoal`, `fundingRaised`, `impactMetrics Json`, `participantCount` |

---

## Third-party APIs — priority order

| Priority | API | Key | Data | Frequency | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | **OpenMeteo weather** | None | Temperature, humidity, pressure, wind, precipitation, UV, weather code | Every 1h (current), 2h (hourly), 12h (daily) | Free, open-nature already has working client and scheduler. Nature-grid re-implements in NestJS. |
| 1 | **OpenMeteo air quality** | None | PM2.5, PM10, O3, NO2, SO2, CO, European AQI | Every 2h | Same API, different endpoint. `https://air-quality-api.open-meteo.com/v1/air-quality` |
| 2 | **WAQI** | Free (register) | AQI per city station, dominant pollutant, health advice | Every 1h | More station-level granularity than OpenMeteo for urban AQI |
| 3 | **GBIF** | None | Species occurrence records for Bangladesh | Daily | Feed into biodiversity module. Filter by `country=BD`. |
| 4 | **BMD** | Gov approval | Bangladesh Met Dept — local station weather, cyclone bulletins | As available | May require official registration. Start with OpenMeteo for coverage. |
| 5 | **FFWC** | Gov approval | Bangladesh Flood Forecasting Warning Centre — flood alerts | Real-time | `http://www.ffwc.gov.bd`. May need scraping if no public API. |

---

## Implementation design

### NestJS scheduler setup

Use `@nestjs/schedule` (cron-based, zero external dependency) for lightweight fetch jobs. Use BullMQ (already in tech stack) for jobs that need retry, concurrency control, or worker isolation.

```
@nestjs/schedule   → hourly/daily fetch crons (OpenMeteo, GBIF)
BullMQ             → ingestion jobs created via API (admin-triggered, retryable)
```

### HTTP client pattern

Each external API gets its own client class in `apps/api/src/ingestion/clients/`:

```
openmeteo-weather.client.ts   — current + hourly + daily
openmeteo-airquality.client.ts
waqi.client.ts
gbif.client.ts
```

Each client:
- Uses native `fetch` (Node 18+) or `axios` — no reactive wrapper needed in NestJS
- Writes an `ApiCallLog` row for every request (success or failure)
- Throws typed errors that the scheduler catches and logs
- Has a correlation ID generated per request

### Retry / resilience

No Resilience4j equivalent library needed. Implement a simple retry utility:

```typescript
// apps/api/src/ingestion/util/retry.ts
async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3, baseDelayMs = 2000): Promise<T>
```

For circuit-breaker behaviour, track consecutive failures in the `Provider.isActive` flag plus `ApiCallLog` failure counts.

### Scheduler structure (within IngestionModule)

```
ingestion/
  clients/
    openmeteo-weather.client.ts
    openmeteo-airquality.client.ts
    waqi.client.ts
    gbif.client.ts
  schedulers/
    weather.scheduler.ts       — @Cron every 1h, fetches all 64 districts
    air-quality.scheduler.ts   — @Cron every 2h
    biodiversity.scheduler.ts  — @Cron daily
  services/
    weather-ingestion.service.ts
    air-quality-ingestion.service.ts
    ingestion-job.service.ts   — manages IngestionJob records
    api-call-log.service.ts    — writes ApiCallLog rows
  ingestion.module.ts
```

### OpenMeteo parameters to fetch

**Current weather (per district lat/lng):**
```
current=temperature_2m,relative_humidity_2m,apparent_temperature,
        precipitation,weather_code,wind_speed_10m,wind_direction_10m,
        surface_pressure,cloud_cover,uv_index
```

**Hourly (7-day forecast):**
```
hourly=temperature_2m,relative_humidity_2m,precipitation_probability,
       precipitation,weather_code,wind_speed_10m,cloud_cover,uv_index
```

**Daily (14-day):**
```
daily=temperature_2m_max,temperature_2m_min,precipitation_sum,
      wind_speed_10m_max,uv_index_max,weather_code
```

**Air quality (per district):**
```
hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,
       ozone,european_aqi,european_aqi_pm2_5,european_aqi_pm10
```

### District coverage strategy

Fetch weather for all 64 districts using their lat/lng centroid. The `District` table already has `name` — add `lat` and `lng` columns (average centroid per district) as part of the upazila/union seed task. Until then, hardcode centroids for the 8 divisional capitals as a starting point.

---

## What NOT to port from Java backends

| Java component | Reason to skip |
| --- | --- |
| Spring Modulith boundary enforcement | NestJS modules already provide this |
| Liquibase migrations | Prisma handles migrations |
| MapStruct DTO mapping | Use plain TypeScript mapper functions |
| Hibernate Spatial / JTS | PostGIS via Prisma raw queries when needed |
| Spring Security config | Already implemented as NestJS guards |
| JJWT library | Already using `@nestjs/jwt` |
| CompletableFuture async pattern | Native async/await |
| ApplicationEventPublisher | NestJS EventEmitter2 if needed, or direct service calls |
| Resilience4j annotations | Simple retry utility is enough |
| Swagger SpringDoc | @nestjs/swagger when OpenAPI is needed |

---

## Open questions before implementing ingestion

1. **District lat/lng centroids** — need coordinates for all 64 districts to call OpenMeteo. These exist in open-nature-backend2 CSVs. Should they be added to the Upazila/Union seed migration?
2. **WAQI API key** — a free account is needed at `aqicn.org/data-platform/token/`. Should we register one for dev?
3. **Weather data retention** — how long to keep raw `WeatherReading` rows? OpenMeteo hourly data generates 64 × 24 = 1536 rows/day. After aggregation, raw rows can be pruned.
4. **ApiCallLog retention** — open-nature runs daily cleanup at 2 AM. Same pattern needed here.

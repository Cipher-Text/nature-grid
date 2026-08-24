# OpenMeteo Flood

## Status

Not implemented.

Nature Grid currently integrates OpenMeteo forecast and air-quality APIs only. The OpenMeteo Flood API is a separate candidate source for river-discharge forecasts and historical river flow context.

## Provider

| Item | Value |
| --- | --- |
| Provider name | `OpenMeteo` |
| API key | Not required for non-commercial use |
| Official docs | `https://open-meteo.com/en/docs/flood-api` |
| Endpoint | `https://flood-api.open-meteo.com/v1/flood` |
| Current client | None |
| Current scheduler | None |
| Current storage | None |

## Available Data

The Flood API accepts latitude and longitude and returns daily river-discharge data from the largest river in a 5 km area around the coordinate.

### Daily Flood Variables

Available fields include:

- `river_discharge`
- `river_discharge_mean`
- `river_discharge_median`
- `river_discharge_max`
- `river_discharge_min`
- `river_discharge_p25`
- `river_discharge_p75`

The discharge unit is `m3/s`. Ensemble statistics are available for forecasts, not consolidated historical data.

## Forecast Windows

OpenMeteo documents:

- Default forecast window: 92 days, shown as about 3 months in the UI.
- Maximum forecast window through the API parameter table: 210 days.
- Source coverage from 1984-01-01 through roughly 7 months of forecast.

## Source Notes

- Data source is GloFAS, the Global Flood Awareness System.
- Default model is GloFAS v4 seamless data.
- Spatial resolution is about 5 km for GloFAS v4.
- OpenMeteo warns that the closest river may not be selected correctly at 5 km resolution.
- OpenMeteo suggests varying coordinates by about 0.1 degrees to find a more representative river-discharge point.
- This API gives simulated river discharge, not official Bangladesh flood warnings.

## Possible Nature Grid Use

Candidate use cases:

- River-discharge context for alerts and reports.
- Flood-risk trend panels for river-adjacent districts.
- Historical river-flow context for restoration and water-body monitoring.
- A supporting source alongside official FFWC data if FFWC is later integrated.

## Implementation Needed

- Add a flood or hydrology schema; current `Alert` records and weather tables do not store river-discharge time series.
- Decide monitoring coordinates for Bangladesh rivers instead of using district centroids blindly.
- Add an OpenMeteo flood client under `apps/api/src/weather/`, `apps/api/src/alerts/`, or a new `hydrology` module.
- Add scheduler and ingestion job tracking.
- Add public API routes and dataset catalog entries.
- Keep official alert authority separate from model-derived discharge data.

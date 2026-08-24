# OpenMeteo Climate

## Status

Not implemented.

Nature Grid currently integrates OpenMeteo forecast and air-quality APIs only. The OpenMeteo Climate API is a separate candidate source for long-range climate model data, climate-change projections, and historical model validation data.

## Provider

| Item | Value |
| --- | --- |
| Provider name | `OpenMeteo` |
| API key | Not required for non-commercial use |
| Official docs | `https://open-meteo.com/en/docs/climate-api` |
| Endpoint | `https://climate-api.open-meteo.com/v1/climate` |
| Current client | None |
| Current scheduler | None |
| Current storage | None |

## Available Data

The Climate API accepts latitude, longitude, a date interval, selected climate models, and daily variables. It returns daily aggregated climate data from regional downscaled climate models.

### Daily Climate Variables

Important fields available from OpenMeteo include:

- `temperature_2m_mean`
- `temperature_2m_max`
- `temperature_2m_min`
- `wind_speed_10m_mean`
- `wind_speed_10m_max`
- `cloud_cover_mean`
- `shortwave_radiation_sum`
- `relative_humidity_2m_mean`
- `relative_humidity_2m_max`
- `relative_humidity_2m_min`
- `dewpoint_2m_mean`
- `dewpoint_2m_max`
- `dewpoint_2m_min`
- `precipitation_sum`
- `rain_sum`
- `snowfall_sum`
- `pressure_msl_mean`
- `soil_moisture_0_to_10cm_mean`
- `et0_fao_evapotranspiration`

## Climate Models

The API supports multiple climate models:

- `CMCC_CM2_VHR4`
- `FGOALS_f3_H`
- `HiRAM_SIT_HR`
- `MRI_AGCM3_2_S`
- `EC_Earth3P_HR`
- `MPI_ESM1_2_XR`
- `NICAM16_8S`

Not every model supports every variable. OpenMeteo documents soil moisture as available only for selected models.

## Time Range

OpenMeteo documents climate data from `1950-01-01` to `2050-01-01` and recommends using the full `1950` to `2050` range for climate analysis. Projections beyond 2050 are not part of this API.

## Source Notes

- Data is based on HighResMIP climate models from the CMIP6 project.
- OpenMeteo downscales data to about 10 km resolution and applies ERA5-Land bias correction by default.
- Historical years in this API are model validation data, not measured station observations.
- Future projections are close to RCP8.5 within CMIP6, according to OpenMeteo.
- Model uncertainty is significant; OpenMeteo recommends running analyses across multiple models and evaluating performance.
- Returned latitude and longitude identify the selected grid cell, which may differ from the requested coordinate.

## Possible Nature Grid Use

Candidate use cases:

- Long-term climate-risk pages for districts.
- Heat, rainfall, drought, and humidity trend datasets.
- Restoration project planning context.
- Climate-change education and public dashboards.
- Agriculture and public-health risk analysis when combined with local reports and observations.

## Implementation Needed

- Add climate schema or dataset models; current weather tables are operational forecasts and are not designed for multi-model climate projections.
- Decide storage granularity: district centroids, divisions, selected ecological zones, or user-requested locations.
- Decide whether to store every model separately or derived aggregates only.
- Add an OpenMeteo climate client under `apps/api/src/weather/` or a new `climate` module.
- Add batch ingestion rather than frequent cron; the dataset is long-range and heavy compared with current weather.
- Add public API routes and dataset catalog entries.

# OpenMeteo Satellite Radiation

## Status

Not implemented.

Nature Grid currently integrates OpenMeteo forecast and air-quality APIs only. The OpenMeteo Satellite Radiation API is a separate candidate source for solar irradiance, sunshine, and radiation monitoring.

## Provider

| Item | Value |
| --- | --- |
| Provider name | `OpenMeteo` |
| API key | Not required for non-commercial use |
| Official docs | `https://open-meteo.com/en/docs/satellite-radiation-api` |
| Endpoint | `https://satellite-api.open-meteo.com/v1/satellite` |
| Current client | None |
| Current scheduler | None |
| Current storage | None |

## Available Data

The Satellite Radiation API accepts latitude and longitude and returns satellite-derived solar radiation data. OpenMeteo documents one day as the default response window.

### Hourly Radiation Variables

Important fields available from OpenMeteo include:

- `shortwave_radiation`
- `direct_radiation`
- `diffuse_radiation`
- `direct_normal_irradiance`
- `global_tilted_irradiance`
- `terrestrial_radiation`
- `shortwave_radiation_instant`
- `direct_radiation_instant`
- `diffuse_radiation_instant`
- `direct_normal_irradiance_instant`
- `global_tilted_irradiance_instant`
- `terrestrial_radiation_instant`
- `shortwave_radiation_clear_sky`
- `shortwave_radiation_clear_sky_instant`

Additional options include:

- `is_day`
- `sunshine_duration`

### Daily Radiation Variables

Important daily fields include:

- `sunrise`
- `sunset`
- `daylight_duration`
- `sunshine_duration`
- `shortwave_radiation_sum`

## Source Notes

- Radiation values are documented in `W/m2`.
- Most default radiation values are backward averages over the preceding hour.
- `*_instant` fields represent instantaneous radiation values.
- `global_tilted_irradiance` requires tilt and azimuth parameters.
- OpenMeteo exposes satellite/model selection. Bangladesh should be covered by India/Asia sources such as JMA JAXA Himawari and EUMETSAT IODC, but source selection should be verified with live API calls before implementation.
- OpenMeteo says satellite data can be available in 10, 15, or 30 minute steps, while the API returns hourly data by default unless native temporal resolution is requested.

## Possible Nature Grid Use

Candidate use cases:

- Solar exposure context for restoration and urban heat reporting.
- Renewable-energy and solar-potential datasets.
- Agricultural drought or vegetation stress context when combined with rainfall and temperature.
- Public dashboard cards for daylight, sunshine duration, and radiation intensity.

## Implementation Needed

- Add a radiation schema or dataset model; current weather tables only store `uv_index_max` in daily weather and do not store solar irradiance time series.
- Add an OpenMeteo satellite radiation client under `apps/api/src/weather/` or a new `radiation` module.
- Decide fetch coordinates: all district centroids, selected monitoring locations, or restoration project sites.
- Add scheduler and ingestion job tracking.
- Add public API routes and dataset catalog entries.

# OpenMeteo Marine Weather

## Status

Not implemented.

Nature Grid currently integrates OpenMeteo forecast and air-quality APIs only. The OpenMeteo Marine Weather API is a separate candidate source for coastal and offshore conditions, especially for Bangladesh coastal districts and Bay of Bengal monitoring.

## Provider

| Item | Value |
| --- | --- |
| Provider name | `OpenMeteo` |
| API key | Not required for non-commercial use |
| Official docs | `https://open-meteo.com/en/docs/marine-weather-api` |
| Endpoint | `https://marine-api.open-meteo.com/v1/marine` |
| Current client | None |
| Current scheduler | None |
| Current storage | None |

## Available Data

The Marine Weather API accepts latitude and longitude and returns marine forecasts for sea grid cells. It supports hourly, daily, and current variables.

### Hourly Marine Variables

Important fields available from OpenMeteo include:

- `wave_height`
- `wave_direction`
- `wave_period`
- `wave_peak_period`
- `wind_wave_height`
- `wind_wave_direction`
- `wind_wave_period`
- `wind_wave_peak_period`
- `swell_wave_height`
- `swell_wave_direction`
- `swell_wave_period`
- `swell_wave_peak_period`
- `secondary_swell_wave_height`
- `secondary_swell_wave_period`
- `secondary_swell_wave_direction`
- `tertiary_swell_wave_height`
- `tertiary_swell_wave_period`
- `tertiary_swell_wave_direction`
- `sea_level_height_msl`
- `sea_surface_temperature`
- `ocean_current_velocity`
- `ocean_current_direction`
- `invert_barometer_height`

### Daily Marine Variables

Important daily aggregations include:

- `wave_height_max`
- `wave_direction_dominant`
- `wave_period_max`
- `wind_wave_height_max`
- `wind_wave_direction_dominant`
- `wind_wave_period_max`
- `wind_wave_peak_period_max`
- `swell_wave_height_max`
- `swell_wave_direction_dominant`
- `swell_wave_period_max`
- `swell_wave_peak_period_max`

## Forecast Windows

OpenMeteo documents marine forecasts as 7 days by default, with up to 16 days available in the page overview. The API parameter table currently lists `forecast_days` as up to 8 days. Treat this as provider documentation ambiguity and verify with live API calls before implementation.

## Source Notes

- The API defaults to sea-oriented grid-cell selection.
- Tides and ocean currents are modelled at roughly 0.08 degree resolution.
- OpenMeteo warns that tide and ocean-current accuracy is limited in coastal areas.
- OpenMeteo states marine data is not suitable for coastal navigation and does not replace nautical references.
- Returned latitude and longitude identify the selected marine grid cell, which may differ from the requested coordinate.

## Possible Nature Grid Use

Candidate use cases:

- Coastal hazard context for districts such as Cox's Bazar, Chattogram, Khulna, Satkhira, Barguna, Patuakhali, Bhola, and Noakhali.
- Bay of Bengal wave-height and swell monitoring.
- Sea-surface temperature context for marine biodiversity or fisheries-adjacent reporting.
- Coastal restoration project risk context.

## Implementation Needed

- Add a marine schema or dataset model; current weather tables do not fit wave/current/SST fields.
- Add an OpenMeteo marine client under `apps/api/src/weather/` or a new `marine` module.
- Decide whether marine coordinates should be district centroids, coastal points, ports, offshore grid points, or water-body locations.
- Add scheduler and ingestion job tracking.
- Add public API routes and dataset catalog entries.

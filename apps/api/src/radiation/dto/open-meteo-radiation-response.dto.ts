/**
 * Raw response from the OpenMeteo Satellite Archive API.
 * Native temporal resolution: 10-minute intervals.
 * shortwave_radiation values are in W/m².
 */
export interface SatelliteArchiveRawResponse {
  latitude:  number;
  longitude: number;
  hourly: {
    time:                 string[];             // ISO timestamps e.g. '2026-08-21T00:10'
    shortwave_radiation:  (number | null)[];    // W/m²
  };
}

/**
 * Normalised daily shape returned by RadiationOpenMeteoClient.fetch() —
 * the service and scheduler only see this interface.
 * shortwave_radiation_sum is MJ/m² (aggregated from raw W/m² archive samples).
 * sunshine_duration and daylight_duration are not provided by the satellite
 * archive API; they are stored as null.
 */
export interface OpenMeteoRadiationResponse {
  latitude:  number;
  longitude: number;
  daily: {
    time:                    string[];
    shortwave_radiation_sum: (number | null)[];
    sunshine_duration?:      (number | null)[];   // always undefined from this client
    daylight_duration?:      (number | null)[];   // always undefined from this client
  };
}

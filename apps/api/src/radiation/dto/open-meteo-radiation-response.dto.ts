/** Shapes for the subset of the OpenMeteo Satellite Radiation API response this module consumes. */

export interface OpenMeteoRadiationResponse {
  latitude: number;
  longitude: number;
  daily: {
    time: string[];
    shortwave_radiation_sum?: (number | null)[];
    sunshine_duration?: (number | null)[];
    daylight_duration?: (number | null)[];
  };
}

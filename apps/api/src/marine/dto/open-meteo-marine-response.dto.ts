/** Shapes for the subset of the OpenMeteo Marine Weather API response this module consumes. */

export interface OpenMeteoMarineResponse {
  latitude: number;
  longitude: number;
  daily: {
    time: string[];
    wave_height_max?: (number | null)[];
    wave_direction_dominant?: (number | null)[];
    wave_period_max?: (number | null)[];
    wind_wave_height_max?: (number | null)[];
    wind_wave_direction_dominant?: (number | null)[];
    wind_wave_period_max?: (number | null)[];
    wind_wave_peak_period_max?: (number | null)[];
    swell_wave_height_max?: (number | null)[];
    swell_wave_direction_dominant?: (number | null)[];
    swell_wave_period_max?: (number | null)[];
    swell_wave_peak_period_max?: (number | null)[];
  };
}

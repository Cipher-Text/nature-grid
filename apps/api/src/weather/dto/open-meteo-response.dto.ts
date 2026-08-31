/** Shapes for the subset of the OpenMeteo API responses this module consumes. */

export interface OpenMeteoUnionWeatherResponse {
  daily: {
    time: string[];
    temperature_2m_max?: (number | null)[];
    temperature_2m_min?: (number | null)[];
    precipitation_sum?: (number | null)[];
    wind_speed_10m_max?: (number | null)[];
    uv_index_max?: (number | null)[];
  };
  hourly: {
    time: string[];
    relative_humidity_2m?: (number | null)[];
    cloud_cover?: (number | null)[];
  };
}

export interface OpenMeteoUnionAirQualityResponse {
  hourly: {
    time: string[];
    pm10?: (number | null)[];
    pm2_5?: (number | null)[];
    ozone?: (number | null)[];
    uv_index?: (number | null)[];
  };
}

export interface OpenMeteoCurrentResponse {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    temperature_2m?: number;
    relative_humidity_2m?: number;
    apparent_temperature?: number;
    is_day?: number;
    wind_speed_10m?: number;
    wind_gusts_10m?: number;
    wind_direction_10m?: number;
    surface_pressure?: number;
    precipitation?: number;
    weather_code?: number;
    cloud_cover?: number;
  };
}

export interface OpenMeteoHourlyResponse {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    temperature_2m?: number[];
    relative_humidity_2m?: number[];
    apparent_temperature?: number[];
    precipitation_probability?: number[];
    precipitation?: number[];
    weather_code?: number[];
    wind_speed_10m?: number[];
    wind_gusts_10m?: number[];
    wind_direction_10m?: number[];
    cloud_cover?: number[];
  };
}

export interface OpenMeteoDailyResponse {
  latitude: number;
  longitude: number;
  daily: {
    time: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    apparent_temperature_max?: number[];
    apparent_temperature_min?: number[];
    precipitation_sum?: number[];
    precipitation_probability_max?: number[];
    wind_speed_10m_max?: number[];
    uv_index_max?: number[];
    sunrise?: string[];
    sunset?: string[];
  };
}

export interface OpenMeteoAirQualityResponse {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    pm10?: number[];
    pm2_5?: number[];
    carbon_monoxide?: number[];
    nitrogen_dioxide?: number[];
    sulphur_dioxide?: number[];
    ozone?: number[];
    uv_index?: number[];
  };
}

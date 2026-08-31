import { Injectable, Logger } from '@nestjs/common';
import {
  OpenMeteoAirQualityResponse,
  OpenMeteoCurrentResponse,
  OpenMeteoDailyResponse,
  OpenMeteoHourlyResponse,
  OpenMeteoUnionAirQualityResponse,
  OpenMeteoUnionWeatherResponse,
} from './dto/open-meteo-response.dto';

const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

const CURRENT_PARAMS =
  'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,wind_gusts_10m,wind_direction_10m,surface_pressure,precipitation,weather_code,cloud_cover';
const HOURLY_PARAMS =
  'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m,cloud_cover';
const DAILY_PARAMS =
  'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset';
const AIR_QUALITY_PARAMS =
  'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,uv_index';

const HOURLY_FORECAST_DAYS = 3;
const DAILY_FORECAST_DAYS = 7;
const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [500, 1500];
const FETCH_TIMEOUT_MS = 30_000;

@Injectable()
export class WeatherOpenMeteoClient {
  private readonly logger = new Logger(WeatherOpenMeteoClient.name);

  fetchCurrent(lat: number, lng: number): Promise<OpenMeteoCurrentResponse> {
    const url = `${FORECAST_BASE_URL}?latitude=${lat}&longitude=${lng}&current=${CURRENT_PARAMS}&timezone=auto`;
    return this.getJson(url);
  }

  fetchHourly(lat: number, lng: number): Promise<OpenMeteoHourlyResponse> {
    const url = `${FORECAST_BASE_URL}?latitude=${lat}&longitude=${lng}&hourly=${HOURLY_PARAMS}&forecast_days=${HOURLY_FORECAST_DAYS}&timezone=auto`;
    return this.getJson(url);
  }

  fetchDaily(lat: number, lng: number): Promise<OpenMeteoDailyResponse> {
    const url = `${FORECAST_BASE_URL}?latitude=${lat}&longitude=${lng}&daily=${DAILY_PARAMS}&forecast_days=${DAILY_FORECAST_DAYS}&timezone=auto`;
    return this.getJson(url);
  }

  fetchAirQuality(lat: number, lng: number): Promise<OpenMeteoAirQualityResponse> {
    const url = `${AIR_QUALITY_BASE_URL}?latitude=${lat}&longitude=${lng}&hourly=${AIR_QUALITY_PARAMS}&forecast_days=${HOURLY_FORECAST_DAYS}&timezone=auto`;
    return this.getJson(url);
  }

  /**
   * Fetch today's daily summary + hourly humidity/cloud for a batch of up to 1,000 unions.
   * Pass comma-separated latitude and longitude strings.
   * OpenMeteo returns an array when multiple coords are supplied, a single object for one.
   */
  fetchUnionWeatherBatch(
    lats: string,
    lngs: string,
  ): Promise<OpenMeteoUnionWeatherResponse | OpenMeteoUnionWeatherResponse[]> {
    const url =
      `${FORECAST_BASE_URL}?latitude=${lats}&longitude=${lngs}` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max` +
      `&hourly=relative_humidity_2m,cloud_cover` +
      `&forecast_days=1&timezone=auto`;
    return this.getJson(url);
  }

  /**
   * Fetch today's hourly air quality for a batch of up to 1,000 unions.
   * Pass comma-separated latitude and longitude strings.
   */
  fetchUnionAirQualityBatch(
    lats: string,
    lngs: string,
  ): Promise<OpenMeteoUnionAirQualityResponse | OpenMeteoUnionAirQualityResponse[]> {
    const url =
      `${AIR_QUALITY_BASE_URL}?latitude=${lats}&longitude=${lngs}` +
      `&hourly=pm10,pm2_5,ozone,uv_index` +
      `&forecast_days=1&timezone=auto`;
    return this.getJson(url);
  }

  private async getJson<T>(url: string): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        if (!response.ok) {
          throw new Error(`OpenMeteo request failed: ${response.status} ${response.statusText}`);
        }
        return (await response.json()) as T;
      } catch (err) {
        clearTimeout(timer);
        lastError = err;
        if (attempt < MAX_ATTEMPTS - 1) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
        }
      }
    }
    this.logger.error(`Giving up on ${url} after ${MAX_ATTEMPTS} attempts: ${String(lastError)}`);
    throw lastError;
  }
}

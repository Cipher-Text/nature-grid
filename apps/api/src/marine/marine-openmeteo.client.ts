import { Injectable, Logger } from '@nestjs/common';
import { OpenMeteoMarineResponse } from './dto/open-meteo-marine-response.dto';

const MARINE_BASE_URL = 'https://marine-api.open-meteo.com/v1/marine';
const DAILY_PARAMS = [
  'wave_height_max',
  'wave_direction_dominant',
  'wave_period_max',
  'wind_wave_height_max',
  'wind_wave_direction_dominant',
  'wind_wave_period_max',
  'wind_wave_peak_period_max',
  'swell_wave_height_max',
  'swell_wave_direction_dominant',
  'swell_wave_period_max',
  'swell_wave_peak_period_max',
].join(',');
const FORECAST_DAYS = 7;
const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [500, 1500];
const FETCH_TIMEOUT_MS = 30_000;

@Injectable()
export class MarineOpenMeteoClient {
  private readonly logger = new Logger(MarineOpenMeteoClient.name);

  fetch(lat: number, lng: number): Promise<OpenMeteoMarineResponse> {
    const url =
      `${MARINE_BASE_URL}?latitude=${lat}&longitude=${lng}` +
      `&daily=${DAILY_PARAMS}&forecast_days=${FORECAST_DAYS}&timezone=UTC`;
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
          throw new Error(
            `OpenMeteo Marine request failed: ${response.status} ${response.statusText}`,
          );
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

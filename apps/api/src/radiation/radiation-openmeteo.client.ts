import { Injectable, Logger } from '@nestjs/common';
import { OpenMeteoRadiationResponse } from './dto/open-meteo-radiation-response.dto';

const SATELLITE_BASE_URL = 'https://satellite-api.open-meteo.com/v1/satellite';
const DAILY_PARAMS = 'shortwave_radiation_sum,sunshine_duration,daylight_duration';
const FORECAST_DAYS = 7;
const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [500, 1500];
const FETCH_TIMEOUT_MS = 30_000;

@Injectable()
export class RadiationOpenMeteoClient {
  private readonly logger = new Logger(RadiationOpenMeteoClient.name);

  fetch(lat: number, lng: number): Promise<OpenMeteoRadiationResponse> {
    const url =
      `${SATELLITE_BASE_URL}?latitude=${lat}&longitude=${lng}` +
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
            `OpenMeteo Satellite request failed: ${response.status} ${response.statusText}`,
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

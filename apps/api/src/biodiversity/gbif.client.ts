import { Injectable, Logger } from '@nestjs/common';
import { GbifOccurrenceSearchResponse } from './dto/gbif-response.dto';

const OCCURRENCE_SEARCH_URL = 'https://api.gbif.org/v1/occurrence/search';
const PAGE_SIZE = 300;
const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [500, 1500];

@Injectable()
export class GbifClient {
  private readonly logger = new Logger(GbifClient.name);

  fetchOccurrencePage(offset: number): Promise<GbifOccurrenceSearchResponse> {
    const url = `${OCCURRENCE_SEARCH_URL}?country=BD&hasCoordinate=true&limit=${PAGE_SIZE}&offset=${offset}`;
    return this.getJson<GbifOccurrenceSearchResponse>(url);
  }

  private async getJson<T>(url: string): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`GBIF request failed: ${response.status} ${response.statusText}`);
        }
        return (await response.json()) as T;
      } catch (err) {
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

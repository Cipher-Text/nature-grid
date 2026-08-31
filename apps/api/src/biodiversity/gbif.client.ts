import { Injectable, Logger } from '@nestjs/common';
import { GbifOccurrenceSearchResponse } from './dto/gbif-response.dto';

const OCCURRENCE_SEARCH_URL = 'https://api.gbif.org/v1/occurrence/search';
const PAGE_SIZE = 300;
const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [500, 1500];
const FETCH_TIMEOUT_MS = 30_000;

@Injectable()
export class GbifClient {
  private readonly logger = new Logger(GbifClient.name);

  /**
   * Fetch one page of Bangladesh occurrences from GBIF.
   *
   * Quality filters applied on every request:
   * - `hasCoordinate=true` — coordinates required
   * - `hasGeospatialIssues=false` — excludes records GBIF has flagged with
   *   coordinate issues (e.g. centroid of country, swapped lat/lng, etc.)
   *
   * @param offset  Pagination offset
   * @param sinceDate  ISO date string (YYYY-MM-DD). When provided, restricts
   *                   to records last interpreted by GBIF on or after this date.
   *                   Omit for the initial full-bootstrap fetch.
   */
  fetchOccurrencePage(offset: number, sinceDate?: string): Promise<GbifOccurrenceSearchResponse> {
    const today = new Date().toISOString().slice(0, 10);
    const dateFilter = sinceDate ? `&lastInterpreted=${sinceDate},${today}` : '';
    const url =
      `${OCCURRENCE_SEARCH_URL}?country=BD` +
      `&hasCoordinate=true` +
      `&hasGeospatialIssues=false` +
      `&limit=${PAGE_SIZE}&offset=${offset}${dateFilter}`;
    return this.getJson<GbifOccurrenceSearchResponse>(url);
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
          throw new Error(`GBIF request failed: ${response.status} ${response.statusText}`);
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

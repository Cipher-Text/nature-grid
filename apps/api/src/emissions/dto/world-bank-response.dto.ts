export interface WorldBankPageMeta {
  page: number;
  pages: number;
  per_page: number;
  total: number;
  sourceid: string;
  lastupdated: string;
}

export interface WorldBankRecord {
  indicator: { id: string; value: string };
  country: { id: string; value: string };
  countryiso3code: string;
  date: string; // year as string, e.g. "2024"
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

/** Raw response shape: [metadata, records[]] */
export type WorldBankResponse = [WorldBankPageMeta, WorldBankRecord[]];

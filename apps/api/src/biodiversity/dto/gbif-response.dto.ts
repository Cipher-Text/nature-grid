export interface GbifOccurrenceRecord {
  /** GBIF's occurrence key can exceed Int32 range — treat as a raw number, cast to BigInt before persisting. */
  key: number;
  taxonKey?: number;
  scientificName?: string;
  species?: string;
  vernacularName?: string;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  decimalLatitude?: number;
  decimalLongitude?: number;
  eventDate?: string;
  recordedBy?: string;
  basisOfRecord?: string;
  media?: { identifier?: string }[];
}

export interface GbifOccurrenceSearchResponse {
  results: GbifOccurrenceRecord[];
  count: number;
  endOfRecords: boolean;
}

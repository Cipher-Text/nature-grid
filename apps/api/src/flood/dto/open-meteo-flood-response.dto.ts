export interface OpenMeteoFloodResponse {
  latitude: number;
  longitude: number;
  daily?: {
    time: string[];
    river_discharge?: Array<number | null>;
    river_discharge_mean?: Array<number | null>;
    river_discharge_median?: Array<number | null>;
    river_discharge_max?: Array<number | null>;
    river_discharge_min?: Array<number | null>;
    river_discharge_p25?: Array<number | null>;
    river_discharge_p75?: Array<number | null>;
  };
}

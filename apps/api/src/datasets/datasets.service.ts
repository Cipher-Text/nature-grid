import { Injectable } from '@nestjs/common';

const datasets = [
  {
    id: 'openmeteo-weather',
    name: 'OpenMeteo Weather',
    category: 'weather',
    source: 'openmeteo',
  },
];

@Injectable()
export class DatasetsService {
  list() {
    return datasets;
  }

  getById(id: string) {
    return datasets.find((dataset) => dataset.id === id) ?? null;
  }

  currentWeather() {
    return {
      source: 'openmeteo',
      status: 'placeholder',
      records: [],
    };
  }

  currentAirQuality() {
    return {
      source: 'openmeteo',
      status: 'placeholder',
      records: [],
    };
  }
}


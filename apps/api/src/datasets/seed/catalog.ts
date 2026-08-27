import { DatasetCategory, DatasetAccessPolicy } from '@prisma/client';

export const SEED_DATASETS: {
  name: string;
  category: DatasetCategory;
  accessPolicy: DatasetAccessPolicy;
  source: string;
  description: string;
}[] = [
  {
    name: 'OpenMeteo Weather',
    category: DatasetCategory.WEATHER,
    accessPolicy: DatasetAccessPolicy.LOGIN_REQUIRED,
    source: 'openmeteo',
    description: 'Hourly and daily weather forecasts for all districts via OpenMeteo API.',
  },
  {
    name: 'OpenMeteo Flood Forecasts',
    category: DatasetCategory.WATER,
    accessPolicy: DatasetAccessPolicy.PUBLIC,
    source: 'openmeteo-flood',
    description: 'Daily simulated river discharge forecasts for Bangladesh districts via OpenMeteo and GloFAS.',
  },
  {
    name: 'District Air Quality Index',
    category: DatasetCategory.AIR_QUALITY,
    accessPolicy: DatasetAccessPolicy.RESEARCHER,
    source: 'bmd',
    description: 'AQI measurements from Bangladesh Meteorological Department monitoring stations.',
  },
  {
    name: 'Water Body Registry',
    category: DatasetCategory.WATER,
    accessPolicy: DatasetAccessPolicy.GOVERNMENT,
    source: 'bwdb',
    description: 'Rivers, lakes, haors, and wetlands indexed by Bangladesh Water Development Board.',
  },
  {
    name: 'Biodiversity Occurrences',
    category: DatasetCategory.BIODIVERSITY,
    accessPolicy: DatasetAccessPolicy.LOGIN_REQUIRED,
    source: 'gbif',
    description: 'Species observation records via GBIF and iNaturalist integration.',
  },
  {
    name: 'Sundarbans Monitoring',
    category: DatasetCategory.MONITORING,
    accessPolicy: DatasetAccessPolicy.RESEARCHER,
    source: 'forest-department',
    description: 'Mangrove health and wildlife monitoring data from the Forest Department.',
  },
  {
    name: 'OpenMeteo Marine Weather',
    category: DatasetCategory.WATER,
    accessPolicy: DatasetAccessPolicy.PUBLIC,
    source: 'openmeteo-marine',
    description:
      'Daily wave height, swell, and wind-wave forecasts for Bangladesh coastal districts via OpenMeteo Marine Weather API (GFS Wave / ERA5).',
  },
  {
    name: 'OpenMeteo Satellite Radiation',
    category: DatasetCategory.MONITORING,
    accessPolicy: DatasetAccessPolicy.PUBLIC,
    source: 'openmeteo-satellite',
    description:
      'Daily satellite-derived solar radiation totals, sunshine duration, and daylight duration for Bangladesh districts via OpenMeteo Satellite Radiation API.',
  },
];

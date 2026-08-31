import { DatasetCategory, DatasetAccessPolicy } from '@prisma/client';

export const SEED_DATASETS: {
  name: string;
  category: DatasetCategory;
  accessPolicy: DatasetAccessPolicy;
  source: string;
  description: string;
  license?: string;
  refreshCron?: string;
  version?: string;
  spatialExtent?: string;
}[] = [
  {
    name: 'OpenMeteo Weather',
    category: DatasetCategory.WEATHER,
    accessPolicy: DatasetAccessPolicy.LOGIN_REQUIRED,
    source: 'openmeteo',
    description: 'Hourly and daily weather forecasts for all districts via OpenMeteo API.',
    license: 'CC-BY-4.0',
    refreshCron: '0 */15 * * * *',
    version: '1.0.0',
    spatialExtent: 'All 64 Bangladesh districts',
  },
  {
    name: 'OpenMeteo Flood Forecasts',
    category: DatasetCategory.WATER,
    accessPolicy: DatasetAccessPolicy.PUBLIC,
    source: 'openmeteo-flood',
    description: 'Daily simulated river discharge forecasts for Bangladesh districts via OpenMeteo and GloFAS.',
    license: 'CC-BY-4.0',
    refreshCron: '0 0 */6 * * *',
    version: '1.0.0',
    spatialExtent: 'All 166 BWDB water level stations',
  },
  {
    name: 'District Air Quality Index',
    category: DatasetCategory.AIR_QUALITY,
    accessPolicy: DatasetAccessPolicy.RESEARCHER,
    source: 'bmd',
    description: 'AQI measurements from Bangladesh Meteorological Department monitoring stations.',
    license: 'Proprietary — BMD',
    spatialExtent: 'Selected Bangladesh districts with BMD stations',
  },
  {
    name: 'Water Body Registry',
    category: DatasetCategory.WATER,
    accessPolicy: DatasetAccessPolicy.GOVERNMENT,
    source: 'bwdb',
    description: 'Rivers, lakes, haors, and wetlands indexed by Bangladesh Water Development Board.',
    license: 'Proprietary — BWDB',
    spatialExtent: 'National — all major water bodies in Bangladesh',
  },
  {
    name: 'Biodiversity Occurrences',
    category: DatasetCategory.BIODIVERSITY,
    accessPolicy: DatasetAccessPolicy.LOGIN_REQUIRED,
    source: 'gbif',
    description: 'Species observation records via GBIF and iNaturalist integration.',
    license: 'CC-BY-4.0',
    refreshCron: '0 0 2 * * *',
    version: '1.0.0',
    spatialExtent: 'Bangladesh — GBIF occurrence records within bounding box',
  },
  {
    name: 'Sundarbans Monitoring',
    category: DatasetCategory.MONITORING,
    accessPolicy: DatasetAccessPolicy.RESEARCHER,
    source: 'forest-department',
    description: 'Mangrove health and wildlife monitoring data from the Forest Department.',
    license: 'Proprietary — Bangladesh Forest Department',
    spatialExtent: 'Sundarbans mangrove forest (Khulna, Satkhira, Bagerhat)',
  },
  {
    name: 'Emissions Inventory',
    category: DatasetCategory.AIR_QUALITY,
    accessPolicy: DatasetAccessPolicy.PUBLIC,
    source: 'platform',
    description:
      'Source-level pollution measurements from factories, power plants, vehicle fleets, and other emission sources across Bangladesh. Distinct from ambient air-quality readings.',
    license: 'CC-0',
    version: '1.0.0',
    spatialExtent: 'National — all registered pollution sources',
  },
  {
    name: 'OpenMeteo Marine Weather',
    category: DatasetCategory.WATER,
    accessPolicy: DatasetAccessPolicy.PUBLIC,
    source: 'openmeteo-marine',
    description:
      'Daily wave height, swell, and wind-wave forecasts for Bangladesh coastal districts via OpenMeteo Marine Weather API (GFS Wave / ERA5).',
    license: 'CC-BY-4.0',
    refreshCron: '0 0 2 * * *',
    version: '1.0.0',
    spatialExtent: 'Bangladesh coastal districts (Bay of Bengal coastline)',
  },
  {
    name: 'OpenMeteo Satellite Radiation',
    category: DatasetCategory.MONITORING,
    accessPolicy: DatasetAccessPolicy.PUBLIC,
    source: 'openmeteo-satellite',
    description:
      'Daily satellite-derived solar radiation totals, sunshine duration, and daylight duration for Bangladesh districts via OpenMeteo Satellite Radiation API.',
    license: 'CC-BY-4.0',
    refreshCron: '0 0 1 * * *',
    version: '1.0.0',
    spatialExtent: 'All 64 Bangladesh districts',
  },
];

import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { DatasetCategory, DatasetAccessPolicy } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { WeatherService } from '../weather/weather.service';
import { SEED_DATASETS } from './seed/catalog';

const DATASET_SELECT = {
  id: true,
  name: true,
  category: true,
  accessPolicy: true,
  source: true,
  providerId: true,
  description: true,
  recordCount: true,
  lastSyncedAt: true,
  isPublished: true,
  createdAt: true,
  updatedAt: true,
  provider: { select: { id: true, name: true, type: true } },
} as const;

@Injectable()
export class DatasetsService implements OnModuleInit {
  private readonly logger = new Logger(DatasetsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly weatherService: WeatherService,
  ) {}

  async onModuleInit() {
    const count = await this.prisma.dataset.count();
    if (count === 0) {
      await this.seed();
    }
  }

  private async seed() {
    this.logger.log('Seeding dataset catalog…');
    await this.prisma.dataset.createMany({ data: SEED_DATASETS });
    this.logger.log(`Dataset catalog seeded: ${SEED_DATASETS.length} records`);
  }

  list(category?: DatasetCategory, accessPolicy?: DatasetAccessPolicy, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const where = {
      isPublished: true,
      ...(category ? { category } : {}),
      ...(accessPolicy ? { accessPolicy } : {}),
    };
    return Promise.all([
      this.prisma.dataset.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { name: 'asc' },
        select: DATASET_SELECT,
      }),
      this.prisma.dataset.count({ where }),
    ]).then(([data, total]) => ({ data, total, page, pageSize }));
  }

  async getById(id: string) {
    const dataset = await this.prisma.dataset.findUnique({
      where: { id },
      select: DATASET_SELECT,
    });
    if (!dataset) throw new NotFoundException('Dataset not found');
    return dataset;
  }

  async currentWeather() {
    const districts = await this.weatherService.getLatestCurrentForAllDistricts();
    return {
      source: 'openmeteo',
      status: 'live',
      districts,
    };
  }

  async currentAirQuality() {
    const stations = await this.weatherService.getLatestAirQualityForAllDistricts();
    return {
      source: 'openmeteo',
      status: 'live',
      stations,
    };
  }
}

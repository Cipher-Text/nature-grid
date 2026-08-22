import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { DatasetCategory, DatasetAccessPolicy } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { WeatherService } from '../weather/weather.service';
import { SEED_DATASETS } from './seed/catalog';
import { UpdateDatasetDto } from './dto/update-dataset.dto';
import type { JwtPayload } from '../common/decorators/current-user.decorator';

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

  listAll() {
    return this.prisma.dataset
      .findMany({ orderBy: { name: 'asc' }, select: DATASET_SELECT })
      .then((data) => ({ data, total: data.length }));
  }

  async update(id: string, dto: UpdateDatasetDto, actor: JwtPayload) {
    await this.getById(id);
    const updated = await this.prisma.dataset.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.accessPolicy !== undefined ? { accessPolicy: dto.accessPolicy } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.isPublished !== undefined ? { isPublished: dto.isPublished } : {}),
      },
      select: DATASET_SELECT,
    });
    await this.prisma.auditEvent.create({
      data: {
        action: 'DATASET_UPDATE',
        userId: actor.sub,
        entityType: 'Dataset',
        entityId: id,
        meta: JSON.parse(JSON.stringify(dto)),
      },
    });
    return updated;
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

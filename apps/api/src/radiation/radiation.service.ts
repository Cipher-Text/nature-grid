import { Injectable, Logger } from '@nestjs/common';
import { District } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { RadiationOpenMeteoClient } from './radiation-openmeteo.client';

type DistrictWithCoords = District & { lat: number; lng: number };

@Injectable()
export class RadiationService {
  private readonly logger = new Logger(RadiationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly client: RadiationOpenMeteoClient,
  ) {}

  getFetchableDistricts(): Promise<DistrictWithCoords[]> {
    return this.prisma.district.findMany({
      where: { lat: { not: null }, lng: { not: null } },
    }) as Promise<DistrictWithCoords[]>;
  }

  async hasReadings(): Promise<boolean> {
    return (await this.prisma.satelliteRadiationReading.count()) > 0;
  }

  async syncDistrict(district: DistrictWithCoords): Promise<void> {
    const response = await this.client.fetch(district.lat, district.lng);
    const daily = response.daily;
    if (!daily?.time?.length) return;

    const lat = response.latitude ?? district.lat;
    const lng = response.longitude ?? district.lng;

    await this.prisma.$transaction(
      daily.time.map((dateStr, i) =>
        this.prisma.satelliteRadiationReading.upsert({
          where: {
            districtId_readingDate: {
              districtId: district.id,
              readingDate: new Date(dateStr),
            },
          },
          update: {
            lat,
            lng,
            shortwaveRadiationSum: daily.shortwave_radiation_sum?.[i] ?? null,
          },
          create: {
            districtId: district.id,
            lat,
            lng,
            readingDate: new Date(dateStr),
            shortwaveRadiationSum: daily.shortwave_radiation_sum?.[i] ?? null,
          },
        }),
      ),
    );
  }

  getLatestForAllDistricts() {
    return this.prisma.satelliteRadiationReading.findMany({
      distinct: ['districtId'],
      orderBy: [{ districtId: 'asc' }, { readingDate: 'desc' }],
      include: { district: { select: { id: true, name: true } } },
    });
  }

  getReadings(districtId: string, from: Date, to: Date) {
    return this.prisma.satelliteRadiationReading.findMany({
      where: { districtId, readingDate: { gte: from, lte: to } },
      orderBy: { readingDate: 'asc' },
    });
  }
}

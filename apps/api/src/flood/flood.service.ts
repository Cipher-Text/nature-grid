import { Injectable, Logger } from '@nestjs/common';
import { District } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { FloodOpenMeteoClient } from './flood-openmeteo.client';

type DistrictWithCoords = District & { lat: number; lng: number };

@Injectable()
export class FloodService {
  private readonly logger = new Logger(FloodService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly client: FloodOpenMeteoClient,
  ) {}

  getFetchableDistricts(): Promise<DistrictWithCoords[]> {
    return this.prisma.district.findMany({
      where: { lat: { not: null }, lng: { not: null } },
    }) as Promise<DistrictWithCoords[]>;
  }

  async hasForecasts(): Promise<boolean> {
    return (await this.prisma.floodForecast.count()) > 0;
  }

  async syncDistrict(district: DistrictWithCoords) {
    const response = await this.client.fetch(district.lat, district.lng);
    const daily = response.daily;
    if (!daily?.time?.length) return;

    const lat = response.latitude ?? district.lat;
    const lng = response.longitude ?? district.lng;

    await this.prisma.$transaction(
      daily.time.map((dateStr, i) =>
        this.prisma.floodForecast.upsert({
          where: {
            districtId_forecastDate: {
              districtId: district.id,
              forecastDate: new Date(dateStr),
            },
          },
          update: {
            lat,
            lng,
            riverDischarge: daily.river_discharge?.[i],
            riverDischargeMean: daily.river_discharge_mean?.[i],
            riverDischargeMedian: daily.river_discharge_median?.[i],
            riverDischargeMax: daily.river_discharge_max?.[i],
            riverDischargeMin: daily.river_discharge_min?.[i],
            riverDischargeP25: daily.river_discharge_p25?.[i],
            riverDischargeP75: daily.river_discharge_p75?.[i],
          },
          create: {
            districtId: district.id,
            lat,
            lng,
            forecastDate: new Date(dateStr),
            riverDischarge: daily.river_discharge?.[i],
            riverDischargeMean: daily.river_discharge_mean?.[i],
            riverDischargeMedian: daily.river_discharge_median?.[i],
            riverDischargeMax: daily.river_discharge_max?.[i],
            riverDischargeMin: daily.river_discharge_min?.[i],
            riverDischargeP25: daily.river_discharge_p25?.[i],
            riverDischargeP75: daily.river_discharge_p75?.[i],
          },
        }),
      ),
    );
  }

  getLatestForAllDistricts() {
    return this.prisma.floodForecast.findMany({
      distinct: ['districtId'],
      orderBy: [{ districtId: 'asc' }, { forecastDate: 'asc' }],
      include: { district: { select: { id: true, name: true } } },
    });
  }

  getForecast(districtId: string, from: Date, to: Date) {
    return this.prisma.floodForecast.findMany({
      where: { districtId, forecastDate: { gte: from, lte: to } },
      orderBy: { forecastDate: 'asc' },
    });
  }
}

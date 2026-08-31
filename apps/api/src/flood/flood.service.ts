import { Injectable, Logger } from '@nestjs/common';
import type { WaterLevelStation } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { FloodOpenMeteoClient } from './flood-openmeteo.client';

@Injectable()
export class FloodService {
  private readonly logger = new Logger(FloodService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly client: FloodOpenMeteoClient,
  ) {}

  getFetchableStations(): Promise<WaterLevelStation[]> {
    return this.prisma.waterLevelStation.findMany({ orderBy: { serial: 'asc' } });
  }

  async hasForecasts(): Promise<boolean> {
    return (await this.prisma.stationFloodForecast.count()) > 0;
  }

  async syncStation(station: WaterLevelStation) {
    const response = await this.client.fetch(station.latitude, station.longitude);
    const daily = response.daily;
    if (!daily?.time?.length) return;

    const lat = response.latitude ?? station.latitude;
    const lng = response.longitude ?? station.longitude;

    await this.prisma.$transaction(
      daily.time.map((dateStr, i) =>
        this.prisma.stationFloodForecast.upsert({
          where: {
            stationId_forecastDate: {
              stationId: station.id,
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
            stationId: station.id,
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

  /** Latest forecast row per station, ordered by station serial. */
  getLatestForAllStations() {
    return this.prisma.stationFloodForecast.findMany({
      distinct: ['stationId'],
      orderBy: [{ stationId: 'asc' }, { forecastDate: 'asc' }],
      include: {
        station: {
          select: {
            id: true,
            serial: true,
            stationCode: true,
            name: true,
            riverName: true,
            tidalStatus: true,
            districtId: true,
            district: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  getForecastByStation(stationId: string, from: Date, to: Date) {
    return this.prisma.stationFloodForecast.findMany({
      where: { stationId, forecastDate: { gte: from, lte: to } },
      orderBy: { forecastDate: 'asc' },
      include: {
        station: {
          select: {
            id: true,
            serial: true,
            stationCode: true,
            name: true,
            riverName: true,
            tidalStatus: true,
            districtId: true,
            district: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  /** All station forecasts for a district, grouped and ordered by station. */
  getForecastByDistrict(districtId: string, from: Date, to: Date) {
    return this.prisma.stationFloodForecast.findMany({
      where: {
        station: { districtId },
        forecastDate: { gte: from, lte: to },
      },
      orderBy: [{ station: { serial: 'asc' } }, { forecastDate: 'asc' }],
      include: {
        station: {
          select: {
            id: true,
            serial: true,
            stationCode: true,
            name: true,
            riverName: true,
            tidalStatus: true,
          },
        },
      },
    });
  }
}

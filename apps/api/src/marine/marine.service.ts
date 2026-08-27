import { Injectable, Logger } from '@nestjs/common';
import { District } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { MarineOpenMeteoClient } from './marine-openmeteo.client';

type DistrictWithCoords = District & { lat: number; lng: number };

@Injectable()
export class MarineService {
  private readonly logger = new Logger(MarineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly client: MarineOpenMeteoClient,
  ) {}

  getFetchableDistricts(): Promise<DistrictWithCoords[]> {
    return this.prisma.district.findMany({
      where: { lat: { not: null }, lng: { not: null } },
    }) as Promise<DistrictWithCoords[]>;
  }

  async hasForecasts(): Promise<boolean> {
    return (await this.prisma.marineForecast.count()) > 0;
  }

  async syncDistrict(district: DistrictWithCoords): Promise<void> {
    const response = await this.client.fetch(district.lat, district.lng);
    const daily = response.daily;
    if (!daily?.time?.length) return;

    // API returns the actual marine grid-cell coordinates — may differ from district centroid
    const lat = response.latitude ?? district.lat;
    const lng = response.longitude ?? district.lng;

    await this.prisma.$transaction(
      daily.time.map((dateStr, i) =>
        this.prisma.marineForecast.upsert({
          where: {
            districtId_forecastDate: {
              districtId: district.id,
              forecastDate: new Date(dateStr),
            },
          },
          update: {
            lat,
            lng,
            waveHeightMax: daily.wave_height_max?.[i] ?? null,
            waveDirectionDominant: daily.wave_direction_dominant?.[i] ?? null,
            wavePeriodMax: daily.wave_period_max?.[i] ?? null,
            windWaveHeightMax: daily.wind_wave_height_max?.[i] ?? null,
            windWaveDirectionDominant: daily.wind_wave_direction_dominant?.[i] ?? null,
            windWavePeriodMax: daily.wind_wave_period_max?.[i] ?? null,
            windWavePeakPeriodMax: daily.wind_wave_peak_period_max?.[i] ?? null,
            swellWaveHeightMax: daily.swell_wave_height_max?.[i] ?? null,
            swellWaveDirectionDominant: daily.swell_wave_direction_dominant?.[i] ?? null,
            swellWavePeriodMax: daily.swell_wave_period_max?.[i] ?? null,
            swellWavePeakPeriodMax: daily.swell_wave_peak_period_max?.[i] ?? null,
          },
          create: {
            districtId: district.id,
            lat,
            lng,
            forecastDate: new Date(dateStr),
            waveHeightMax: daily.wave_height_max?.[i] ?? null,
            waveDirectionDominant: daily.wave_direction_dominant?.[i] ?? null,
            wavePeriodMax: daily.wave_period_max?.[i] ?? null,
            windWaveHeightMax: daily.wind_wave_height_max?.[i] ?? null,
            windWaveDirectionDominant: daily.wind_wave_direction_dominant?.[i] ?? null,
            windWavePeriodMax: daily.wind_wave_period_max?.[i] ?? null,
            windWavePeakPeriodMax: daily.wind_wave_peak_period_max?.[i] ?? null,
            swellWaveHeightMax: daily.swell_wave_height_max?.[i] ?? null,
            swellWaveDirectionDominant: daily.swell_wave_direction_dominant?.[i] ?? null,
            swellWavePeriodMax: daily.swell_wave_period_max?.[i] ?? null,
            swellWavePeakPeriodMax: daily.swell_wave_peak_period_max?.[i] ?? null,
          },
        }),
      ),
    );
  }

  getLatestForAllDistricts() {
    return this.prisma.marineForecast.findMany({
      distinct: ['districtId'],
      orderBy: [{ districtId: 'asc' }, { forecastDate: 'desc' }],
      include: { district: { select: { id: true, name: true } } },
    });
  }

  getForecast(districtId: string, from: Date, to: Date) {
    return this.prisma.marineForecast.findMany({
      where: { districtId, forecastDate: { gte: from, lte: to } },
      orderBy: { forecastDate: 'asc' },
    });
  }
}

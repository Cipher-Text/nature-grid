import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { WeatherOpenMeteoClient } from '../../weather/weather-openmeteo.client';

/** Throttle between union fetches — keeps us within OpenMeteo free-tier (10k req/day). */
const INTER_UNION_DELAY_MS = 100;

function numAvg(values: (number | null | undefined)[]): number | null {
  const valid = values.filter((v): v is number => v != null && !Number.isNaN(v));
  if (valid.length === 0) return null;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

@Injectable()
export class LocationClimateService {
  private readonly logger = new Logger(LocationClimateService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly openMeteo: WeatherOpenMeteoClient,
  ) {}

  /**
   * Full daily sync:
   *   1. Fetch OpenMeteo for every union that has coordinates.
   *   2. Upsert a UnionDailyClimate row for today.
   *   3. Recompute 30-day rolling averages on Union rows (bulk SQL).
   *   4. Aggregate Union → Upazila → District → Division (bulk SQL).
   */
  async syncAll(): Promise<void> {
    const unions = await this.prisma.union.findMany({
      where: { lat: { not: null }, lng: { not: null } },
      select: { id: true, name: true, lat: true, lng: true },
    });

    this.logger.log(`Syncing climate for ${unions.length} unions with coordinates`);

    let ok = 0;
    let fail = 0;

    for (let i = 0; i < unions.length; i++) {
      const u = unions[i] as { id: string; name: string; lat: number; lng: number };
      try {
        await this.syncUnion(u);
        ok++;
      } catch (err) {
        fail++;
        this.logger.error(`Climate fetch failed for union ${u.name}: ${String(err)}`);
      }
      if (i < unions.length - 1) {
        await new Promise((r) => setTimeout(r, INTER_UNION_DELAY_MS));
      }
    }

    this.logger.log(`Union fetch done — ${ok} ok, ${fail} errors`);

    await this.updateUnionRollingAverages();
    await this.aggregateUpazilas();
    await this.aggregateDistricts();
    await this.aggregateDivisions();

    this.logger.log('Bottom-up climate aggregation complete');
  }

  // ─── Per-union fetch ──────────────────────────────────────────────────────

  private async syncUnion(union: { id: string; lat: number; lng: number }): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [weather, aq] = await Promise.all([
      this.openMeteo.fetchUnionWeather(union.lat, union.lng),
      this.openMeteo.fetchUnionAirQuality(union.lat, union.lng),
    ]);

    // Daily values (index 0 = today's forecast)
    const tempMax = weather.daily.temperature_2m_max?.[0] ?? null;
    const tempMin = weather.daily.temperature_2m_min?.[0] ?? null;
    const avgTemp = tempMax != null && tempMin != null ? (tempMax + tempMin) / 2 : null;
    const totalPrecip = weather.daily.precipitation_sum?.[0] ?? null;
    const maxWindSpeed = weather.daily.wind_speed_10m_max?.[0] ?? null;
    const uvMax = weather.daily.uv_index_max?.[0] ?? null;

    // Hourly averages across today's 24 slots
    const avgHumidity = numAvg(weather.hourly.relative_humidity_2m?.slice(0, 24) ?? []);
    const avgCloudCover = numAvg(weather.hourly.cloud_cover?.slice(0, 24) ?? []);
    const avgPm25 = numAvg(aq.hourly.pm2_5?.slice(0, 24) ?? []);
    const avgPm10 = numAvg(aq.hourly.pm10?.slice(0, 24) ?? []);
    const avgOzone = numAvg(aq.hourly.ozone?.slice(0, 24) ?? []);
    const avgUvIndex = numAvg(aq.hourly.uv_index?.slice(0, 24) ?? []) ?? uvMax;

    await this.prisma.unionDailyClimate.upsert({
      where: { unionId_date: { unionId: union.id, date: today } },
      update: {
        avgTemp, minTemp: tempMin, maxTemp: tempMax,
        avgHumidity, totalPrecip, avgWindSpeed: maxWindSpeed, maxWindSpeed,
        avgCloudCover, avgPm25, avgPm10, avgUvIndex, avgOzone,
        fetchedAt: new Date(),
      },
      create: {
        unionId: union.id, date: today,
        avgTemp, minTemp: tempMin, maxTemp: tempMax,
        avgHumidity, totalPrecip, avgWindSpeed: maxWindSpeed, maxWindSpeed,
        avgCloudCover, avgPm25, avgPm10, avgUvIndex, avgOzone,
      },
    });
  }

  // ─── Bulk aggregation (raw SQL for efficiency) ────────────────────────────

  /** Recompute 30-day rolling averages on all Union rows from their daily history. */
  private async updateUnionRollingAverages(): Promise<void> {
    this.logger.log('Updating Union 30-day rolling averages…');
    await this.prisma.$executeRaw`
      UPDATE "Union" u
      SET
        "avgTemp30d"       = sub.avg_temp,
        "minTemp30d"       = sub.min_temp,
        "maxTemp30d"       = sub.max_temp,
        "avgHumidity30d"   = sub.avg_humidity,
        "totalPrecip30d"   = sub.total_precip,
        "avgWindSpeed30d"  = sub.avg_wind,
        "avgCloudCover30d" = sub.avg_cloud,
        "avgPm25_30d"      = sub.avg_pm25,
        "avgPm10_30d"      = sub.avg_pm10,
        "avgUvIndex30d"    = sub.avg_uv,
        "climateUpdatedAt" = NOW()
      FROM (
        SELECT
          "unionId",
          AVG("avgTemp")       AS avg_temp,
          AVG("minTemp")       AS min_temp,
          AVG("maxTemp")       AS max_temp,
          AVG("avgHumidity")   AS avg_humidity,
          SUM("totalPrecip")   AS total_precip,
          AVG("avgWindSpeed")  AS avg_wind,
          AVG("avgCloudCover") AS avg_cloud,
          AVG("avgPm25")       AS avg_pm25,
          AVG("avgPm10")       AS avg_pm10,
          AVG("avgUvIndex")    AS avg_uv
        FROM "UnionDailyClimate"
        WHERE date >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY "unionId"
      ) sub
      WHERE u.id = sub."unionId"
    `;
  }

  private async aggregateUpazilas(): Promise<void> {
    this.logger.log('Aggregating climate → Upazila…');
    await this.prisma.$executeRaw`
      UPDATE "Upazila" up
      SET
        "avgTemp30d"       = sub.avg_temp,
        "minTemp30d"       = sub.min_temp,
        "maxTemp30d"       = sub.max_temp,
        "avgHumidity30d"   = sub.avg_humidity,
        "totalPrecip30d"   = sub.total_precip,
        "avgWindSpeed30d"  = sub.avg_wind,
        "avgCloudCover30d" = sub.avg_cloud,
        "avgPm25_30d"      = sub.avg_pm25,
        "avgPm10_30d"      = sub.avg_pm10,
        "avgUvIndex30d"    = sub.avg_uv,
        "climateUpdatedAt" = NOW()
      FROM (
        SELECT
          "upazilaId",
          AVG("avgTemp30d")       AS avg_temp,
          AVG("minTemp30d")       AS min_temp,
          AVG("maxTemp30d")       AS max_temp,
          AVG("avgHumidity30d")   AS avg_humidity,
          AVG("totalPrecip30d")   AS total_precip,
          AVG("avgWindSpeed30d")  AS avg_wind,
          AVG("avgCloudCover30d") AS avg_cloud,
          AVG("avgPm25_30d")      AS avg_pm25,
          AVG("avgPm10_30d")      AS avg_pm10,
          AVG("avgUvIndex30d")    AS avg_uv
        FROM "Union"
        WHERE "avgTemp30d" IS NOT NULL
        GROUP BY "upazilaId"
      ) sub
      WHERE up.id = sub."upazilaId"
    `;
  }

  private async aggregateDistricts(): Promise<void> {
    this.logger.log('Aggregating climate → District…');
    await this.prisma.$executeRaw`
      UPDATE "District" d
      SET
        "avgTemp30d"       = sub.avg_temp,
        "minTemp30d"       = sub.min_temp,
        "maxTemp30d"       = sub.max_temp,
        "avgHumidity30d"   = sub.avg_humidity,
        "totalPrecip30d"   = sub.total_precip,
        "avgWindSpeed30d"  = sub.avg_wind,
        "avgCloudCover30d" = sub.avg_cloud,
        "avgPm25_30d"      = sub.avg_pm25,
        "avgPm10_30d"      = sub.avg_pm10,
        "avgUvIndex30d"    = sub.avg_uv,
        "climateUpdatedAt" = NOW()
      FROM (
        SELECT
          "districtId",
          AVG("avgTemp30d")       AS avg_temp,
          AVG("minTemp30d")       AS min_temp,
          AVG("maxTemp30d")       AS max_temp,
          AVG("avgHumidity30d")   AS avg_humidity,
          AVG("totalPrecip30d")   AS total_precip,
          AVG("avgWindSpeed30d")  AS avg_wind,
          AVG("avgCloudCover30d") AS avg_cloud,
          AVG("avgPm25_30d")      AS avg_pm25,
          AVG("avgPm10_30d")      AS avg_pm10,
          AVG("avgUvIndex30d")    AS avg_uv
        FROM "Upazila"
        WHERE "avgTemp30d" IS NOT NULL
        GROUP BY "districtId"
      ) sub
      WHERE d.id = sub."districtId"
    `;
  }

  private async aggregateDivisions(): Promise<void> {
    this.logger.log('Aggregating climate → Division…');
    await this.prisma.$executeRaw`
      UPDATE "Division" dv
      SET
        "avgTemp30d"       = sub.avg_temp,
        "minTemp30d"       = sub.min_temp,
        "maxTemp30d"       = sub.max_temp,
        "avgHumidity30d"   = sub.avg_humidity,
        "totalPrecip30d"   = sub.total_precip,
        "avgWindSpeed30d"  = sub.avg_wind,
        "avgCloudCover30d" = sub.avg_cloud,
        "avgPm25_30d"      = sub.avg_pm25,
        "avgPm10_30d"      = sub.avg_pm10,
        "avgUvIndex30d"    = sub.avg_uv,
        "climateUpdatedAt" = NOW()
      FROM (
        SELECT
          "divisionId",
          AVG("avgTemp30d")       AS avg_temp,
          AVG("minTemp30d")       AS min_temp,
          AVG("maxTemp30d")       AS max_temp,
          AVG("avgHumidity30d")   AS avg_humidity,
          AVG("totalPrecip30d")   AS total_precip,
          AVG("avgWindSpeed30d")  AS avg_wind,
          AVG("avgCloudCover30d") AS avg_cloud,
          AVG("avgPm25_30d")      AS avg_pm25,
          AVG("avgPm10_30d")      AS avg_pm10,
          AVG("avgUvIndex30d")    AS avg_uv
        FROM "District"
        WHERE "avgTemp30d" IS NOT NULL
        GROUP BY "divisionId"
      ) sub
      WHERE dv.id = sub."divisionId"
    `;
  }
}

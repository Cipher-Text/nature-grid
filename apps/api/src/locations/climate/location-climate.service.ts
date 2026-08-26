import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { WeatherOpenMeteoClient } from '../../weather/weather-openmeteo.client';
import {
  OpenMeteoUnionWeatherResponse,
  OpenMeteoUnionAirQualityResponse,
} from '../../weather/dto/open-meteo-response.dto';

/**
 * OpenMeteo supports up to 1,000 locations per batch request.
 * 2,629 unions with coordinates → 3 HTTP requests instead of 2,629.
 */
const BATCH_SIZE = 1_000;
const INTER_BATCH_DELAY_MS = 500;

function numAvg(values: (number | null | undefined)[]): number | null {
  const valid = values.filter((v): v is number => v != null && !Number.isNaN(v));
  if (valid.length === 0) return null;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

type UnionWithCoords = { id: string; name: string; lat: number; lng: number };

@Injectable()
export class LocationClimateService {
  private readonly logger = new Logger(LocationClimateService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly openMeteo: WeatherOpenMeteoClient,
  ) {}

  /**
   * Full daily sync:
   *   1. Fetch OpenMeteo in batches of 1,000 unions per HTTP request.
   *   2. Upsert a UnionDailyClimate row for today per union (batched in a transaction).
   *   3. Recompute 30-day rolling averages on Union rows (single bulk SQL).
   *   4. Aggregate Union → Upazila → District → Division (3 bulk SQL statements).
   */
  async syncAll(): Promise<void> {
    // Load all unions; filter for those with coordinates in JS to avoid any Prisma
    // type-narrowing issues on nullable Float fields.
    const allUnions = await this.prisma.union.findMany({
      select: { id: true, name: true, lat: true, lng: true },
    });
    // Map through to narrow nullable lat/lng to number — avoids Prisma type-predicate issues.
    const unions: UnionWithCoords[] = allUnions
      .filter((u) => u.lat != null && u.lng != null)
      .map((u) => ({
        id: u.id,
        name: u.name,
        lat: u.lat as number,
        lng: u.lng as number,
      }));

    const totalBatches = Math.ceil(unions.length / BATCH_SIZE);
    this.logger.log(
      `Syncing climate for ${unions.length} unions in ${totalBatches} batch(es)`,
    );

    let ok = 0;
    let fail = 0;

    for (let i = 0; i < unions.length; i += BATCH_SIZE) {
      const batch = unions.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      try {
        await this.syncBatch(batch);
        ok += batch.length;
        this.logger.log(`Batch ${batchNum}/${totalBatches} done (${batch.length} unions)`);
      } catch (err) {
        fail += batch.length;
        this.logger.error(`Batch ${batchNum}/${totalBatches} failed: ${String(err)}`);
      }
      if (i + BATCH_SIZE < unions.length) {
        await new Promise((r) => setTimeout(r, INTER_BATCH_DELAY_MS));
      }
    }

    this.logger.log(`Union fetch done — ${ok} ok, ${fail} errors`);

    await this.updateUnionRollingAverages();
    await this.aggregateUpazilas();
    await this.aggregateDistricts();
    await this.aggregateDivisions();

    this.logger.log('Bottom-up climate aggregation complete');
  }

  // ─── Batch fetch + upsert ──────────────────────────────────────────────────

  private async syncBatch(batch: UnionWithCoords[]): Promise<void> {
    const lats = batch.map((u) => u.lat).join(',');
    const lngs = batch.map((u) => u.lng).join(',');

    const [weatherRaw, aqRaw] = await Promise.all([
      this.openMeteo.fetchUnionWeatherBatch(lats, lngs),
      this.openMeteo.fetchUnionAirQualityBatch(lats, lngs),
    ]);

    // OpenMeteo returns a single object for 1 coord, an array for multiple.
    const weatherArr: OpenMeteoUnionWeatherResponse[] = Array.isArray(weatherRaw)
      ? weatherRaw
      : [weatherRaw];
    const aqArr: OpenMeteoUnionAirQualityResponse[] = Array.isArray(aqRaw)
      ? aqRaw
      : [aqRaw];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upserts = batch
      .map((union, i) => {
        const w = weatherArr[i];
        const aq = aqArr[i];
        if (!w || !aq) return null;

        const tempMax = w.daily.temperature_2m_max?.[0] ?? null;
        const tempMin = w.daily.temperature_2m_min?.[0] ?? null;
        const avgTemp =
          tempMax != null && tempMin != null ? (tempMax + tempMin) / 2 : null;
        const totalPrecip = w.daily.precipitation_sum?.[0] ?? null;
        const maxWindSpeed = w.daily.wind_speed_10m_max?.[0] ?? null;
        const uvMax = w.daily.uv_index_max?.[0] ?? null;

        const avgHumidity = numAvg(w.hourly.relative_humidity_2m?.slice(0, 24) ?? []);
        const avgCloudCover = numAvg(w.hourly.cloud_cover?.slice(0, 24) ?? []);
        const avgPm25 = numAvg(aq.hourly.pm2_5?.slice(0, 24) ?? []);
        const avgPm10 = numAvg(aq.hourly.pm10?.slice(0, 24) ?? []);
        const avgOzone = numAvg(aq.hourly.ozone?.slice(0, 24) ?? []);
        const avgUvIndex = numAvg(aq.hourly.uv_index?.slice(0, 24) ?? []) ?? uvMax;

        const data = {
          avgTemp,
          minTemp: tempMin,
          maxTemp: tempMax,
          avgHumidity,
          totalPrecip,
          avgWindSpeed: maxWindSpeed,
          maxWindSpeed,
          avgCloudCover,
          avgPm25,
          avgPm10,
          avgUvIndex,
          avgOzone,
        };

        return this.prisma.unionDailyClimate.upsert({
          where: { unionId_date: { unionId: union.id, date: today } },
          update: { ...data, fetchedAt: new Date() },
          create: { unionId: union.id, date: today, ...data },
        });
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);

    if (upserts.length > 0) {
      await this.prisma.$transaction(upserts);
    }
  }

  // ─── Bulk aggregation (raw SQL) ────────────────────────────────────────────

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

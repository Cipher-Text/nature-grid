import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DatasetCategory } from '@prisma/client';
import { MarineService } from './marine.service';
import { IngestionService } from '../ingestion/ingestion.service';
import { OPENMETEO_PROVIDER_NAME } from '../providers/providers.service';
import { PrismaService } from '../database/prisma.service';
import { withCronLock, CRON_LOCK_KEYS } from '../common/pg-cron-lock';

@Injectable()
export class MarineScheduler implements OnModuleInit {
  private readonly logger = new Logger(MarineScheduler.name);

  constructor(
    private readonly marineService: MarineService,
    private readonly ingestionService: IngestionService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    if (await this.marineService.hasForecasts()) return;
    this.logger.log('No stored marine forecasts found; starting initial sync');
    void this.syncMarineForecasts();
  }

  /** Run once a day at 2am — offset from climate (midnight) and radiation (1am). */
  @Cron('0 0 2 * * *')
  syncMarineForecasts() {
    return withCronLock(this.prisma, this.logger, CRON_LOCK_KEYS.MARINE, async () => {
      const providerId = await this.ingestionService.findProviderIdByName(OPENMETEO_PROVIDER_NAME);
      const jobId = providerId ? await this.ingestionService.startJob(providerId) : null;
      try {
        const districts = await this.marineService.getFetchableDistricts();
        this.logger.log(`Syncing marine forecasts for ${districts.length} districts`);
        for (const district of districts) {
          try {
            await this.marineService.syncDistrict(district, jobId);
          } catch (err) {
            // Inland districts will fail — the marine API has no grid cell for them.
            // Per-district errors are logged but do not fail the overall job.
            this.logger.warn(`Marine forecast skipped for ${district.name}: ${String(err)}`);
          }
        }
        if (jobId) await this.ingestionService.completeJob(jobId, [DatasetCategory.WATER]);
      } catch (err) {
        if (jobId) await this.ingestionService.failJob(jobId, String(err));
        this.logger.error(`Marine forecast sync failed: ${String(err)}`);
      }
    });
  }
}

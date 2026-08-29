import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LocationClimateService } from './location-climate.service';
import { IngestionService } from '../../ingestion/ingestion.service';
import { OPENMETEO_PROVIDER_NAME } from '../../providers/providers.service';
import { PrismaService } from '../../database/prisma.service';
import { withCronLock, CRON_LOCK_KEYS } from '../../common/pg-cron-lock';

@Injectable()
export class LocationClimateScheduler {
  private readonly logger = new Logger(LocationClimateScheduler.name);

  constructor(
    private readonly climateService: LocationClimateService,
    private readonly ingestionService: IngestionService,
    private readonly prisma: PrismaService,
  ) {}

  /** Run once a day at midnight — fetch union-level climate and aggregate bottom-up. */
  @Cron('0 0 0 * * *')
  dailyClimateSync() {
    return withCronLock(this.prisma, this.logger, CRON_LOCK_KEYS.LOCATION_CLIMATE, async () => {
      this.logger.log('Starting daily union climate sync…');
      const providerId = await this.ingestionService.findProviderIdByName(OPENMETEO_PROVIDER_NAME);
      const jobId = providerId ? await this.ingestionService.startJob(providerId) : null;
      try {
        await this.climateService.syncAll();
        if (jobId) await this.ingestionService.completeJob(jobId, ['WEATHER', 'AIR_QUALITY']);
      } catch (err) {
        if (jobId) await this.ingestionService.failJob(jobId, String(err));
        this.logger.error(`Daily climate sync failed: ${String(err)}`);
      }
    });
  }
}

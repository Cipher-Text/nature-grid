import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LocationClimateService } from './location-climate.service';
import { IngestionService } from '../../ingestion/ingestion.service';
import { OPENMETEO_PROVIDER_NAME } from '../../providers/providers.service';

@Injectable()
export class LocationClimateScheduler {
  private readonly logger = new Logger(LocationClimateScheduler.name);

  constructor(
    private readonly climateService: LocationClimateService,
    private readonly ingestionService: IngestionService,
  ) {}

  /** Run once a day at midnight — fetch union-level climate and aggregate bottom-up. */
  @Cron('0 0 0 * * *')
  async dailyClimateSync() {
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
  }
}

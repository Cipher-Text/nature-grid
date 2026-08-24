import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FloodService } from './flood.service';
import { IngestionService } from '../ingestion/ingestion.service';
import { OPENMETEO_PROVIDER_NAME } from '../providers/providers.service';

@Injectable()
export class FloodScheduler implements OnModuleInit {
  private readonly logger = new Logger(FloodScheduler.name);

  constructor(
    private readonly floodService: FloodService,
    private readonly ingestionService: IngestionService,
  ) {}

  async onModuleInit() {
    if (await this.floodService.hasForecasts()) return;
    this.logger.log('No stored flood forecasts found; starting initial sync');
    void this.syncFloodForecasts();
  }

  @Cron('0 30 */6 * * *')
  async syncFloodForecasts() {
    const providerId = await this.ingestionService.findProviderIdByName(OPENMETEO_PROVIDER_NAME);
    const jobId = providerId ? await this.ingestionService.startJob(providerId) : null;
    try {
      const districts = await this.floodService.getFetchableDistricts();
      this.logger.log(`Syncing flood forecasts for ${districts.length} districts`);
      for (const district of districts) {
        try {
          await this.floodService.syncDistrict(district);
        } catch (err) {
          this.logger.error(`Flood forecast fetch failed for ${district.name}: ${String(err)}`);
        }
      }
      if (jobId) await this.ingestionService.completeJob(jobId, ['WATER']);
    } catch (err) {
      if (jobId) await this.ingestionService.failJob(jobId, String(err));
      this.logger.error(`Flood forecast sync failed: ${String(err)}`);
    }
  }
}

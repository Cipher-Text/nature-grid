import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DatasetCategory } from '@prisma/client';
import { RadiationService } from './radiation.service';
import { IngestionService } from '../ingestion/ingestion.service';
import { OPENMETEO_PROVIDER_NAME } from '../providers/providers.service';

@Injectable()
export class RadiationScheduler implements OnModuleInit {
  private readonly logger = new Logger(RadiationScheduler.name);

  constructor(
    private readonly radiationService: RadiationService,
    private readonly ingestionService: IngestionService,
  ) {}

  async onModuleInit() {
    if (await this.radiationService.hasReadings()) return;
    this.logger.log('No stored satellite radiation readings found; starting initial sync');
    void this.syncRadiation();
  }

  /** Run once a day at 1am — offset from midnight climate sync. */
  @Cron('0 0 1 * * *')
  async syncRadiation() {
    const providerId = await this.ingestionService.findProviderIdByName(OPENMETEO_PROVIDER_NAME);
    const jobId = providerId ? await this.ingestionService.startJob(providerId) : null;
    try {
      const districts = await this.radiationService.getFetchableDistricts();
      this.logger.log(`Syncing satellite radiation for ${districts.length} districts`);
      for (const district of districts) {
        try {
          await this.radiationService.syncDistrict(district);
        } catch (err) {
          this.logger.error(
            `Satellite radiation fetch failed for ${district.name}: ${String(err)}`,
          );
        }
      }
      if (jobId) await this.ingestionService.completeJob(jobId, [DatasetCategory.MONITORING]);
    } catch (err) {
      if (jobId) await this.ingestionService.failJob(jobId, String(err));
      this.logger.error(`Satellite radiation sync failed: ${String(err)}`);
    }
  }
}

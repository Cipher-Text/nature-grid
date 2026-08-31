import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FloodService } from './flood.service';
import { IngestionService } from '../ingestion/ingestion.service';
import { OPENMETEO_PROVIDER_NAME } from '../providers/providers.service';
import { PrismaService } from '../database/prisma.service';
import { withCronLock, CRON_LOCK_KEYS } from '../common/pg-cron-lock';

@Injectable()
export class FloodScheduler implements OnModuleInit {
  private readonly logger = new Logger(FloodScheduler.name);

  constructor(
    private readonly floodService: FloodService,
    private readonly ingestionService: IngestionService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    if (await this.floodService.hasForecasts()) return;
    this.logger.log('No stored flood forecasts found; starting initial sync');
    void this.syncFloodForecasts();
  }

  @Cron('0 0 3 * * *')
  syncFloodForecasts() {
    return withCronLock(this.prisma, this.logger, CRON_LOCK_KEYS.FLOOD, async () => {
      const providerId = await this.ingestionService.findProviderIdByName(OPENMETEO_PROVIDER_NAME);
      const jobId = providerId ? await this.ingestionService.startJob(providerId) : null;
      try {
        const stations = await this.floodService.getFetchableStations();
        this.logger.log(`Syncing flood forecasts for ${stations.length} stations`);
        for (const station of stations) {
          try {
            await this.floodService.syncStation(station, jobId);
          } catch (err) {
            this.logger.error(`Flood forecast fetch failed for station ${station.stationCode} (${station.name}): ${String(err)}`);
          }
        }
        if (jobId) await this.ingestionService.completeJob(jobId, ['WATER']);
      } catch (err) {
        if (jobId) await this.ingestionService.failJob(jobId, String(err));
        this.logger.error(`Flood forecast sync failed: ${String(err)}`);
      }
    });
  }
}

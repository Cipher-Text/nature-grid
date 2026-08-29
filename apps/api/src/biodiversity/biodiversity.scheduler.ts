import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BiodiversityService } from './biodiversity.service';
import { IngestionService } from '../ingestion/ingestion.service';
import { GBIF_PROVIDER_NAME } from '../providers/providers.service';
import { PrismaService } from '../database/prisma.service';
import { withCronLock, CRON_LOCK_KEYS } from '../common/pg-cron-lock';

@Injectable()
export class BiodiversityScheduler {
  private readonly logger = new Logger(BiodiversityScheduler.name);

  constructor(
    private readonly biodiversityService: BiodiversityService,
    private readonly ingestionService: IngestionService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  syncGbif() {
    return withCronLock(this.prisma, this.logger, CRON_LOCK_KEYS.BIODIVERSITY, async () => {
      const providerId = await this.ingestionService.findProviderIdByName(GBIF_PROVIDER_NAME);
      const jobId = providerId ? await this.ingestionService.startJob(providerId) : null;
      try {
        await this.biodiversityService.syncFromGbif();
        if (jobId) await this.ingestionService.completeJob(jobId, ['BIODIVERSITY']);
      } catch (err) {
        if (jobId) await this.ingestionService.failJob(jobId, String(err));
        this.logger.error(`GBIF sync failed: ${String(err)}`);
      }
    });
  }
}

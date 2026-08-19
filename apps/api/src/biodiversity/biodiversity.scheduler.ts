import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BiodiversityService } from './biodiversity.service';

@Injectable()
export class BiodiversityScheduler {
  private readonly logger = new Logger(BiodiversityScheduler.name);

  constructor(private readonly biodiversityService: BiodiversityService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncGbif() {
    try {
      await this.biodiversityService.syncFromGbif();
    } catch (err) {
      this.logger.error(`GBIF sync failed: ${String(err)}`);
    }
  }
}

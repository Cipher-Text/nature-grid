import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LocationClimateService } from './location-climate.service';

@Injectable()
export class LocationClimateScheduler {
  private readonly logger = new Logger(LocationClimateScheduler.name);

  constructor(private readonly climateService: LocationClimateService) {}

  /** Run once a day at midnight — fetch union-level climate and aggregate bottom-up. */
  @Cron('0 0 0 * * *')
  async dailyClimateSync() {
    this.logger.log('Starting daily union climate sync…');
    try {
      await this.climateService.syncAll();
    } catch (err) {
      this.logger.error(`Daily climate sync failed: ${String(err)}`);
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WeatherService } from './weather.service';
import { IngestionService } from '../ingestion/ingestion.service';
import { OPENMETEO_PROVIDER_NAME } from '../providers/providers.service';

@Injectable()
export class WeatherScheduler {
  private readonly logger = new Logger(WeatherScheduler.name);

  constructor(
    private readonly weatherService: WeatherService,
    private readonly ingestionService: IngestionService,
  ) {}

  @Cron('0 */15 * * * *')
  async syncCurrentWeather() {
    const providerId = await this.ingestionService.findProviderIdByName(OPENMETEO_PROVIDER_NAME);
    const jobId = providerId ? await this.ingestionService.startJob(providerId) : null;
    try {
      const districts = await this.weatherService.getFetchableDistricts();
      this.logger.log(`Syncing current weather for ${districts.length} districts`);
      for (const district of districts) {
        try {
          await this.weatherService.syncCurrentWeather(district);
        } catch (err) {
          this.logger.error(`Current weather fetch failed for ${district.name}: ${String(err)}`);
        }
      }
      if (jobId) await this.ingestionService.completeJob(jobId, ['WEATHER']);
    } catch (err) {
      if (jobId) await this.ingestionService.failJob(jobId, String(err));
      this.logger.error(`Current weather sync failed: ${String(err)}`);
    }
  }

  @Cron('0 0 */2 * * *')
  async syncHourlyWeatherAndAirQuality() {
    const providerId = await this.ingestionService.findProviderIdByName(OPENMETEO_PROVIDER_NAME);
    const jobId = providerId ? await this.ingestionService.startJob(providerId) : null;
    try {
      const districts = await this.weatherService.getFetchableDistricts();
      this.logger.log(`Syncing hourly weather + air quality for ${districts.length} districts`);
      for (const district of districts) {
        try {
          await this.weatherService.syncHourlyWeather(district);
        } catch (err) {
          this.logger.error(`Hourly weather fetch failed for ${district.name}: ${String(err)}`);
        }
        try {
          await this.weatherService.syncAirQuality(district);
        } catch (err) {
          this.logger.error(`Air quality fetch failed for ${district.name}: ${String(err)}`);
        }
      }
      if (jobId) await this.ingestionService.completeJob(jobId, ['WEATHER', 'AIR_QUALITY']);
    } catch (err) {
      if (jobId) await this.ingestionService.failJob(jobId, String(err));
      this.logger.error(`Hourly weather sync failed: ${String(err)}`);
    }
  }

  @Cron('0 0 */12 * * *')
  async syncDailyWeather() {
    const providerId = await this.ingestionService.findProviderIdByName(OPENMETEO_PROVIDER_NAME);
    const jobId = providerId ? await this.ingestionService.startJob(providerId) : null;
    try {
      const districts = await this.weatherService.getFetchableDistricts();
      this.logger.log(`Syncing daily weather for ${districts.length} districts`);
      for (const district of districts) {
        try {
          await this.weatherService.syncDailyWeather(district);
        } catch (err) {
          this.logger.error(`Daily weather fetch failed for ${district.name}: ${String(err)}`);
        }
      }
      if (jobId) await this.ingestionService.completeJob(jobId, ['WEATHER']);
    } catch (err) {
      if (jobId) await this.ingestionService.failJob(jobId, String(err));
      this.logger.error(`Daily weather sync failed: ${String(err)}`);
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WeatherService } from './weather.service';

@Injectable()
export class WeatherScheduler {
  private readonly logger = new Logger(WeatherScheduler.name);

  constructor(private readonly weatherService: WeatherService) {}

  /** Current conditions refreshed every 15 minutes. */
  @Cron('0 */15 * * * *')
  async syncCurrentWeather() {
    const districts = await this.weatherService.getFetchableDistricts();
    this.logger.log(`Syncing current weather for ${districts.length} districts`);
    for (const district of districts) {
      try {
        await this.weatherService.syncCurrentWeather(district);
      } catch (err) {
        this.logger.error(`Current weather fetch failed for ${district.name}: ${String(err)}`);
      }
    }
  }

  /** Hourly forecast + air quality refreshed every 2 hours. */
  @Cron('0 0 */2 * * *')
  async syncHourlyWeatherAndAirQuality() {
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
  }

  /** Daily forecast refreshed every 12 hours. */
  @Cron('0 0 */12 * * *')
  async syncDailyWeather() {
    const districts = await this.weatherService.getFetchableDistricts();
    this.logger.log(`Syncing daily weather for ${districts.length} districts`);
    for (const district of districts) {
      try {
        await this.weatherService.syncDailyWeather(district);
      } catch (err) {
        this.logger.error(`Daily weather fetch failed for ${district.name}: ${String(err)}`);
      }
    }
  }
}

import { Module } from '@nestjs/common';
import { WeatherModule } from '../../weather/weather.module';
import { LocationClimateService } from './location-climate.service';
import { LocationClimateScheduler } from './location-climate.scheduler';

@Module({
  imports: [WeatherModule],
  providers: [LocationClimateService, LocationClimateScheduler],
})
export class LocationClimateModule {}

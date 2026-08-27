import { Module } from '@nestjs/common';
import { WeatherModule } from '../../weather/weather.module';
import { IngestionModule } from '../../ingestion/ingestion.module';
import { LocationClimateService } from './location-climate.service';
import { LocationClimateScheduler } from './location-climate.scheduler';

@Module({
  imports: [WeatherModule, IngestionModule],
  providers: [LocationClimateService, LocationClimateScheduler],
})
export class LocationClimateModule {}

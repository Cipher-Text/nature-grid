import { Module } from '@nestjs/common';
import { IngestionModule } from '../ingestion/ingestion.module';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherScheduler } from './weather.scheduler';
import { WeatherOpenMeteoClient } from './weather-openmeteo.client';

@Module({
  imports: [IngestionModule],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherScheduler, WeatherOpenMeteoClient],
  exports: [WeatherService, WeatherOpenMeteoClient],
})
export class WeatherModule {}

import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherScheduler } from './weather.scheduler';
import { WeatherOpenMeteoClient } from './weather-openmeteo.client';

@Module({
  controllers: [WeatherController],
  providers: [WeatherService, WeatherScheduler, WeatherOpenMeteoClient],
  exports: [WeatherService],
})
export class WeatherModule {}

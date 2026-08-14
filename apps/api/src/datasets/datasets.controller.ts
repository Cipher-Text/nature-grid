import { Controller, Get, Param } from '@nestjs/common';
import { DatasetsService } from './datasets.service';

@Controller('datasets')
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Get()
  list() {
    return this.datasetsService.list();
  }

  @Get('weather/current')
  currentWeather() {
    return this.datasetsService.currentWeather();
  }

  @Get('air-quality/current')
  currentAirQuality() {
    return this.datasetsService.currentAirQuality();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.datasetsService.getById(id);
  }
}


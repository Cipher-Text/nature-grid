import { Controller, Get, Param, Query } from '@nestjs/common';
import { DatasetCategory, DatasetAccessPolicy } from '@prisma/client';
import { DatasetsService } from './datasets.service';
import { Public } from '../common/decorators/roles.decorator';

@Controller('datasets')
@Public()
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Get()
  list(
    @Query('category') category?: string,
    @Query('accessPolicy') accessPolicy?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.datasetsService.list(
      category as DatasetCategory | undefined,
      accessPolicy as DatasetAccessPolicy | undefined,
      Number(page ?? 1),
      Number(pageSize ?? 20),
    );
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

import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { DatasetCategory, DatasetAccessPolicy } from '@prisma/client';
import { DatasetsService } from './datasets.service';
import { UpdateDatasetDto } from './dto/update-dataset.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Public, Roles } from '../common/decorators/roles.decorator';

@Controller('datasets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Public()
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

  @Public()
  @Get('weather/current')
  currentWeather() {
    return this.datasetsService.currentWeather();
  }

  @Public()
  @Get('air-quality/current')
  currentAirQuality() {
    return this.datasetsService.currentAirQuality();
  }

  /** Admin-only: returns all datasets regardless of isPublished. */
  @Roles('ADMIN')
  @Get('admin')
  listAll() {
    return this.datasetsService.listAll();
  }

  @Public()
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.datasetsService.getById(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDatasetDto,
    @CurrentUser() actor: JwtPayload,
  ) {
    return this.datasetsService.update(id, dto, actor);
  }
}

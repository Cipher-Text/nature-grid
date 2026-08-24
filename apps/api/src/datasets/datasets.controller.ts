import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { DatasetCategory, DatasetAccessPolicy, DatasetAccessRequestStatus } from '@prisma/client';
import { DatasetsService } from './datasets.service';
import { UpdateDatasetDto } from './dto/update-dataset.dto';
import { CreateDatasetDto } from './dto/create-dataset.dto';
import { RequestDatasetAccessDto } from './dto/request-dataset-access.dto';
import { DecideDatasetAccessDto } from './dto/decide-dataset-access.dto';
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

  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateDatasetDto, @CurrentUser() actor: JwtPayload) {
    return this.datasetsService.create(dto, actor);
  }

  @Get(':id/download')
  download(@Param('id') id: string, @CurrentUser() user: JwtPayload, @Req() req: any) {
    return this.datasetsService.download(id, user, req.ip);
  }

  @Post(':id/access-request')
  requestAccess(
    @Param('id') id: string,
    @Body() dto: RequestDatasetAccessDto,
    @CurrentUser() user: JwtPayload,
    @Req() req: any,
  ) {
    return this.datasetsService.requestAccess(id, dto, user, req.ip);
  }

  @Roles('ADMIN')
  @Get(':id/access-requests')
  listAccessRequests(
    @Param('id') id: string,
    @Query('status') status?: string,
  ) {
    return this.datasetsService.listAccessRequests(
      id,
      status as DatasetAccessRequestStatus | undefined,
    );
  }

  @Roles('ADMIN')
  @Patch(':id/access-requests/:requestId')
  decideAccessRequest(
    @Param('id') id: string,
    @Param('requestId') requestId: string,
    @Body() dto: DecideDatasetAccessDto,
    @CurrentUser() actor: JwtPayload,
  ) {
    return this.datasetsService.decideAccessRequest(id, requestId, dto, actor);
  }
}

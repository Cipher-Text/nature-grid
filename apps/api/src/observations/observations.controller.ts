import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ObservationCategory, ObservationTrustLevel } from '@prisma/client';
import { ObservationsService } from './observations.service';
import { CreateObservationDto } from './dto/create-observation.dto';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { UpdateObservationTrustDto } from './dto/update-trust.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/roles.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('observations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ObservationsController {
  constructor(private readonly observationsService: ObservationsService) {}

  @Public()
  @Get()
  list(
    @Query('category') category?: string,
    @Query('trustLevel') trustLevel?: string,
    @Query('districtId') districtId?: string,
    @Query('upazilaId') upazilaId?: string,
    @Query('unionId') unionId?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.observationsService.list(
      category as ObservationCategory | undefined,
      trustLevel as ObservationTrustLevel | undefined,
      districtId,
      upazilaId,
      unionId,
      Number(page ?? 1),
      Number(pageSize ?? 20),
    );
  }

  /** Returns the caller's own observations across all trust levels. */
  @Get('mine')
  listMine(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.observationsService.listMine(
      user.sub,
      Number(page ?? 1),
      Number(pageSize ?? 10),
    );
  }

  /**
   * Public: returns non-FLAGGED observations within radiusKm of a point.
   * Results are ordered nearest-first and include distance_m in metres.
   */
  @Public()
  @Get('nearby')
  findNearby(
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('radiusKm') radiusKm?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.observationsService.findNearby(
      Number(lat),
      Number(lng),
      Number(radiusKm ?? 10),
      Number(page ?? 1),
      Number(pageSize ?? 20),
    );
  }

  @Public()
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.observationsService.getById(id);
  }

  @Permissions('observations.create')
  @Post()
  create(@Body() dto: CreateObservationDto, @CurrentUser() user: JwtPayload) {
    return this.observationsService.create(dto, user);
  }

  /** Owner only: edit description, location, species, or observedAt while still UNVERIFIED. */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateObservationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.observationsService.update(id, dto, user);
  }

  /** RESEARCHER/ADMIN: change the trust level of an observation. */
  @Permissions('observations.verify')
  @Patch(':id/trust')
  updateTrust(
    @Param('id') id: string,
    @Body() dto: UpdateObservationTrustDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.observationsService.updateTrust(id, dto, user);
  }

  /** MODERATOR/ADMIN: permanently remove an observation. */
  @Permissions('observations.delete')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.observationsService.delete(id, user);
  }

  /** Owner only: add a structured measurement to an UNVERIFIED observation. */
  @Permissions('observations.create')
  @Post(':id/measurements')
  addMeasurement(
    @Param('id') id: string,
    @Body() dto: CreateMeasurementDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.observationsService.addMeasurement(id, dto, user);
  }

  /** Owner or MODERATOR/ADMIN: remove a measurement from an observation. */
  @Delete(':id/measurements/:measurementId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteMeasurement(
    @Param('id') id: string,
    @Param('measurementId') measurementId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.observationsService.deleteMeasurement(id, measurementId, user);
  }
}

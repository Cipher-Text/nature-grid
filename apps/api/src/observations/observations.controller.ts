import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ObservationCategory, ObservationTrustLevel } from '@prisma/client';
import { ObservationsService } from './observations.service';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationTrustDto } from './dto/update-trust.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Public, Roles } from '../common/decorators/roles.decorator';

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
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.observationsService.list(
      category as ObservationCategory | undefined,
      trustLevel as ObservationTrustLevel | undefined,
      districtId,
      Number(page ?? 1),
      Number(pageSize ?? 20),
    );
  }

  /** Authenticated: returns the caller's own observations across all trust levels. */
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

  @Public()
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.observationsService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateObservationDto, @CurrentUser() user: JwtPayload) {
    return this.observationsService.create(dto, user);
  }

  @Roles('RESEARCHER', 'ADMIN')
  @Patch(':id/trust')
  updateTrust(
    @Param('id') id: string,
    @Body() dto: UpdateObservationTrustDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.observationsService.updateTrust(id, dto, user);
  }
}

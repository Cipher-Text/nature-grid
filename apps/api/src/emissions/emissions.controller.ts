import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PollutantType, PollutionSourceType } from '@prisma/client';
import { EmissionsService } from './emissions.service';
import { CreatePollutionSourceDto } from './dto/create-pollution-source.dto';
import { UpdatePollutionSourceDto } from './dto/update-pollution-source.dto';
import { CreateEmissionEntryDto } from './dto/create-emission-entry.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/roles.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('emissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmissionsController {
  constructor(private readonly emissionsService: EmissionsService) {}

  // ─── Pollution Sources ───────────────────────────────────────────────────────

  @Public()
  @Get('sources')
  listSources(
    @Query('type') type?: string,
    @Query('districtId') districtId?: string,
    @Query('isActive') isActive?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const activeFilter =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.emissionsService.listSources(
      type as PollutionSourceType | undefined,
      districtId,
      activeFilter,
      Number(page ?? 1),
      Number(pageSize ?? 20),
    );
  }

  @Public()
  @Get('sources/:id')
  getSource(@Param('id') id: string) {
    return this.emissionsService.getSourceById(id);
  }

  @Permissions('emissions.manage')
  @Post('sources')
  createSource(
    @Body() dto: CreatePollutionSourceDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.emissionsService.createSource(dto, user);
  }

  @Permissions('emissions.manage')
  @Patch('sources/:id')
  updateSource(
    @Param('id') id: string,
    @Body() dto: UpdatePollutionSourceDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.emissionsService.updateSource(id, dto, user);
  }

  // ─── Emission Entries ────────────────────────────────────────────────────────

  @Public()
  @Get('sources/:sourceId/entries')
  listEntries(
    @Param('sourceId') sourceId: string,
    @Query('pollutant') pollutant?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.emissionsService.listEntries(
      sourceId,
      pollutant as PollutantType | undefined,
      Number(page ?? 1),
      Number(pageSize ?? 20),
    );
  }

  @Permissions('emissions.report')
  @Post('sources/:sourceId/entries')
  createEntry(
    @Param('sourceId') sourceId: string,
    @Body() dto: CreateEmissionEntryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.emissionsService.createEntry(sourceId, dto, user);
  }
}

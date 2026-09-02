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
} from '@nestjs/common';
import { ComplianceStatus, FacilityType } from '@prisma/client';
import { Public, Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { FacilitiesService } from './facilities.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';

@Controller('industrial-sites')
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Public()
  @Get()
  list(
    @Query('facilityType') facilityType?: string,
    @Query('complianceStatus') complianceStatus?: string,
    @Query('districtId') districtId?: string,
    @Query('upazilaId') upazilaId?: string,
    @Query('isActive') isActive?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedIsActive =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;

    return this.facilitiesService.list(
      facilityType as FacilityType | undefined,
      complianceStatus as ComplianceStatus | undefined,
      districtId,
      upazilaId,
      parsedIsActive,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Public()
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.facilitiesService.getById(id);
  }

  @Roles('GOVERNMENT', 'ADMIN')
  @Post()
  create(@Body() dto: CreateFacilityDto, @CurrentUser() actor: JwtPayload) {
    return this.facilitiesService.create(dto, actor);
  }

  @Roles('GOVERNMENT', 'ADMIN', 'MODERATOR')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFacilityDto,
    @CurrentUser() actor: JwtPayload,
  ) {
    return this.facilitiesService.update(id, dto, actor);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() actor: JwtPayload) {
    return this.facilitiesService.remove(id, actor);
  }
}

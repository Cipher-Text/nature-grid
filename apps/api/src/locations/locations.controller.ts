import { Controller, Get, Param, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Public } from '../common/decorators/roles.decorator';

@Controller('locations')
@Public()
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('divisions')
  getDivisions() {
    return this.locationsService.getDivisions();
  }

  @Get('districts')
  getDistricts(@Query('divisionId') divisionId?: string) {
    return this.locationsService.getDistricts(divisionId);
  }

  @Get('districts/:id')
  getDistrict(@Param('id') id: string) {
    return this.locationsService.getDistrict(id);
  }

  @Get('upazilas')
  getUpazilas(@Query('districtId') districtId?: string) {
    return this.locationsService.getUpazilas(districtId);
  }

  @Get('unions')
  getUnions(@Query('upazilaId') upazilaId?: string) {
    return this.locationsService.getUnions(upazilaId);
  }
}

import { Controller, Get, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('divisions')
  getDivisions() {
    return this.locationsService.getDivisions();
  }

  @Get('districts')
  getDistricts() {
    return this.locationsService.getDistricts();
  }

  @Get('districts/:id')
  getDistrict(@Param('id') id: string) {
    return this.locationsService.getDistrict(id);
  }

  @Get('upazilas')
  getUpazilas() {
    return this.locationsService.getUpazilas();
  }

  @Get('unions')
  getUnions() {
    return this.locationsService.getUnions();
  }
}


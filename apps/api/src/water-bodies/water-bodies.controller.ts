import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { HydrologicalClass } from '@prisma/client';
import { Public } from '../common/decorators/roles.decorator';
import { WaterBodiesService } from './water-bodies.service';

@Controller('water-bodies')
@Public()
export class WaterBodiesController {
  constructor(private readonly service: WaterBodiesService) {}

  @Get()
  list(
    @Query('class') hydrologicalClass?: HydrologicalClass,
    @Query('upazilaId') upazilaId?: string,
    @Query('districtId') districtId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.list({
      hydrologicalClass,
      upazilaId,
      districtId,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? Math.min(parseInt(limit, 10), 100) : 20,
    });
  }

  @Get('stations')
  listStations(
    @Query('districtId') districtId?: string,
    @Query('upazilaId') upazilaId?: string,
    @Query('tidalStatus') tidalStatus?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.listStations({
      districtId,
      upazilaId,
      tidalStatus,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? Math.min(parseInt(limit, 10), 100) : 20,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.service.findOne(id);
    if (!result) throw new NotFoundException('Water body not found');
    return result;
  }
}

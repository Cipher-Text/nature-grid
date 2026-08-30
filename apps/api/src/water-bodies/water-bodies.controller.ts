import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { HydrologicalClass } from '@prisma/client';
import { Public } from '../common/decorators/roles.decorator';
import { WaterBodiesService } from './water-bodies.service';

@Controller()
@Public()
export class WaterBodiesController {
  constructor(private readonly service: WaterBodiesService) {}

  @Get('water-bodies')
  list(
    @Query('class') hydrologicalClass?: HydrologicalClass,
    @Query('upazilaId') upazilaId?: string,
    @Query('districtId') districtId?: string,
  ) {
    return this.service.list({ hydrologicalClass, upazilaId, districtId });
  }

  @Get('water-bodies/:id')
  async findOne(@Param('id') id: string) {
    const result = await this.service.findOne(id);
    if (!result) throw new NotFoundException('Water body not found');
    return result;
  }

  @Get('water-level-stations')
  listStations() {
    return this.service.listStations();
  }
}

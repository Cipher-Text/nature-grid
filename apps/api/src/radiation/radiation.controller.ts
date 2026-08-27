import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { Public } from '../common/decorators/roles.decorator';
import { RadiationService } from './radiation.service';

@Controller('radiation')
@Public()
export class RadiationController {
  constructor(private readonly radiationService: RadiationService) {}

  @Get('daily')
  latestForAllDistricts() {
    return this.radiationService.getLatestForAllDistricts();
  }

  @Get('daily/:districtId')
  async readings(
    @Param('districtId') districtId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const fromDate = from ? new Date(from) : new Date();
    const toDate = to
      ? new Date(to)
      : new Date(fromDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const rows = await this.radiationService.getReadings(districtId, fromDate, toDate);
    if (!rows.length) throw new NotFoundException('No satellite radiation readings for this district');
    return rows;
  }
}

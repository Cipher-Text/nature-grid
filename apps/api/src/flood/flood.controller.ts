import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { Public } from '../common/decorators/roles.decorator';
import { FloodService } from './flood.service';

@Controller('flood')
@Public()
export class FloodController {
  constructor(private readonly floodService: FloodService) {}

  @Get('forecast')
  latestForAllDistricts() {
    return this.floodService.getLatestForAllDistricts();
  }

  @Get('forecast/:districtId')
  async forecast(
    @Param('districtId') districtId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const fromDate = from ? new Date(from) : new Date();
    const toDate = to ? new Date(to) : new Date(fromDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const rows = await this.floodService.getForecast(districtId, fromDate, toDate);
    if (!rows.length) throw new NotFoundException('No flood forecast for this district');
    return rows;
  }
}

import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { Public } from '../common/decorators/roles.decorator';
import { MarineService } from './marine.service';

@Controller('marine')
@Public()
export class MarineController {
  constructor(private readonly marineService: MarineService) {}

  @Get('forecast')
  latestForAllDistricts() {
    return this.marineService.getLatestForAllDistricts();
  }

  @Get('forecast/:districtId')
  async forecast(
    @Param('districtId') districtId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const fromDate = from ? new Date(from) : new Date();
    const toDate = to
      ? new Date(to)
      : new Date(fromDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const rows = await this.marineService.getForecast(districtId, fromDate, toDate);
    if (!rows.length) throw new NotFoundException('No marine forecast for this district');
    return rows;
  }
}

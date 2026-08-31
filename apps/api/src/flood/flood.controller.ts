import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { Public } from '../common/decorators/roles.decorator';
import { FloodService } from './flood.service';

@Controller('flood')
@Public()
export class FloodController {
  constructor(private readonly floodService: FloodService) {}

  /** Latest forecast row for every station. */
  @Get('forecast')
  latestForAllStations() {
    return this.floodService.getLatestForAllStations();
  }

  /** 30-day forecast for a single station by ID or stationCode. */
  @Get('forecast/station/:stationId')
  async forecastByStation(
    @Param('stationId') stationId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const fromDate = from ? new Date(from) : new Date();
    const toDate = to ? new Date(to) : new Date(fromDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const rows = await this.floodService.getForecastByStation(stationId, fromDate, toDate);
    if (!rows.length) throw new NotFoundException('No flood forecast for this station');
    return rows;
  }

  /** All station forecasts within a district, grouped by station. */
  @Get('forecast/district/:districtId')
  async forecastByDistrict(
    @Param('districtId') districtId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const fromDate = from ? new Date(from) : new Date();
    const toDate = to ? new Date(to) : new Date(fromDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const rows = await this.floodService.getForecastByDistrict(districtId, fromDate, toDate);
    if (!rows.length) throw new NotFoundException('No flood forecast for stations in this district');
    return rows;
  }
}

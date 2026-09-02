import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { EmissionsService } from './emissions.service';
import { Public } from '../common/decorators/roles.decorator';

@Controller('emissions')
@Public()
export class EmissionsController {
  constructor(private readonly emissionsService: EmissionsService) {}

  /**
   * GET /emissions
   * All national GHG readings, optionally filtered.
   *
   * Query params:
   *   indicator  — filter by indicator code (e.g. EN.GHG.ALL.MT.CE.AR5)
   *   from       — start year (inclusive)
   *   to         — end year (inclusive)
   */
  @Get()
  getAll(
    @Query('indicator') indicator?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const fromYear = from ? parseInt(from, 10) : undefined;
    const toYear = to ? parseInt(to, 10) : undefined;
    return this.emissionsService.getAll(indicator, fromYear, toYear);
  }

  /** GET /emissions/indicators — list all indicator codes available in the DB. */
  @Get('indicators')
  getIndicators() {
    return this.emissionsService.getIndicators();
  }

  /** GET /emissions/:year — all indicator readings for a specific year. */
  @Get(':year')
  getByYear(@Param('year', ParseIntPipe) year: number) {
    return this.emissionsService.getByYear(year);
  }
}

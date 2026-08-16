import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { Public } from '../common/decorators/roles.decorator';

@Controller('weather')
@Public()
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('current')
  async latestCurrentForAllDistricts() {
    return this.weatherService.getLatestCurrentForAllDistricts();
  }

  @Get('current/:districtId')
  async latestCurrent(@Param('districtId') districtId: string) {
    const reading = await this.weatherService.getLatestCurrent(districtId);
    if (!reading) throw new NotFoundException('No current weather reading for this district');
    return reading;
  }

  @Get('hourly/:districtId')
  hourlyForecast(
    @Param('districtId') districtId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const fromDate = from ? new Date(from) : new Date();
    const toDate = to ? new Date(to) : new Date(fromDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    return this.weatherService.getHourlyForecast(districtId, fromDate, toDate);
  }

  @Get('daily/:districtId')
  dailyForecast(
    @Param('districtId') districtId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const fromDate = from ? new Date(from) : new Date();
    const toDate = to ? new Date(to) : new Date(fromDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    return this.weatherService.getDailyForecast(districtId, fromDate, toDate);
  }

  @Get('air-quality')
  async latestAirQualityForAllDistricts() {
    return this.weatherService.getLatestAirQualityForAllDistricts();
  }

  @Get('air-quality/:districtId')
  async latestAirQuality(@Param('districtId') districtId: string) {
    const reading = await this.weatherService.getLatestAirQuality(districtId);
    if (!reading) throw new NotFoundException('No air quality reading for this district');
    return reading;
  }
}

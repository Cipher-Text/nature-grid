import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { Public } from '../common/decorators/roles.decorator';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Public()
  @Get('platform')
  getPlatformMetrics() {
    return this.metricsService.getPlatformMetrics();
  }
}

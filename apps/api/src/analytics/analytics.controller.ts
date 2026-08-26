import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Roles('ADMIN')
  @Get('admin')
  getAdminDashboard() {
    return this.analyticsService.getAdminDashboard();
  }

  @Roles('MODERATOR')
  @Get('moderator')
  getModeratorDashboard() {
    return this.analyticsService.getModeratorDashboard();
  }

  @Roles('GOVERNMENT')
  @Get('government')
  getGovernmentDashboard() {
    return this.analyticsService.getGovernmentDashboard();
  }

  @Roles('RESEARCHER')
  @Get('researcher')
  getResearcherDashboard() {
    return this.analyticsService.getResearcherDashboard();
  }

  @Roles('ORGANIZATION_ADMIN')
  @Get('orgadmin')
  getOrgAdminDashboard() {
    return this.analyticsService.getOrgAdminDashboard();
  }
}

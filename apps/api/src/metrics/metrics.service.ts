import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class MetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlatformMetrics() {
    const [
      activeAlerts,
      emergencyAlerts,
      verifiedReports,
      publicDatasets,
      researchGradeObservations,
      districtRows,
      activeRestorationProjects,
      reportsByCategoryRaw,
      restorationImpact,
    ] = await Promise.all([
      this.prisma.alert.count({ where: { status: 'ACTIVE' } }),
      this.prisma.alert.count({ where: { status: 'ACTIVE', severity: 'EMERGENCY' } }),
      this.prisma.citizenReport.count({ where: { status: 'VERIFIED' } }),
      this.prisma.dataset.count({ where: { accessPolicy: 'PUBLIC' } }),
      this.prisma.observation.count({ where: { trustLevel: 'RESEARCH_GRADE' } }),
      this.prisma.observation.findMany({
        where: { trustLevel: 'RESEARCH_GRADE', districtId: { not: null } },
        distinct: ['districtId'],
        select: { districtId: true },
      }),
      this.prisma.restorationProject.count({ where: { status: { in: ['ACTIVE', 'PLANNED'] } } }),
      this.prisma.citizenReport.groupBy({
        by: ['category'],
        where: { status: { in: ['VERIFIED', 'RESOLVED'] } },
        _count: { _all: true },
        orderBy: { _count: { category: 'desc' } },
      }),
      this.prisma.projectActivity.aggregate({
        _sum: { volunteersCount: true, areaAffectedHa: true },
      }),
    ]);

    return {
      activeAlerts,
      emergencyAlerts,
      verifiedReports,
      publicDatasets,
      researchGradeObservations,
      districtsWithResearchGradeObservations: districtRows.length,
      activeRestorationProjects,
      reportsByCategory: reportsByCategoryRaw.map((r) => ({
        category: r.category,
        count: r._count._all,
      })),
      restorationVolunteers: restorationImpact._sum.volunteersCount ?? 0,
      restorationAreaHa: restorationImpact._sum.areaAffectedHa ?? 0,
    };
  }
}

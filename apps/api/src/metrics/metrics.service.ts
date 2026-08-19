import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class MetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlatformMetrics() {
    const [activeAlerts, emergencyAlerts, verifiedReports, publicDatasets, researchGradeObservations, districtRows] =
      await Promise.all([
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
      ]);

    return {
      activeAlerts,
      emergencyAlerts,
      verifiedReports,
      publicDatasets,
      researchGradeObservations,
      districtsWithResearchGradeObservations: districtRows.length,
    };
  }
}

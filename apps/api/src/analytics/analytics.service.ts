import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

// ─── Date helpers ─────────────────────────────────────────────────────────────

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(): Date {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function monthsAgo(n: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Group an array of dates by YYYY-MM-DD label and return a trend array
function groupByDay(dates: Date[]): Array<{ day: string; count: number }> {
  const map = new Map<string, number>();
  for (const d of dates) {
    const key = d.toISOString().slice(0, 10);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => a.day.localeCompare(b.day));
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Admin ──────────────────────────────────────────────────────────────────

  async getAdminDashboard() {
    const [
      usersByRole,
      reportsByStatus,
      activeAlertsBySeverity,
      pendingReports,
      auditEventsToday,
      totalOrganizations,
      observationsThisMonth,
      totalSpecies,
      totalDatasets,
    ] = await Promise.all([
      this.prisma.user.groupBy({ by: ['role'], _count: { id: true } }),
      this.prisma.citizenReport.groupBy({ by: ['status'], _count: { id: true } }),
      this.prisma.alert.groupBy({
        by: ['severity'],
        where: { status: 'ACTIVE' },
        _count: { id: true },
      }),
      this.prisma.citizenReport.count({
        where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } },
      }),
      this.prisma.auditEvent.count({
        where: { createdAt: { gte: startOfToday() } },
      }),
      this.prisma.organization.count(),
      this.prisma.observation.count({
        where: { createdAt: { gte: startOfMonth() } },
      }),
      this.prisma.species.count(),
      this.prisma.dataset.count({ where: { isPublished: true } }),
    ]);

    const totalUsers = usersByRole.reduce((s, r) => s + r._count.id, 0);

    return {
      users: {
        total: totalUsers,
        byRole: usersByRole.map((r) => ({ role: r.role, count: r._count.id })),
      },
      reports: {
        pendingReview: pendingReports,
        byStatus: reportsByStatus.map((r) => ({
          status: r.status,
          count: r._count.id,
        })),
      },
      alerts: {
        activeBySeverity: activeAlertsBySeverity.map((a) => ({
          severity: a.severity,
          count: a._count.id,
        })),
      },
      platform: {
        organizations: totalOrganizations,
        publishedDatasets: totalDatasets,
        speciesRecorded: totalSpecies,
        observationsThisMonth,
        auditEventsToday,
      },
    };
  }

  // ── Moderator ──────────────────────────────────────────────────────────────

  async getModeratorDashboard() {
    const [
      reportsByStatus,
      reportsByCategory,
      reviewedToday,
      recentReports,
    ] = await Promise.all([
      this.prisma.citizenReport.groupBy({ by: ['status'], _count: { id: true } }),
      this.prisma.citizenReport.groupBy({ by: ['category'], _count: { id: true } }),
      this.prisma.citizenReport.count({
        where: {
          status: { in: ['VERIFIED', 'REJECTED', 'RESOLVED'] },
          updatedAt: { gte: startOfToday() },
        },
      }),
      this.prisma.citizenReport.findMany({
        where: { createdAt: { gte: daysAgo(7) } },
        select: { createdAt: true },
      }),
    ]);

    const pending = reportsByStatus.find((r) => r.status === 'SUBMITTED')?._count.id ?? 0;
    const underReview = reportsByStatus.find((r) => r.status === 'UNDER_REVIEW')?._count.id ?? 0;

    return {
      queue: {
        pending,
        underReview,
        totalPending: pending + underReview,
        reviewedToday,
      },
      byStatus: reportsByStatus.map((r) => ({ status: r.status, count: r._count.id })),
      byCategory: reportsByCategory.map((r) => ({ category: r.category, count: r._count.id })),
      submissionTrend: groupByDay(recentReports.map((r) => r.createdAt)),
    };
  }

  // ── Government ─────────────────────────────────────────────────────────────

  async getGovernmentDashboard() {
    const thirtyDaysAgo = daysAgo(30);

    const [
      activeAlertsBySeverity,
      totalActiveAlerts,
      verifiedReportsByCategory,
      alertsWithDistrict,
      topDistrictsByReports,
      divisionsClimate,
    ] = await Promise.all([
      this.prisma.alert.groupBy({
        by: ['severity'],
        where: { status: 'ACTIVE' },
        _count: { id: true },
      }),
      this.prisma.alert.count({ where: { status: 'ACTIVE' } }),
      this.prisma.citizenReport.groupBy({
        by: ['category'],
        where: { status: 'VERIFIED', createdAt: { gte: thirtyDaysAgo } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
      // Active alerts with district+division for geographic grouping
      this.prisma.alert.findMany({
        where: { status: 'ACTIVE', districtId: { not: null } },
        select: {
          severity: true,
          district: { select: { name: true, division: { select: { name: true } } } },
        },
      }),
      // Top districts by verified report count (last 30 days) — raw SQL for JOIN+GROUP
      this.prisma.$queryRaw<Array<{ districtName: string; divisionName: string; count: bigint }>>(
        Prisma.sql`
          SELECT d.name AS "districtName", d2.name AS "divisionName", COUNT(r.id)::bigint AS count
          FROM "CitizenReport" r
          JOIN "District" d ON r."districtId" = d.id
          JOIN "Division" d2 ON d."divisionId" = d2.id
          WHERE r.status = 'VERIFIED'
            AND r."createdAt" >= ${thirtyDaysAgo}
          GROUP BY d.id, d.name, d2.name
          ORDER BY count DESC
          LIMIT 8
        `,
      ),
      // All divisions with their 30-day climate averages
      this.prisma.division.findMany({
        select: {
          name: true,
          avgTemp30d: true,
          avgPm25_30d: true,
          totalPrecip30d: true,
          avgHumidity30d: true,
        },
        orderBy: { name: 'asc' },
      }),
    ]);

    // Aggregate active alerts by division
    const alertsByDivision = new Map<string, number>();
    for (const alert of alertsWithDistrict) {
      const div = alert.district?.division?.name ?? 'Unknown';
      alertsByDivision.set(div, (alertsByDivision.get(div) ?? 0) + 1);
    }

    return {
      alerts: {
        total: totalActiveAlerts,
        bySeverity: activeAlertsBySeverity.map((a) => ({
          severity: a.severity,
          count: a._count.id,
        })),
        byDivision: Array.from(alertsByDivision.entries())
          .map(([division, count]) => ({ division, count }))
          .sort((a, b) => b.count - a.count),
      },
      reports: {
        verifiedLast30d: verifiedReportsByCategory.reduce((s, r) => s + r._count.id, 0),
        byCategory: verifiedReportsByCategory.map((r) => ({
          category: r.category,
          count: r._count.id,
        })),
        topDistricts: topDistrictsByReports.map((row) => ({
          district: row.districtName,
          division: row.divisionName,
          count: Number(row.count),
        })),
      },
      climate: {
        divisions: divisionsClimate.map((d) => ({
          name: d.name,
          avgTemp: d.avgTemp30d,
          avgPm25: d.avgPm25_30d,
          totalPrecip: d.totalPrecip30d,
          avgHumidity: d.avgHumidity30d,
        })),
      },
    };
  }

  // ── Researcher ─────────────────────────────────────────────────────────────

  async getResearcherDashboard() {
    const sixMonthsAgo = monthsAgo(6);

    const [
      totalSpecies,
      totalOccurrences,
      researchGradeObs,
      observationsByCategory,
      observationsByTrust,
      topSpecies,
      recentOccurrences,
    ] = await Promise.all([
      this.prisma.species.count(),
      this.prisma.occurrence.count(),
      this.prisma.observation.count({ where: { trustLevel: 'RESEARCH_GRADE' } }),
      this.prisma.observation.groupBy({ by: ['category'], _count: { id: true } }),
      this.prisma.observation.groupBy({ by: ['trustLevel'], _count: { id: true } }),
      // Top 10 species by occurrence count
      this.prisma.$queryRaw<Array<{ speciesId: string; name: string; occurrences: bigint }>>(
        Prisma.sql`
          SELECT s.id AS "speciesId", s."canonicalName" AS name, COUNT(o.id)::bigint AS occurrences
          FROM "Species" s
          JOIN "Occurrence" o ON o."speciesId" = s.id
          GROUP BY s.id, s."canonicalName"
          ORDER BY occurrences DESC
          LIMIT 10
        `,
      ),
      // Monthly occurrence trend — last 6 months
      this.prisma.$queryRaw<Array<{ month: string; count: bigint }>>(
        Prisma.sql`
          SELECT to_char("createdAt", 'YYYY-MM') AS month, COUNT(*)::bigint AS count
          FROM "Occurrence"
          WHERE "createdAt" >= ${sixMonthsAgo}
          GROUP BY 1
          ORDER BY 1
        `,
      ),
    ]);

    const totalObservations = observationsByTrust.reduce((s, r) => s + r._count.id, 0);

    return {
      biodiversity: {
        totalSpecies,
        totalOccurrences,
        topSpecies: topSpecies.map((s) => ({
          name: s.name,
          occurrences: Number(s.occurrences),
        })),
        monthlyTrend: recentOccurrences.map((r) => ({
          month: r.month,
          count: Number(r.count),
        })),
      },
      observations: {
        total: totalObservations,
        researchGrade: researchGradeObs,
        researchGradePct:
          totalObservations > 0
            ? Math.round((researchGradeObs / totalObservations) * 100)
            : 0,
        byCategory: observationsByCategory.map((r) => ({
          category: r.category,
          count: r._count.id,
        })),
        byTrust: observationsByTrust.map((r) => ({
          trustLevel: r.trustLevel,
          count: r._count.id,
        })),
      },
    };
  }

  // ── OrgAdmin ───────────────────────────────────────────────────────────────

  async getOrgAdminDashboard() {
    const thirtyDaysAgo = daysAgo(30);

    const [
      projectsByStatus,
      projectsByCategory,
      recentProjects,
      topProjects,
      totalParticipants,
    ] = await Promise.all([
      this.prisma.restorationProject.groupBy({ by: ['status'], _count: { id: true } }),
      this.prisma.restorationProject.groupBy({ by: ['category'], _count: { id: true } }),
      this.prisma.restorationProject.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      // Top 5 projects by participant count
      this.prisma.$queryRaw<Array<{ id: string; title: string; participants: bigint }>>(
        Prisma.sql`
          SELECT p.id, p.title, COUNT(rp."userId")::bigint AS participants
          FROM "RestorationProject" p
          LEFT JOIN "RestorationParticipant" rp ON rp."projectId" = p.id
          GROUP BY p.id, p.title
          ORDER BY participants DESC
          LIMIT 5
        `,
      ),
      this.prisma.restorationParticipant.count(),
    ]);

    const totalProjects = projectsByStatus.reduce((s, r) => s + r._count.id, 0);
    const activeProjects =
      (projectsByStatus.find((r) => r.status === 'ACTIVE')?._count.id ?? 0) +
      (projectsByStatus.find((r) => r.status === 'PLANNED')?._count.id ?? 0);

    return {
      projects: {
        total: totalProjects,
        active: activeProjects,
        newLast30d: recentProjects,
        byStatus: projectsByStatus.map((r) => ({ status: r.status, count: r._count.id })),
        byCategory: projectsByCategory.map((r) => ({
          category: r.category,
          count: r._count.id,
        })),
      },
      engagement: {
        totalParticipants,
        avgParticipantsPerProject:
          totalProjects > 0 ? Math.round(totalParticipants / totalProjects) : 0,
        topProjects: topProjects.map((p) => ({
          id: p.id,
          title: p.title,
          participants: Number(p.participants),
        })),
      },
    };
  }
}

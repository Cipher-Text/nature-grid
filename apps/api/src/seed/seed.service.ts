import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EmissionUnit, OrganizationType, PollutantType, PollutionSourceType, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';

const DEFAULT_SEED_PASSWORD = 'NatureGrid123!';
const SALT_ROUNDS = 12;

const SEED_USERS: {
  email: string;
  displayName: string;
  role: UserRole;
}[] = [
  { email: 'citizen@naturegrid.bd', displayName: 'Seed Citizen', role: 'CITIZEN' },
  { email: 'researcher@naturegrid.bd', displayName: 'Seed Researcher', role: 'RESEARCHER' },
  {
    email: 'organization.admin@naturegrid.bd',
    displayName: 'Seed Organization Admin',
    role: 'ORGANIZATION_ADMIN',
  },
  { email: 'government@naturegrid.bd', displayName: 'Seed Government', role: 'GOVERNMENT' },
  { email: 'moderator@naturegrid.bd', displayName: 'Seed Moderator', role: 'MODERATOR' },
  { email: 'admin@naturegrid.bd', displayName: 'Seed Admin', role: 'ADMIN' },
];

const SEED_ORGANIZATION = {
  name: 'Nature Grid Bangladesh',
  type: 'NGO' as OrganizationType,
  description: 'Seed organization for local development and admin workflows.',
  website: 'https://naturegrid.bd',
  country: 'Bangladesh',
  isVerified: true,
};

const SEED_ORGANIZATIONS: {
  name: string;
  type: OrganizationType;
  description: string;
  website: string;
  country: string;
}[] = [
  {
    name: 'Bangladesh Poribesh Andolon (BAPA)',
    type: 'NGO',
    description:
      'A nationwide civic movement and advocacy platform focused on river protection, air quality management, urban environment improvement, and climate policy in Bangladesh.',
    website: 'https://www.bapa.org.bd',
    country: 'Bangladesh',
  },
  {
    name: 'Bangladesh Environment and Development Society (BEDS)',
    type: 'NGO',
    description:
      'Dedicated to coastal ecosystem restoration, mangrove preservation, biodiversity conservation, and building sustainable eco-villages around the Sundarbans.',
    website: 'https://www.bedsbd.org',
    country: 'Bangladesh',
  },
  {
    name: 'Center for Natural Resource Studies (CNRS)',
    type: 'NGO',
    description:
      'A leading non-governmental organization specializing in wetland (Haor) management, community-based natural resource conservation, and ecosystem restoration.',
    website: 'https://cnrs.org.bd',
    country: 'Bangladesh',
  },
  {
    name: 'Environment and Social Development Organization (ESDO)',
    type: 'NGO',
    description:
      'Promotes environmental justice, toxic chemical elimination, single-use plastic reduction campaigns, and sustainable waste management policies.',
    website: 'https://esdo.org',
    country: 'Bangladesh',
  },
  {
    name: 'WildTeam',
    type: 'NGO',
    description:
      'A wildlife conservation organization focused on Bengal tiger protection, human-wildlife conflict mitigation, and biodiversity research in the Sundarbans.',
    website: 'https://www.wildteam.org.bd',
    country: 'Bangladesh',
  },
  {
    name: 'International Centre for Climate Change and Development (ICCCAD)',
    type: 'RESEARCH_INSTITUTION',
    description:
      'A global research institute based in Bangladesh conducting action research, policy analysis, and capacity building on climate change adaptation.',
    website: 'https://www.icccad.net',
    country: 'Bangladesh',
  },
  {
    name: 'International Union for Conservation of Nature (IUCN) Bangladesh',
    type: 'INTERNATIONAL_ORG',
    description:
      'Global authority on the status of the natural world, conducting species Red List assessments, nature-based solutions, and ecosystem conservation initiatives.',
    website: 'https://www.iucn.org',
    country: 'Bangladesh',
  },
  {
    name: 'Department of Environment (DoE)',
    type: 'GOVERNMENT_AGENCY',
    description:
      'Government department under the Ministry of Environment, Forest and Climate Change responsible for environmental enforcement, pollution control, and clearance.',
    website: 'http://www.doe.gov.bd',
    country: 'Bangladesh',
  },
  {
    name: 'Bangladesh Forest Department (BFD)',
    type: 'GOVERNMENT_AGENCY',
    description:
      'Government agency responsible for forest resource management, biodiversity protection, wildlife conservation, and protected areas across Bangladesh.',
    website: 'http://www.bforest.gov.bd',
    country: 'Bangladesh',
  },
  {
    name: 'World Wide Fund for Nature (WWF)',
    type: 'INTERNATIONAL_ORG',
    description:
      'Global environmental non-profit working on wilderness preservation, climate mitigation, and reducing human impact on the environment.',
    website: 'https://www.worldwildlife.org',
    country: 'Switzerland',
  },
];

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'production') {
      await this.bootstrapProductionAdmin();
      await this.seedRealOrganizations();
      return;
    }
    await this.seedUsers();
    await this.seedOrganization();
    await this.seedRealOrganizations();
    await this.seedPollutionSources();
  }

  /**
   * Production-only bootstrap: creates the first ADMIN account from env vars.
   * Runs only when BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD are set,
   * and only if no ADMIN user exists yet. Safe to leave in production code —
   * it is a no-op once the account exists or the env vars are removed.
   *
   * After first boot: remove BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD
   * from your deployment environment.
   */
  private async bootstrapProductionAdmin() {
    const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim();
    const password = process.env.BOOTSTRAP_ADMIN_PASSWORD?.trim();

    if (!email || !password) return;

    const existing = await this.prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (existing) {
      this.logger.log('Production admin already exists — skipping bootstrap');
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await this.prisma.user.create({
      data: {
        email,
        displayName: 'Admin',
        passwordHash,
        role: 'ADMIN',
        isActive: true,
        profile: { create: {} },
      },
    });

    this.logger.warn(
      `Bootstrap admin created: ${email} — remove BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD from your environment now`,
    );
  }

  private async seedUsers() {
    const passwordHash = await bcrypt.hash(DEFAULT_SEED_PASSWORD, SALT_ROUNDS);

    for (const user of SEED_USERS) {
      await this.prisma.user.upsert({
        where: { email: user.email },
        update: {
          displayName: user.displayName,
          role: user.role,
          isActive: true,
        },
        create: {
          ...user,
          passwordHash,
          isActive: true,
        },
      });
    }

    this.logger.log(`Seed users ready: ${SEED_USERS.length} accounts`);
  }

  private async seedOrganization() {
    const existing = await this.prisma.organization.findFirst({
      where: { name: SEED_ORGANIZATION.name },
    });
    if (existing) {
      await this.prisma.organization.update({
        where: { id: existing.id },
        data: SEED_ORGANIZATION,
      });
      const admin = await this.prisma.user.findUnique({
        where: { email: 'organization.admin@naturegrid.bd' },
        select: { id: true },
      });
      if (admin) {
        await this.prisma.organizationMembership.upsert({
          where: { organizationId_userId: { organizationId: existing.id, userId: admin.id } },
          create: { organizationId: existing.id, userId: admin.id, role: 'ADMIN' },
          update: { role: 'ADMIN' },
        });
      }
      return;
    }

    const organization = await this.prisma.organization.create({ data: SEED_ORGANIZATION });
    const admin = await this.prisma.user.findUnique({
      where: { email: 'organization.admin@naturegrid.bd' },
      select: { id: true },
    });
    if (admin) {
      await this.prisma.organizationMembership.create({
        data: { organizationId: organization.id, userId: admin.id, role: 'ADMIN' },
      });
    }
    this.logger.log(`Seed organization ready: ${SEED_ORGANIZATION.name}`);
  }

  private async seedRealOrganizations() {
    for (const org of SEED_ORGANIZATIONS) {
      const existing = await this.prisma.organization.findFirst({ where: { name: org.name } });
      if (existing) {
        await this.prisma.organization.update({ where: { id: existing.id }, data: org });
      } else {
        await this.prisma.organization.create({ data: org });
      }
    }
    this.logger.log(`Real organizations seeded: ${SEED_ORGANIZATIONS.length} records`);
  }

  private async seedPollutionSources() {
    const admin = await this.prisma.user.findUnique({
      where: { email: 'admin@naturegrid.bd' },
      select: { id: true },
    });
    if (!admin) return;

    const districts = await this.prisma.district.findMany({
      where: {
        name: {
          in: ['Dhaka', 'Chattogram', 'Dinajpur', 'Brahmanbaria', 'Narayanganj', 'Patuakhali', 'Gazipur'],
        },
      },
      select: { id: true, name: true },
    });
    const byName: Record<string, string> = Object.fromEntries(districts.map((d) => [d.name, d.id]));

    const SEED_SOURCES: {
      name: string;
      type: PollutionSourceType;
      description: string;
      districtKey: string;
      lat: number;
      lng: number;
      entries: { pollutant: PollutantType; value: number; unit: EmissionUnit; periodStart: string; periodEnd: string }[];
    }[] = [
      {
        name: 'Hazaribagh Tannery Complex',
        type: 'FACTORY',
        description: 'Cluster of leather tanneries historically operating along the Buriganga riverbank. Responsible for significant chromium and organic effluent discharge.',
        districtKey: 'Dhaka',
        lat: 23.7210,
        lng: 90.3875,
        entries: [
          { pollutant: 'CO2', value: 12400, unit: 'TONS_PER_YEAR', periodStart: '2024-01-01', periodEnd: '2024-12-31' },
          { pollutant: 'SOX', value: 320, unit: 'TONS_PER_YEAR', periodStart: '2024-01-01', periodEnd: '2024-12-31' },
        ],
      },
      {
        name: 'Ghorashal Combined Cycle Power Plant',
        type: 'POWER_PLANT',
        description: 'Large natural-gas-fired combined-cycle power station supplying electricity to Dhaka and surrounding regions.',
        districtKey: 'Brahmanbaria',
        lat: 23.9982,
        lng: 90.7140,
        entries: [
          { pollutant: 'CO2', value: 980000, unit: 'TONS_PER_YEAR', periodStart: '2024-01-01', periodEnd: '2024-12-31' },
          { pollutant: 'NOX', value: 1850, unit: 'TONS_PER_YEAR', periodStart: '2024-01-01', periodEnd: '2024-12-31' },
        ],
      },
      {
        name: 'Barapukuria Coal Power Station',
        type: 'POWER_PLANT',
        description: 'Coal-fired thermal power plant adjacent to the Barapukuria coal mine, one of the largest coal power sources in northern Bangladesh.',
        districtKey: 'Dinajpur',
        lat: 25.4512,
        lng: 88.9921,
        entries: [
          { pollutant: 'CO2', value: 2100000, unit: 'TONS_PER_YEAR', periodStart: '2024-01-01', periodEnd: '2024-12-31' },
          { pollutant: 'PM25', value: 4200, unit: 'TONS_PER_YEAR', periodStart: '2024-01-01', periodEnd: '2024-12-31' },
          { pollutant: 'SOX', value: 7800, unit: 'TONS_PER_YEAR', periodStart: '2024-01-01', periodEnd: '2024-12-31' },
        ],
      },
      {
        name: 'Narayanganj Textile & Dyeing Cluster',
        type: 'FACTORY',
        description: 'Dense concentration of ready-made garment dyeing and finishing factories discharging dye effluents and chemical waste into the Shitalakkhya river.',
        districtKey: 'Narayanganj',
        lat: 23.6230,
        lng: 90.4983,
        entries: [
          { pollutant: 'NOX', value: 85, unit: 'TONS_PER_YEAR', periodStart: '2024-01-01', periodEnd: '2024-12-31' },
          { pollutant: 'VOC', value: 460, unit: 'TONS_PER_YEAR', periodStart: '2024-01-01', periodEnd: '2024-12-31' },
        ],
      },
      {
        name: 'Payra Coal Power Plant',
        type: 'POWER_PLANT',
        description: 'Large ultra-supercritical coal-fired power plant located on the coast of Patuakhali, operational since 2022. 1,320 MW installed capacity.',
        districtKey: 'Patuakhali',
        lat: 21.9653,
        lng: 90.2800,
        entries: [
          { pollutant: 'CO2', value: 7500000, unit: 'TONS_PER_YEAR', periodStart: '2024-01-01', periodEnd: '2024-12-31' },
          { pollutant: 'PM25', value: 9600, unit: 'TONS_PER_YEAR', periodStart: '2024-01-01', periodEnd: '2024-12-31' },
          { pollutant: 'SOX', value: 15200, unit: 'TONS_PER_YEAR', periodStart: '2024-01-01', periodEnd: '2024-12-31' },
          { pollutant: 'NOX', value: 8400, unit: 'TONS_PER_YEAR', periodStart: '2024-01-01', periodEnd: '2024-12-31' },
        ],
      },
      {
        name: 'Chittagong Steel Re-rolling Mills',
        type: 'FACTORY',
        description: 'Group of steel re-rolling mills processing imported scrap metal and ship-breaking steel, operating along the Karnaphuli river industrial corridor.',
        districtKey: 'Chattogram',
        lat: 22.3410,
        lng: 91.8283,
        entries: [
          { pollutant: 'CO2', value: 340000, unit: 'TONS_PER_YEAR', periodStart: '2024-01-01', periodEnd: '2024-12-31' },
          { pollutant: 'PM10', value: 2100, unit: 'TONS_PER_YEAR', periodStart: '2024-01-01', periodEnd: '2024-12-31' },
        ],
      },
      {
        name: 'Gazipur Brick Kiln Belt',
        type: 'FACTORY',
        description: 'Dense concentration of Fixed Chimney Bull Trench Kilns (FCBTK) producing fired clay bricks for Dhaka metropolitan construction. Seasonal operation October–May.',
        districtKey: 'Gazipur',
        lat: 24.0028,
        lng: 90.4180,
        entries: [
          { pollutant: 'PM25', value: 1800, unit: 'TONS_PER_YEAR', periodStart: '2024-10-01', periodEnd: '2025-05-31' },
          { pollutant: 'CO2', value: 580000, unit: 'TONS_PER_YEAR', periodStart: '2024-10-01', periodEnd: '2025-05-31' },
          { pollutant: 'CO', value: 3400, unit: 'TONS_PER_YEAR', periodStart: '2024-10-01', periodEnd: '2025-05-31' },
        ],
      },
    ];

    let created = 0;
    for (const s of SEED_SOURCES) {
      const districtId = byName[s.districtKey];
      if (!districtId) continue;

      const existing = await this.prisma.pollutionSource.findFirst({ where: { name: s.name } });
      if (existing) continue;

      const source = await this.prisma.pollutionSource.create({
        data: {
          name: s.name,
          type: s.type,
          description: s.description,
          districtId,
          lat: s.lat,
          lng: s.lng,
          isActive: true,
          createdById: admin.id,
        },
      });

      for (const e of s.entries) {
        await this.prisma.emissionEntry.create({
          data: {
            sourceId: source.id,
            pollutant: e.pollutant,
            value: e.value,
            unit: e.unit,
            periodStart: new Date(e.periodStart),
            periodEnd: new Date(e.periodEnd),
            reportedById: admin.id,
          },
        });
      }

      created++;
    }

    if (created > 0) {
      this.logger.log(`Pollution sources seeded: ${created} sources with emission entries`);
    }
  }
}

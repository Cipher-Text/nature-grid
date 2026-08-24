import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { OrganizationType, UserRole } from '@prisma/client';
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

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedUsers();
    await this.seedOrganization();
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

    this.logger.log(
      `Seed users ready: ${SEED_USERS.length} accounts, password "${DEFAULT_SEED_PASSWORD}"`,
    );
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
}

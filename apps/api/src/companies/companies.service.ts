import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CompanyType } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { clampPagination } from '../common/pagination';
import { COMPANY_SEED_DATA } from './companies.seed';
import { FACILITY_SEED_DATA } from '../facilities/facilities.seed';

const COMPANY_SELECT = {
  id: true,
  name: true,
  bnName: true,
  companyType: true,
  registrationNumber: true,
  establishedYear: true,
  employeeCount: true,
  website: true,
  isActive: true,
  headquarterDistrictId: true,
  headquarterDistrict: { select: { id: true, name: true } },
  parentCompanyId: true,
  parentCompany: { select: { id: true, name: true, companyType: true } },
  _count: { select: { facilities: true, subsidiaries: true } },
  createdAt: true,
  updatedAt: true,
} as const;

const COMPANY_DETAIL_SELECT = {
  ...COMPANY_SELECT,
  description: true,
  contactEmail: true,
  contactPhone: true,
  subsidiaries: {
    select: { id: true, name: true, companyType: true, isActive: true },
  },
  facilities: {
    select: {
      id: true,
      name: true,
      facilityType: true,
      complianceStatus: true,
      isActive: true,
      district: { select: { id: true, name: true } },
    },
    orderBy: { name: 'asc' as const },
  },
} as const;

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    this.logger.log('Synchronizing companies and industrial facilities...');
    await this.seedCompanies();
    await this.seedFacilities();
  }

  private async seedCompanies() {
    // First pass: create companies without parentCompanyId
    const existingCompanies = await this.prisma.company.findMany({ select: { id: true, name: true } });
    const nameToId = new Map(existingCompanies.map((company) => [company.name, company.id]));

    for (const entry of COMPANY_SEED_DATA) {
      if (entry.parentCompanyName) continue;
      if (nameToId.has(entry.name)) continue;

      let districtId: string | undefined;
      if (entry.headquarterDistrictName) {
        const d = await this.prisma.district.findFirst({
          where: { name: entry.headquarterDistrictName },
          select: { id: true },
        });
        districtId = d?.id;
      }

      const company = await this.prisma.company.create({
        data: {
          name: entry.name,
          bnName: entry.bnName,
          description: entry.description,
          companyType: entry.companyType,
          establishedYear: entry.establishedYear,
          employeeCount: entry.employeeCount,
          website: entry.website,
          headquarterDistrictId: districtId,
        },
        select: { id: true, name: true },
      });
      nameToId.set(company.name, company.id);
    }

    // Second pass: create subsidiaries (need parent IDs resolved)
    for (const entry of COMPANY_SEED_DATA) {
      if (!entry.parentCompanyName) continue;

      const parentId = nameToId.get(entry.parentCompanyName);
      if (!parentId) {
        this.logger.warn(`Parent company not found for seed: ${entry.parentCompanyName} (${entry.name})`);
        continue;
      }
      if (nameToId.has(entry.name)) continue;
      let districtId: string | undefined;
      if (entry.headquarterDistrictName) {
        const d = await this.prisma.district.findFirst({
          where: { name: entry.headquarterDistrictName },
          select: { id: true },
        });
        districtId = d?.id;
      }

      const company = await this.prisma.company.create({
        data: {
          name: entry.name,
          bnName: entry.bnName,
          description: entry.description,
          companyType: entry.companyType,
          establishedYear: entry.establishedYear,
          employeeCount: entry.employeeCount,
          website: entry.website,
          headquarterDistrictId: districtId,
          parentCompanyId: parentId,
        },
        select: { id: true, name: true },
      });
      nameToId.set(company.name, company.id);
    }

    this.logger.log(`Verified ${COMPANY_SEED_DATA.length} company seed records.`);
  }

  private async seedFacilities() {
    for (const entry of FACILITY_SEED_DATA) {
      const existingFacility = await this.prisma.industrialFacility.findFirst({
        where: { name: entry.name },
        select: { id: true },
      });
      if (existingFacility) continue;

      const district = await this.prisma.district.findFirst({
        where: { name: entry.districtName },
        select: { id: true },
      });
      if (!district) {
        this.logger.warn(`District not found for facility seed: ${entry.districtName} (${entry.name})`);
        continue;
      }

      const company = await this.prisma.company.findUnique({
        where: { name: entry.companyName },
        select: { id: true },
      });
      if (!company) {
        this.logger.warn(`Company not found for facility seed: ${entry.companyName} (${entry.name})`);
        continue;
      }

      await this.prisma.industrialFacility.create({
        data: {
          name: entry.name,
          bnName: entry.bnName,
          description: entry.description,
          facilityType: entry.facilityType,
          complianceStatus: entry.complianceStatus,
          companyId: company.id,
          lat: entry.lat,
          lng: entry.lng,
          districtId: district.id,
          establishedYear: entry.establishedYear,
          productionCapacity: entry.productionCapacity,
          landArea: entry.landArea,
          etpInstalled: entry.etpInstalled ?? false,
        },
      });
    }

    this.logger.log(`Seeded ${FACILITY_SEED_DATA.length} industrial facilities.`);
  }

  list(
    companyType?: CompanyType,
    districtId?: string,
    isActive?: boolean,
    rawPage = 1,
    rawLimit = 20,
  ) {
    const { page, pageSize } = clampPagination(rawPage, rawLimit, 50);
    const skip = (page - 1) * pageSize;
    const where = {
      ...(companyType ? { companyType } : {}),
      ...(districtId ? { headquarterDistrictId: districtId } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    };

    return Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { name: 'asc' },
        select: COMPANY_SELECT,
      }),
      this.prisma.company.count({ where }),
    ]).then(([data, total]) => ({ data, total, page, pageSize }));
  }

  async getById(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      select: COMPANY_DETAIL_SELECT,
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async create(dto: CreateCompanyDto, actor: JwtPayload) {
    return this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: dto.name,
          bnName: dto.bnName,
          description: dto.description,
          companyType: dto.companyType,
          registrationNumber: dto.registrationNumber,
          establishedYear: dto.establishedYear,
          employeeCount: dto.employeeCount,
          website: dto.website,
          contactEmail: dto.contactEmail,
          contactPhone: dto.contactPhone,
          headquarterDistrictId: dto.headquarterDistrictId,
          parentCompanyId: dto.parentCompanyId,
        },
        select: COMPANY_DETAIL_SELECT,
      });

      await tx.auditEvent.create({
        data: {
          action: 'COMPANY_CREATE',
          userId: actor.sub,
          entityType: 'Company',
          entityId: company.id,
        },
      });

      return company;
    });
  }

  async update(id: string, dto: UpdateCompanyDto, actor: JwtPayload) {
    const existing = await this.prisma.company.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Company not found');

    const [updated] = await this.prisma.$transaction([
      this.prisma.company.update({
        where: { id },
        data: {
          ...(dto.description !== undefined ? { description: dto.description } : {}),
          ...(dto.companyType !== undefined ? { companyType: dto.companyType } : {}),
          ...(dto.registrationNumber !== undefined ? { registrationNumber: dto.registrationNumber } : {}),
          ...(dto.establishedYear !== undefined ? { establishedYear: dto.establishedYear } : {}),
          ...(dto.employeeCount !== undefined ? { employeeCount: dto.employeeCount } : {}),
          ...(dto.website !== undefined ? { website: dto.website } : {}),
          ...(dto.contactEmail !== undefined ? { contactEmail: dto.contactEmail } : {}),
          ...(dto.contactPhone !== undefined ? { contactPhone: dto.contactPhone } : {}),
          ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
          ...(dto.headquarterDistrictId !== undefined ? { headquarterDistrictId: dto.headquarterDistrictId } : {}),
          ...(dto.parentCompanyId !== undefined ? { parentCompanyId: dto.parentCompanyId } : {}),
        },
        select: COMPANY_DETAIL_SELECT,
      }),
      this.prisma.auditEvent.create({
        data: {
          action: 'COMPANY_UPDATE',
          userId: actor.sub,
          entityType: 'Company',
          entityId: id,
          meta: { ...dto },
        },
      }),
    ]);

    return updated;
  }
}

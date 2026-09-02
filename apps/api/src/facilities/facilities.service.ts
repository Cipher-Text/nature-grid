import { Injectable, NotFoundException } from '@nestjs/common';
import { ComplianceStatus, FacilityType } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { clampPagination } from '../common/pagination';
import { resolveGeoHierarchy } from '../common/validate-district';

const COMPANY_INLINE = {
  select: {
    id: true,
    name: true,
    bnName: true,
    companyType: true,
    website: true,
  },
} as const;

const FACILITY_SELECT = {
  id: true,
  name: true,
  bnName: true,
  facilityType: true,
  complianceStatus: true,
  isActive: true,
  lat: true,
  lng: true,
  districtId: true,
  upazilaId: true,
  companyId: true,
  company: COMPANY_INLINE,
  createdAt: true,
  updatedAt: true,
  district: { select: { id: true, name: true } },
  upazila: { select: { id: true, name: true } },
} as const;

const FACILITY_DETAIL_SELECT = {
  ...FACILITY_SELECT,
  description: true,
  establishedYear: true,
  productionCapacity: true,
  landArea: true,
  etpInstalled: true,
  etpCapacity: true,
  unionId: true,
  union: { select: { id: true, name: true } },
  reports: {
    select: { id: true, title: true, status: true, category: true, createdAt: true },
    orderBy: { createdAt: 'desc' as const },
    take: 5,
  },
} as const;

@Injectable()
export class FacilitiesService {
  constructor(private readonly prisma: PrismaService) {}

  list(
    facilityType?: FacilityType,
    complianceStatus?: ComplianceStatus,
    districtId?: string,
    upazilaId?: string,
    companyId?: string,
    isActive?: boolean,
    rawPage = 1,
    rawLimit = 20,
  ) {
    const { page, pageSize } = clampPagination(rawPage, rawLimit, 50);
    const skip = (page - 1) * pageSize;
    const where = {
      ...(facilityType ? { facilityType } : {}),
      ...(complianceStatus ? { complianceStatus } : {}),
      ...(districtId ? { districtId } : {}),
      ...(upazilaId ? { upazilaId } : {}),
      ...(companyId ? { companyId } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    };

    return Promise.all([
      this.prisma.industrialFacility.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: FACILITY_SELECT,
      }),
      this.prisma.industrialFacility.count({ where }),
    ]).then(([data, total]) => ({ data, total, page, pageSize }));
  }

  async getById(id: string) {
    const facility = await this.prisma.industrialFacility.findUnique({
      where: { id },
      select: FACILITY_DETAIL_SELECT,
    });
    if (!facility) throw new NotFoundException('Facility not found');
    return facility;
  }

  async create(dto: CreateFacilityDto, actor: JwtPayload) {
    const geo = await resolveGeoHierarchy(this.prisma, dto);

    return this.prisma.$transaction(async (tx) => {
      const facility = await tx.industrialFacility.create({
        data: {
          name: dto.name,
          bnName: dto.bnName,
          description: dto.description,
          facilityType: dto.facilityType,
          companyId: dto.companyId,
          lat: dto.lat,
          lng: dto.lng,
          districtId: dto.districtId,
          upazilaId: geo.upazilaId,
          unionId: geo.unionId,
          establishedYear: dto.establishedYear,
          productionCapacity: dto.productionCapacity,
          landArea: dto.landArea,
          etpInstalled: dto.etpInstalled ?? false,
          etpCapacity: dto.etpCapacity,
        },
        select: FACILITY_DETAIL_SELECT,
      });

      await tx.auditEvent.create({
        data: {
          action: 'FACILITY_CREATE',
          userId: actor.sub,
          entityType: 'IndustrialFacility',
          entityId: facility.id,
        },
      });

      return facility;
    });
  }

  async update(id: string, dto: UpdateFacilityDto, actor: JwtPayload) {
    const existing = await this.prisma.industrialFacility.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Facility not found');

    const [updated] = await this.prisma.$transaction([
      this.prisma.industrialFacility.update({
        where: { id },
        data: {
          ...(dto.complianceStatus !== undefined ? { complianceStatus: dto.complianceStatus } : {}),
          ...(dto.description !== undefined ? { description: dto.description } : {}),
          ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
          ...(dto.companyId !== undefined ? { companyId: dto.companyId } : {}),
          ...(dto.etpInstalled !== undefined ? { etpInstalled: dto.etpInstalled } : {}),
          ...(dto.etpCapacity !== undefined ? { etpCapacity: dto.etpCapacity } : {}),
          ...(dto.productionCapacity !== undefined ? { productionCapacity: dto.productionCapacity } : {}),
        },
        select: FACILITY_DETAIL_SELECT,
      }),
      this.prisma.auditEvent.create({
        data: {
          action: 'FACILITY_UPDATE',
          userId: actor.sub,
          entityType: 'IndustrialFacility',
          entityId: id,
          meta: { ...dto },
        },
      }),
    ]);

    return updated;
  }

  async remove(id: string, actor: JwtPayload) {
    const existing = await this.prisma.industrialFacility.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Facility not found');

    await this.prisma.$transaction([
      this.prisma.industrialFacility.delete({ where: { id } }),
      this.prisma.auditEvent.create({
        data: {
          action: 'FACILITY_DELETE',
          userId: actor.sub,
          entityType: 'IndustrialFacility',
          entityId: id,
        },
      }),
    ]);
  }
}

import { BadRequestException } from '@nestjs/common';
import type { PrismaService } from '../database/prisma.service';

/** Throws 400 if the given districtId does not reference an existing District. */
export async function assertDistrictExists(
  prisma: PrismaService,
  districtId: string,
): Promise<void> {
  const exists = await prisma.district.findUnique({
    where: { id: districtId },
    select: { id: true },
  });
  if (!exists) throw new BadRequestException('District not found');
}

/**
 * Validates the supplied geographic identifiers and derives missing ancestor IDs.
 *
 * Rules:
 *  - If unionId is provided: validate it, fill upazilaId and districtId if absent.
 *  - If only upazilaId is provided: validate it, fill districtId if absent.
 *  - If only districtId is provided: validate it.
 *  - Any explicitly supplied value is validated and kept as-is.
 *
 * Returns a consistent, fully-resolved object ready to persist.
 */
export async function resolveGeoHierarchy(
  prisma: PrismaService,
  dto: { districtId?: string; upazilaId?: string; unionId?: string },
): Promise<{ districtId?: string; upazilaId?: string; unionId?: string }> {
  let { districtId, upazilaId, unionId } = dto;

  if (unionId) {
    const union = await prisma.union.findUnique({
      where: { id: unionId },
      select: { id: true, upazilaId: true, upazila: { select: { districtId: true } } },
    });
    if (!union) throw new BadRequestException('Union not found');
    upazilaId = upazilaId ?? union.upazilaId;
    districtId = districtId ?? union.upazila.districtId;
  } else if (upazilaId) {
    const upazila = await prisma.upazila.findUnique({
      where: { id: upazilaId },
      select: { id: true, districtId: true },
    });
    if (!upazila) throw new BadRequestException('Upazila not found');
    districtId = districtId ?? upazila.districtId;
  } else if (districtId) {
    await assertDistrictExists(prisma, districtId);
  }

  return { districtId, upazilaId, unionId };
}

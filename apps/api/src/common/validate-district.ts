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

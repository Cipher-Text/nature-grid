import { IsEnum } from 'class-validator';
import { ObservationTrustLevel } from '@prisma/client';

export class UpdateObservationTrustDto {
  @IsEnum(ObservationTrustLevel)
  trustLevel!: ObservationTrustLevel;
}

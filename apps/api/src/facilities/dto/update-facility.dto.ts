import { ComplianceStatus } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateFacilityDto {
  @IsOptional()
  @IsEnum(ComplianceStatus)
  complianceStatus?: ComplianceStatus;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  productionCapacity?: string;

  @IsOptional()
  @IsBoolean()
  etpInstalled?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  etpCapacity?: number;
}

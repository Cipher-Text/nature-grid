import { CompanyType } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsEnum(CompanyType)
  companyType?: CompanyType;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  registrationNumber?: string;

  @IsOptional()
  @IsInt()
  @Min(1800)
  @Max(new Date().getFullYear())
  establishedYear?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  employeeCount?: number;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  website?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  contactPhone?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  headquarterDistrictId?: string;

  @IsOptional()
  @IsString()
  parentCompanyId?: string;
}

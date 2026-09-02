import { CompanyType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
  Max,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  bnName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsEnum(CompanyType)
  companyType!: CompanyType;

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
  @IsString()
  headquarterDistrictId?: string;

  @IsOptional()
  @IsString()
  parentCompanyId?: string;
}

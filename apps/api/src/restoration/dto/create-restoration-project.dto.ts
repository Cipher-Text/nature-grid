import { IsEnum, IsISO8601, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { RestorationCategory } from '@prisma/client';

export class CreateRestorationProjectDto {
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title!: string;

  @IsString()
  @MinLength(20)
  @MaxLength(2000)
  description!: string;

  @IsEnum(RestorationCategory)
  category!: RestorationCategory;

  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @IsString()
  districtId?: string;

  @IsOptional()
  @IsString()
  upazilaId?: string;

  @IsOptional()
  @IsString()
  unionId?: string;

  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  impactSummary?: string;
}

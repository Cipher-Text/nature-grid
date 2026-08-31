import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { DatasetCategory, DatasetAccessPolicy } from '@prisma/client';

export class CreateDatasetDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name!: string;

  @IsEnum(DatasetCategory)
  category!: DatasetCategory;

  @IsEnum(DatasetAccessPolicy)
  accessPolicy!: DatasetAccessPolicy;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  source!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsString()
  providerId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  license?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  refreshCron?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  version?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  spatialExtent?: string;
}

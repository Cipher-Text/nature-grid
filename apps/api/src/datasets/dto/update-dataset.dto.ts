import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { DatasetAccessPolicy } from '@prisma/client';

export class UpdateDatasetDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsEnum(DatasetAccessPolicy)
  accessPolicy?: DatasetAccessPolicy;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

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

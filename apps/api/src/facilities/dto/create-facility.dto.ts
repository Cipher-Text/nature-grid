import { FacilityType } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateFacilityDto {
  @IsString()
  @MinLength(3)
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

  @IsEnum(FacilityType)
  facilityType!: FacilityType;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  operatorName?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsString()
  districtId!: string;

  @IsOptional()
  @IsString()
  upazilaId?: string;

  @IsOptional()
  @IsString()
  unionId?: string;
}

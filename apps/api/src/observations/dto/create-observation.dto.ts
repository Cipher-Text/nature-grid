import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ObservationCategory } from '@prisma/client';
import { CreateMeasurementDto } from './create-measurement.dto';

export class CreateObservationDto {
  @IsEnum(ObservationCategory)
  category!: ObservationCategory;

  @IsString()
  @MinLength(20)
  @MaxLength(2000)
  description!: string;

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
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng?: number;

  /** Species name — relevant for BIODIVERSITY observations. */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  species?: string;

  /** ISO 8601 datetime of when the observation was made. Defaults to submission time. */
  @IsOptional()
  @IsDateString()
  observedAt?: string;

  /** Structured measurements recorded at the time of observation. */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMeasurementDto)
  measurements?: CreateMeasurementDto[];
}

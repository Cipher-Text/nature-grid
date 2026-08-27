import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EmissionUnit, PollutantType } from '@prisma/client';

export class CreateEmissionEntryDto {
  @IsEnum(PollutantType)
  pollutant: PollutantType;

  @IsNumber()
  @Min(0)
  value: number;

  @IsEnum(EmissionUnit)
  unit: EmissionUnit;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  measurementMethod?: string;

  @IsDateString()
  @IsOptional()
  periodStart?: string;

  @IsDateString()
  @IsOptional()
  periodEnd?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

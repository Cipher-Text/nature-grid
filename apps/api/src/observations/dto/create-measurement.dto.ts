import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { MeasurementParameter, MeasurementUnit, QualityFlag } from '@prisma/client';

export class CreateMeasurementDto {
  @IsEnum(MeasurementParameter)
  parameter!: MeasurementParameter;

  @IsNumber()
  value!: number;

  @IsEnum(MeasurementUnit)
  unit!: MeasurementUnit;

  /** Instrument or method used, e.g. "Hach HQ30d field meter", "visual estimate". */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  method?: string;

  /** Minimum detectable value — include for lab-reported results near detection limit. */
  @IsOptional()
  @IsNumber()
  @Min(0)
  detectionLimit?: number;

  @IsOptional()
  @IsEnum(QualityFlag)
  qualityFlag?: QualityFlag;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

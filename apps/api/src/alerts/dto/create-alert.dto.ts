import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AlertSeverity, AlertType } from '@prisma/client';
import { CreateAlertAreaDto } from './create-alert-area.dto';

export class CreateAlertDto {
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title!: string;

  @IsEnum(AlertSeverity)
  severity!: AlertSeverity;

  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  instructions?: string;

  @IsOptional()
  @IsEnum(AlertType)
  alertType?: AlertType;

  /** Legacy single-district field. Prefer `areas` for new integrations. */
  @IsOptional()
  @IsString()
  districtId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAlertAreaDto)
  areas?: CreateAlertAreaDto[];

  @IsOptional()
  @IsISO8601()
  expiresAt?: string;
}

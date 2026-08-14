import { IsEnum, IsISO8601, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { AlertSeverity } from '@prisma/client';

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
  @IsUUID()
  districtId?: string;

  @IsOptional()
  @IsISO8601()
  expiresAt?: string;
}

import { IsEnum, IsISO8601, IsOptional, IsString, MaxLength } from 'class-validator';
import { AlertStatus } from '@prisma/client';

export class UpdateAlertDto {
  @IsOptional()
  @IsEnum(AlertStatus)
  status?: AlertStatus;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  instructions?: string;

  @IsOptional()
  @IsISO8601()
  expiresAt?: string;
}

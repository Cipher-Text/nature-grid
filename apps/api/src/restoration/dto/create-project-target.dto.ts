import { IsEnum, IsISO8601, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { RestorationTargetMetric } from '@prisma/client';

export class CreateProjectTargetDto {
  @IsEnum(RestorationTargetMetric)
  metric!: RestorationTargetMetric;

  @IsNumber()
  @Min(0)
  targetValue!: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  unit?: string;

  @IsOptional()
  @IsISO8601()
  deadline?: string;
}

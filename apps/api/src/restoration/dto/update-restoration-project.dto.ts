import { IsEnum, IsISO8601, IsOptional, IsString, MaxLength } from 'class-validator';
import { ProjectStatus } from '@prisma/client';

export class UpdateRestorationProjectDto {
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  impactSummary?: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;
}

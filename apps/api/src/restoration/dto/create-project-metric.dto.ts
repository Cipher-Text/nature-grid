import { IsISO8601, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProjectMetricDto {
  @IsISO8601()
  measuredAt!: string;

  @IsNumber()
  value!: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

import { IsISO8601, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateProjectActivityDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  description!: string;

  @IsISO8601()
  activityDate!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  volunteersCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  areaAffectedHa?: number;
}

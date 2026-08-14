import { IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength, IsNumber, Min, Max } from 'class-validator';
import { ReportCategory } from '@prisma/client';

export class CreateReportDto {
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title!: string;

  @IsEnum(ReportCategory)
  category!: ReportCategory;

  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  description!: string;

  @IsOptional()
  @IsUUID()
  districtId?: string;

  @IsOptional()
  @IsNumber()
  @Min(-90) @Max(90)
  lat?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180) @Max(180)
  lng?: number;
}

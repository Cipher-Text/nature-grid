import { IsEnum, IsOptional, IsString, MaxLength, MinLength, IsNumber, Min, Max } from 'class-validator';
import { ObservationCategory } from '@prisma/client';

export class CreateObservationDto {
  @IsEnum(ObservationCategory)
  category!: ObservationCategory;

  @IsString()
  @MinLength(20)
  @MaxLength(2000)
  description!: string;

  @IsOptional()
  @IsString()
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

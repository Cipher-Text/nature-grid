import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateObservationDto {
  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsString()
  districtId?: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  species?: string;

  @IsOptional()
  @IsDateString()
  observedAt?: string;
}

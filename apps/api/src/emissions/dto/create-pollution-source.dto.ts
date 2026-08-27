import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PollutionSourceType } from '@prisma/client';

export class CreatePollutionSourceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(PollutionSourceType)
  type: PollutionSourceType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  districtId?: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsOptional()
  lat?: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  lng?: number;

  @IsString()
  @IsOptional()
  organizationId?: string;
}

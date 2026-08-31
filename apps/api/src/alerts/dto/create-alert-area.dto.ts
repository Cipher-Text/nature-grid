import { IsOptional, IsString } from 'class-validator';

/**
 * Describes a single geographic area that an alert targets.
 * At least one of districtId, upazilaId, or unionId should be provided.
 * The most specific level supplied is used as written; no hierarchy derivation
 * is performed here — caller is responsible for consistency.
 */
export class CreateAlertAreaDto {
  @IsOptional()
  @IsString()
  districtId?: string;

  @IsOptional()
  @IsString()
  upazilaId?: string;

  @IsOptional()
  @IsString()
  unionId?: string;
}

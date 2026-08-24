import { IsArray, IsIn, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

const VISIBILITIES = ['PUBLIC', 'MEMBERS_ONLY', 'PRIVATE'];

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  preferredLanguage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  occupation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  expertise?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  researchInterests?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(180)
  education?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  institution?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  locationDistrict?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  locationCountry?: string;

  @IsOptional()
  @IsIn(VISIBILITIES)
  profileVisibility?: 'PUBLIC' | 'MEMBERS_ONLY' | 'PRIVATE';

  @IsOptional()
  @IsIn(VISIBILITIES)
  contactVisibility?: 'PUBLIC' | 'MEMBERS_ONLY' | 'PRIVATE';

  @IsOptional()
  @IsIn(VISIBILITIES)
  linksVisibility?: 'PUBLIC' | 'MEMBERS_ONLY' | 'PRIVATE';

  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, string>;
}

import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateCommunityDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsString()
  @IsOptional()
  image_path?: string;

  @IsString()
  @IsNotEmpty()
  ownerId: string;
}
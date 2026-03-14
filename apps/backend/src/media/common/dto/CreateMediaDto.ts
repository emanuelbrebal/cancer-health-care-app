import { IsString, IsBoolean, IsOptional, MaxLength, IsInt, IsUUID, IsArray } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsInt()
  @IsOptional()
  releaseYear?: number;

  @IsUUID()
  genreId: string;

  @IsBoolean()
  isFree: boolean;

  @IsString()
  @IsOptional()
  image_path?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  whereToFind: string[];
}
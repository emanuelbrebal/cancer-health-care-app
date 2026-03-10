import { IsString, IsBoolean, IsOptional, MaxLength, IsInt, IsUUID, IsUrl, IsArray } from 'class-validator';

export class CreateBookDetailDto {
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
  whereToFind: string[];

  @IsString()
  @MaxLength(100)
  author: string; 

  @IsOptional()
  @IsUrl()
  @IsString()
  eduCapesLink?: string;

  @IsInt()
  @IsOptional()
  pageCount?: number; 
}
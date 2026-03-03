import { IsString, IsBoolean, IsOptional, MaxLength, IsInt, isBoolean } from 'class-validator';

export class CreateBookDetailDto {
  // Dados da tabela Media
  @IsString()
  @MaxLength(200)
  title: string;

  @IsInt()
  @IsOptional()
  releaseYear?: number;

  @IsString()
  genreId: string;

  @IsBoolean()
  isFree: boolean
  
  // Campos que vão para a tabela BookDetail
  @IsString()
  author: string;

  @IsString()
  @IsOptional()
  eduCapesLink?: string;

  @IsBoolean()
  isOpenSource: boolean;
}
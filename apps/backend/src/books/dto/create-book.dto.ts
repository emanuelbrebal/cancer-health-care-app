import { IsString, IsBoolean, IsOptional, MaxLength, IsInt } from 'class-validator';

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

  // Campos que vão para a tabela BookDetail
  @IsString()
  author: string;

  @IsString()
  @IsOptional()
  eduCapesLink?: string;

  @IsBoolean()
  isOpenSource: boolean;
}
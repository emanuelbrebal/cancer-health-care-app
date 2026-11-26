import {
  IsString,
  IsBoolean,
  IsOptional,
  MaxLength,
  IsInt,
  IsUUID,
  IsArray,
} from 'class-validator';

export class CreateMediaDto {
  // A coluna é VarChar(150): acima disso o banco recusaria com 500.
  @IsString()
  @MaxLength(150)
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

import { MediaType, StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateGenreDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty({ message: 'Informe o nome do gênero.' })
  @MaxLength(60)
  name: string;

  @IsEnum(MediaType, { message: 'Tipo de mídia inválido.' })
  type: MediaType;
}

// Renomear: o tipo não muda (itens ligados ao gênero são daquele tipo).
export class UpdateGenreDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty({ message: 'Informe o nome do gênero.' })
  @MaxLength(60)
  name: string;
}

export class GenreQueryDto {
  @IsOptional()
  @IsEnum(MediaType, { message: 'Tipo de mídia inválido.' })
  type?: MediaType;
}

export class AdminGenreQueryDto extends GenreQueryDto {
  @IsOptional()
  @IsEnum(StatusEnum, { message: 'Status inválido.' })
  status?: StatusEnum;
}

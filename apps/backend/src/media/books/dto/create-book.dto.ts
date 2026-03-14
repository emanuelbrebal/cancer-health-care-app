import { IsString, IsBoolean, IsOptional, MaxLength, IsInt, IsUUID, IsUrl, IsArray } from 'class-validator';
import { CreateMediaDto } from 'src/media/common/dto/CreateMediaDto';

export class CreateBookDto extends CreateMediaDto {
  @IsString()
  @MaxLength(100)
  author: string;

  @IsOptional()
  @IsUrl()
  @IsString()
  eduCapesLink?: string;

  @IsOptional()
  @IsInt({ message: "O número de visitas precisa ser um valor numérico." })
  visitCount?: number | 0;

  @IsOptional()
  @IsInt({ message: "O número de páginas precisa ser um valor numérico." })
  page_count?: number;
}

import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { AdminListQueryDto } from 'common/pagination/pagination';

export class AdminMediaQueryDto extends AdminListQueryDto {
  @IsOptional()
  @IsUUID('4', { message: 'Gênero inválido.' })
  genreId?: string;

  // Query string chega como texto: "true"/"false" viram booleano; o resto falha no IsBoolean.
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean({ message: 'isFree deve ser true ou false.' })
  isFree?: boolean;
}

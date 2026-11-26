import { StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

// Query comum das listagens admin: status ausente = todos; busca por texto; paginação offset.
export class AdminListQueryDto {
  @IsOptional()
  @IsEnum(StatusEnum, { message: 'Status inválido.' })
  status?: StatusEnum;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  limit: number = DEFAULT_LIMIT;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export function pageArgs(query: { page: number; limit: number }) {
  return { skip: (query.page - 1) * query.limit, take: query.limit };
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaType, Prisma, StatusEnum } from '@prisma/client';
import { pageArgs } from 'common/pagination/pagination';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookMapper } from '../mappers/book-mapper';
import { MediaRecord } from '../mappers/media-mapper';
import { MovieMapper } from '../mappers/movie-mapper';
import { SeriesMapper } from '../mappers/series-mapper';
import { AdminMediaQueryDto } from './dto/admin-media-query.dto';

const INCLUDE = {
  genre: true,
  bookDetails: true,
  movieDetails: true,
  seriesDetails: true,
} satisfies Prisma.MediaInclude;

const MAPPER = {
  BOOK: BookMapper,
  MOVIE: MovieMapper,
  SERIES: SeriesMapper,
} as const;

const NOT_FOUND: Record<MediaType, string> = {
  BOOK: 'Livro não encontrado.',
  MOVIE: 'Filme não encontrado.',
  SERIES: 'Série não encontrada.',
};

// Item do painel: mesmos campos da rota pública + genreId e datas (W02-1, P8).
export function toAdminMedia(media: MediaRecord) {
  return {
    ...MAPPER[media.type].toDto(media),
    genreId: media.genreId,
    createdAt: media.createdAt.toISOString(),
    updatedAt: media.updatedAt.toISOString(),
  };
}

export type AdminMedia = ReturnType<typeof toAdminMedia>;

// Leitura do painel (inclui inativos). Escrita continua nos serviços de cada tipo.
@Injectable()
export class AdminMediaService {
  constructor(private readonly prisma: PrismaService) {}

  async list(type: MediaType, query: AdminMediaQueryDto) {
    const where: Prisma.MediaWhereInput = {
      type,
      ...(query.status && { status: query.status }),
      ...(query.genreId && { genreId: query.genreId }),
      ...(query.isFree !== undefined && { isFree: query.isFree }),
      ...(query.search && {
        title: { contains: query.search, mode: 'insensitive' },
      }),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.media.findMany({
        where,
        include: INCLUDE,
        orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }],
        ...pageArgs(query),
      }),
      this.prisma.media.count({ where }),
    ]);
    return {
      items: items.map(toAdminMedia),
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  async findOne(type: MediaType, id: string) {
    const media = await this.prisma.media.findFirst({
      where: { id, type },
      include: INCLUDE,
    });
    if (!media) throw new NotFoundException(NOT_FOUND[type]);
    return toAdminMedia(media);
  }

  async reactivate(type: MediaType, id: string) {
    await this.findOne(type, id);
    const media = await this.prisma.media.update({
      where: { id },
      data: { status: StatusEnum.ACTIVE },
      include: INCLUDE,
    });
    return toAdminMedia(media);
  }
}

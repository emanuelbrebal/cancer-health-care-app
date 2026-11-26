import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { MediaType, Prisma, StatusEnum } from '@prisma/client';
import { DUPLICATE_CODE } from 'common/prisma/rethrow-unique';
import { PrismaService } from 'src/prisma/prisma.service';

export const INVALID_GENRE_CODE = 'INVALID_GENRE';

const GENRE_LABEL: Record<MediaType, string> = {
  BOOK: 'livro',
  MOVIE: 'filme',
  SERIES: 'série',
};

const DUPLICATE_MESSAGE: Record<MediaType, string> = {
  BOOK: 'Já existe um livro com este título e autor.',
  MOVIE: 'Já existe um filme com este título e ano.',
  SERIES: 'Já existe uma série com este título e ano.',
};

export interface MediaIdentity {
  type: MediaType;
  title: string;
  /** Livro: o autor faz parte da identidade. */
  author?: string;
  /** Filme e série: o ano faz parte da identidade (nulo conta como igual). */
  releaseYear?: number | null;
}

// Regras de catálogo que o banco não expressa (tasks/admin-catalogo.md, decisões do item 1).
@Injectable()
export class MediaRulesService {
  constructor(private readonly prisma: PrismaService) {}

  /** `genreId` precisa ser um gênero ativo do mesmo tipo da mídia (W02-3). */
  async assertGenre(genreId: string, type: MediaType) {
    const genre = await this.prisma.genre.findFirst({
      where: { id: genreId, type, status: StatusEnum.ACTIVE },
      select: { id: true },
    });
    if (!genre) {
      throw new BadRequestException({
        message: `Escolha um gênero ativo de ${GENRE_LABEL[type]}.`,
        code: INVALID_GENRE_CODE,
      });
    }
  }

  /**
   * Livro: título + autor; filme/série: título + ano. Sem diferenciar maiúsculas, inclui inativos
   * (um inativo pode ser reativado). Checagem fora de transação: corrida simultânea não é coberta.
   */
  async assertUnique(identity: MediaIdentity, excludeId?: string) {
    const where: Prisma.MediaWhereInput = {
      type: identity.type,
      title: { equals: identity.title.trim(), mode: 'insensitive' },
      ...(excludeId && { id: { not: excludeId } }),
    };
    if (identity.type === MediaType.BOOK) {
      where.bookDetails = {
        author: { equals: (identity.author ?? '').trim(), mode: 'insensitive' },
      };
    } else {
      where.releaseYear = identity.releaseYear ?? null;
    }

    const clash = await this.prisma.media.findFirst({
      where,
      select: { id: true },
    });
    if (clash) {
      throw new ConflictException({
        message: DUPLICATE_MESSAGE[identity.type],
        code: DUPLICATE_CODE,
      });
    }
  }
}

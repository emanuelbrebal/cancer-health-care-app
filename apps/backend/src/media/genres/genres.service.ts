import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Genre, StatusEnum } from '@prisma/client';
import { rethrowUnique } from 'common/prisma/rethrow-unique';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AdminGenreQueryDto,
  CreateGenreDto,
  GenreQueryDto,
  UpdateGenreDto,
} from './dto/genre.dto';

export const GENRE_IN_USE_CODE = 'GENRE_IN_USE';
const DUPLICATE_NAME = 'Já existe um gênero com este nome para este tipo.';
const NOT_FOUND = 'Gênero não encontrado.';

const toDto = (g: Genre) => ({
  id: g.id,
  name: g.name,
  type: g.type,
  status: g.status,
});

// Gêneros por tipo de mídia (PRD 02, W02-8). Leitura pública só de ativos; escrita ADMIN.
@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublic(query: GenreQueryDto) {
    const genres = await this.prisma.genre.findMany({
      where: {
        status: StatusEnum.ACTIVE,
        ...(query.type && { type: query.type }),
      },
      orderBy: { name: 'asc' },
    });
    return genres.map(({ id, name, type }) => ({ id, name, type }));
  }

  async findAdmin(query: AdminGenreQueryDto) {
    const genres = await this.prisma.genre.findMany({
      where: {
        ...(query.type && { type: query.type }),
        ...(query.status && { status: query.status }),
      },
      include: {
        _count: {
          select: { medias: { where: { status: StatusEnum.ACTIVE } } },
        },
      },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });
    return genres.map((g) => ({ ...toDto(g), activeItems: g._count.medias }));
  }

  async create(dto: CreateGenreDto) {
    const genre = await this.prisma.genre
      .create({ data: { name: dto.name, type: dto.type } })
      .catch((e) => rethrowUnique(e, DUPLICATE_NAME));
    return toDto(genre);
  }

  async rename(id: string, dto: UpdateGenreDto) {
    await this.findById(id);
    const genre = await this.prisma.genre
      .update({ where: { id }, data: { name: dto.name } })
      .catch((e) => rethrowUnique(e, DUPLICATE_NAME));
    return toDto(genre);
  }

  /** Inativa; recusa se ainda há itens ativos no gênero (W02-8). */
  async inactivate(id: string) {
    await this.findById(id);
    const activeItems = await this.prisma.media.count({
      where: { genreId: id, status: StatusEnum.ACTIVE },
    });
    if (activeItems > 0) {
      const itens =
        activeItems === 1 ? '1 item ativo' : `${activeItems} itens ativos`;
      throw new ConflictException({
        message: `Este gênero tem ${itens}. Troque o gênero ou inative os itens antes.`,
        code: GENRE_IN_USE_CODE,
      });
    }
    await this.prisma.genre.update({
      where: { id },
      data: { status: StatusEnum.INACTIVE },
    });
  }

  async reactivate(id: string) {
    await this.findById(id);
    return toDto(
      await this.prisma.genre.update({
        where: { id },
        data: { status: StatusEnum.ACTIVE },
      }),
    );
  }

  private async findById(id: string) {
    const genre = await this.prisma.genre.findUnique({ where: { id } });
    if (!genre) throw new NotFoundException(NOT_FOUND);
    return genre;
  }
}

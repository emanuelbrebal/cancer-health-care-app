import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaType } from '@prisma/client';
import { MediaRulesService } from '../common/media-rules.service';
import { SeriesMapper } from '../mappers/series-mapper';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { SeriesRepository } from './series.repository';

const NOT_FOUND = 'Série não encontrada.';

@Injectable()
export class SeriesService {
  constructor(
    private readonly seriesRepository: SeriesRepository,
    private readonly rules: MediaRulesService,
  ) {}

  async create(dto: CreateSeriesDto) {
    await this.rules.assertGenre(dto.genreId, MediaType.SERIES);
    await this.rules.assertUnique({
      type: MediaType.SERIES,
      title: dto.title,
      releaseYear: dto.releaseYear,
    });
    return this.seriesRepository.create(dto);
  }

  async findAll() {
    return this.seriesRepository.findAll();
  }

  async findOne(id: string) {
    const serie = await this.seriesRepository.findOne(id);
    if (!serie) throw new NotFoundException(NOT_FOUND);
    return serie;
  }

  // Vale também para item inativo: o painel edita antes de reativar.
  async update(id: string, dto: UpdateSeriesDto) {
    const current = await this.seriesRepository.findAnyStatus(id);
    if (!current) throw new NotFoundException(NOT_FOUND);
    if (dto.genreId)
      await this.rules.assertGenre(dto.genreId, MediaType.SERIES);
    if (dto.title !== undefined || dto.releaseYear !== undefined) {
      await this.rules.assertUnique(
        {
          type: MediaType.SERIES,
          title: dto.title ?? current.title,
          releaseYear:
            dto.releaseYear !== undefined
              ? dto.releaseYear
              : current.releaseYear,
        },
        id,
      );
    }
    return SeriesMapper.toDto(await this.seriesRepository.update(id, dto));
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.seriesRepository.delete(id);
  }
}

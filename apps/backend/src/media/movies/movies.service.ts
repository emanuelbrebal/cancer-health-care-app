import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaType } from '@prisma/client';
import { MediaRulesService } from '../common/media-rules.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesRepository } from './movies.repository';

const NOT_FOUND = 'Filme não encontrado.';

@Injectable()
export class MoviesService {
  constructor(
    private readonly moviesRepository: MoviesRepository,
    private readonly rules: MediaRulesService,
  ) {}

  async create(dto: CreateMovieDto) {
    await this.rules.assertGenre(dto.genreId, MediaType.MOVIE);
    await this.rules.assertUnique({
      type: MediaType.MOVIE,
      title: dto.title,
      releaseYear: dto.releaseYear,
    });
    return this.moviesRepository.create(dto);
  }

  async findAll() {
    return this.moviesRepository.findAll();
  }

  async findOne(id: string) {
    const movie = await this.moviesRepository.findOne(id);
    if (!movie) throw new NotFoundException(NOT_FOUND);
    return movie;
  }

  // Vale também para item inativo: o painel edita antes de reativar.
  async update(id: string, dto: UpdateMovieDto) {
    const current = await this.moviesRepository.findAnyStatus(id);
    if (!current) throw new NotFoundException(NOT_FOUND);
    if (dto.genreId) await this.rules.assertGenre(dto.genreId, MediaType.MOVIE);
    if (dto.title !== undefined || dto.releaseYear !== undefined) {
      await this.rules.assertUnique(
        {
          type: MediaType.MOVIE,
          title: dto.title ?? current.title,
          releaseYear:
            dto.releaseYear !== undefined
              ? dto.releaseYear
              : current.releaseYear,
        },
        id,
      );
    }
    return this.moviesRepository.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.moviesRepository.delete(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieMapper } from '../mappers/movie-mapper';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Post()
  async create(@Body() createMovieDto: CreateMovieDto) {
    const movie = await this.moviesService.create(createMovieDto);
    if (!movie) {
      throw new InternalServerErrorException('Não foi possível criar o filme no momento.');
    }
    return {
      message: 'Livro criado com sucesso!',
      data: MovieMapper.toDto(movie)
    };
  }

  @Get()
  async findAll() {
    const movies = await this.moviesService.findAll();
    return movies.map(movie => MovieMapper.toDto(movie));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const movie = await this.moviesService.findOne(id);
        if (!movie) throw new NotFoundException('Filme não encontrado');
        return MovieMapper.toDto(movie);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    const updatedMovie = await this.moviesService.update(id, updateMovieDto);
    return MovieMapper.toDto(updatedMovie);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}

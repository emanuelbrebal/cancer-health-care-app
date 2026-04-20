import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesRepository } from './movies.repository';

@Injectable()
export class MoviesService {
  constructor(private readonly moviesRepository: MoviesRepository) {}

   async create(createMovieDto: CreateMovieDto) {
      return this.moviesRepository.create(createMovieDto);
    }
  
    async findAll() {
      return this.moviesRepository.findAll();
    }
  
    async findOne(id: string) {
      const movie = await this.moviesRepository.findOne(id);
      if (!movie) {
        throw new NotFoundException('Filme não encontrado.');
      }
      return movie;
    }
  
    async update(id: string, updateMovieDto: UpdateMovieDto) {
      await this.findOne(id); 
      return this.moviesRepository.update(id, updateMovieDto);
    }
  
    async remove(id: string) {
      await this.findOne(id); 
      return this.moviesRepository.delete(id);
    }
}

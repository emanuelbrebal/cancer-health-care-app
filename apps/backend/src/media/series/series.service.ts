import { Injectable, NotFoundException } from '@nestjs/common';
import { SeriesRepository } from './series.repository';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { SeriesMapper } from '../mappers/series-mapper';

@Injectable()
export class SeriesService {
  constructor(private readonly seriesRepository: SeriesRepository) {}

   async create(createSeriesDto: CreateSeriesDto) {
      return this.seriesRepository.create(createSeriesDto);
    }
  
    async findAll() {
      const series = await this.seriesRepository.findAll();
      if (!series || series.length === 0) {
        throw new NotFoundException('Nenhuma série cadastrada.');
      }
      return series;
    }
  
    async findOne(id: string) {
      const serie = await this.seriesRepository.findOne(id);
      if (!serie) {
        throw new NotFoundException('Série não encontrada.');
      }
      return serie;
    }
  
    async update(id: string, updateSeriesDto: UpdateSeriesDto) {
      await this.findOne(id); 
      const updatedSerie = await this.seriesRepository.update(id, updateSeriesDto);

      return SeriesMapper.toDto(updatedSerie);
    }
  
    async remove(id: string) {
      await this.findOne(id); 
      return this.seriesRepository.delete(id);
    }
}

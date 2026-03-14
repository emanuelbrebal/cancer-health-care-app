import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { SeriesMapper } from '../mappers/series-mapper';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) { }

  @Post()
  async create(@Body() createSeriesDto: CreateSeriesDto) {
    const serie = await this.seriesService.create(createSeriesDto);
    return {
      message: 'Série criada com sucesso!',
      data: SeriesMapper.toDto(serie)
    };
  }

  @Get()
  async findAll() {
    const series = await this.seriesService.findAll();
    return series.map(series => SeriesMapper.toDto(series));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const serie = await this.seriesService.findOne(id);
    return SeriesMapper.toDto(serie);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSeriesDto: UpdateSeriesDto) {
    if (!updateSeriesDto || Object.keys(updateSeriesDto).length === 0) {
      throw new BadRequestException('Nenhum dado válido fornecido para atualização');
    }
    const updatedSerie = await this.seriesService.update(id, updateSeriesDto);
    return {
      message: 'Série atualizada com sucesso!',
      data: SeriesMapper.toDto(updatedSerie)
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.seriesService.remove(id);
    return { message: 'Série removida com sucesso' };

  }
}

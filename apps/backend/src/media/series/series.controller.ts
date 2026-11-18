import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { SeriesMapper } from '../mappers/series-mapper';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createSeriesDto: CreateSeriesDto) {
    const serie = await this.seriesService.create(createSeriesDto);
    return {
      message: 'Série criada com sucesso!',
      data: SeriesMapper.toDto(serie),
    };
  }

  @Get()
  async findAll() {
    const series = await this.seriesService.findAll();
    return series.map((series) => SeriesMapper.toDto(series));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const serie = await this.seriesService.findOne(id);
    return SeriesMapper.toDto(serie);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSeriesDto: UpdateSeriesDto,
  ) {
    if (!updateSeriesDto || Object.keys(updateSeriesDto).length === 0) {
      throw new BadRequestException(
        'Nenhum dado válido fornecido para atualização',
      );
    }
    const updatedSerie = await this.seriesService.update(id, updateSeriesDto);
    return {
      message: 'Série atualizada com sucesso!',
      data: updatedSerie,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.seriesService.remove(id);
    return { message: 'Série removida com sucesso' };
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { LeisuresService } from './leisures.service';
import { CreateLeisureDto } from './dto/create-leisure.dto';
import { UpdateLeisureDto } from './dto/update-leisure.dto';
import { LeisureMapper } from './mappers/leisureMapper';

@Controller('leisures')
export class LeisuresController {
  constructor(private readonly leisuresService: LeisuresService) {}

  @Post()
  async create(@Body() createLeisureDto: CreateLeisureDto) {
    const leisure = await this.leisuresService.create(createLeisureDto);
    return {
      message: 'Atividade de lazer criada com sucesso!',
      data: LeisureMapper.toDto(leisure)
    };
  }

  @Get()
  async findAll() {
    const leisures = await this.leisuresService.findAll();
    return leisures.map(leisure => LeisureMapper.toDto(leisure));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const leisure = await this.leisuresService.findOne(id);
    return LeisureMapper.toDto(leisure);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLeisureDto: UpdateLeisureDto) {
    if (!updateLeisureDto || Object.keys(updateLeisureDto).length === 0) {
      throw new BadRequestException('Nenhum dado válido fornecido para atualização');
    }
    const updatedLeisure = await this.leisuresService.update(id, updateLeisureDto);
    return LeisureMapper.toDto(updatedLeisure);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.leisuresService.remove(id);
    return { message: 'Atividade de lazer removida com sucesso' };
  }
}
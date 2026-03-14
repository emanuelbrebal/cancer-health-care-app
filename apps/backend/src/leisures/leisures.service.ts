import { Injectable, NotFoundException } from '@nestjs/common';
import { LeisureRepository } from './leisures.repository';
import { CreateLeisureDto } from './dto/create-leisure.dto';
import { UpdateLeisureDto } from './dto/update-leisure.dto';

@Injectable()
export class LeisuresService {
  constructor(private readonly repository: LeisureRepository) {}

  async create(dto: CreateLeisureDto) {
    return this.repository.create(dto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const leisure = await this.repository.findOne(id);
    if (!leisure) {
      throw new NotFoundException('Atividade de lazer não encontrada.');
    }
    return leisure;
  }

  async update(id: string, dto: UpdateLeisureDto) {
    await this.findOne(id); 
    return this.repository.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id); 
    return this.repository.delete(id);
  }
}
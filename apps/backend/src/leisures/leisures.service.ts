import { Injectable, NotFoundException } from '@nestjs/common';
import { LeisureRepository } from './leisures.repository';
import { CreateLeisureDto } from './dto/create-leisure.dto';
import { UpdateLeisureDto } from './dto/update-leisure.dto';
import { AdminLeisureQueryDto } from './dto/admin-leisure-query.dto';
import { rethrowUnique } from 'common/prisma/rethrow-unique';

const DUPLICATE_NAME = 'Já existe uma atividade com este nome.';
const NOT_FOUND = 'Atividade de lazer não encontrada.';

@Injectable()
export class LeisuresService {
  constructor(private readonly repository: LeisureRepository) {}

  async create(dto: CreateLeisureDto) {
    return this.repository
      .create(dto)
      .catch((e) => rethrowUnique(e, DUPLICATE_NAME));
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const leisure = await this.repository.findOne(id);
    if (!leisure) {
      throw new NotFoundException(NOT_FOUND);
    }
    return leisure;
  }

  async findAnyStatus(id: string) {
    const leisure = await this.repository.findAnyStatus(id);
    if (!leisure) throw new NotFoundException(NOT_FOUND);
    return leisure;
  }

  async findAdmin(query: AdminLeisureQueryDto) {
    return this.repository.findAdmin(query);
  }

  async reactivate(id: string) {
    await this.findAnyStatus(id);
    return this.repository.reactivate(id);
  }

  // Vale também para item inativo: o painel edita antes de reativar.
  async update(id: string, dto: UpdateLeisureDto) {
    await this.findAnyStatus(id);
    return this.repository
      .update(id, dto)
      .catch((e) => rethrowUnique(e, DUPLICATE_NAME));
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}

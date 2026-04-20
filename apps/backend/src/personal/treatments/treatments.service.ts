import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { TreatmentsRepository } from './treatments.repository';
import { TreatmentMapper } from './mappers/treatment.mapper';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';

@Injectable()
export class TreatmentsService {
  constructor(private readonly repository: TreatmentsRepository) {}

  async create(userId: string, dto: CreateTreatmentDto) {
    const treatment = await this.repository.create(userId, dto);
    return TreatmentMapper.toDto(treatment);
  }

  async findAll(userId: string) {
    const treatments = await this.repository.findAllByUser(userId);
    return TreatmentMapper.toDtoList(treatments);
  }

  async findOne(id: string, userId: string) {
    const treatment = await this.repository.findOne(id);
    if (!treatment) throw new NotFoundException('Tratamento não encontrado.');
    if (treatment.userId !== userId) throw new ForbiddenException('Acesso negado.');
    return TreatmentMapper.toDto(treatment);
  }

  async update(id: string, userId: string, dto: UpdateTreatmentDto) {
    await this.findOne(id, userId);
    const treatment = await this.repository.update(id, dto);
    return TreatmentMapper.toDto(treatment);
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.repository.softDelete(id);
    return { message: 'Tratamento encerrado com sucesso.' };
  }
}

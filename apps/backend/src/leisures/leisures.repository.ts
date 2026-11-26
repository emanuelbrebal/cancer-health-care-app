import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { pageArgs } from 'common/pagination/pagination';
import { AdminLeisureQueryDto } from './dto/admin-leisure-query.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLeisureDto } from './dto/create-leisure.dto';
import { UpdateLeisureDto } from './dto/update-leisure.dto';

@Injectable()
export class LeisureRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateLeisureDto) {
    return this.prisma.leisureActivity.create({
      data: {
        ...data,
        // A coluna é obrigatória e o DTO não: sem isso, criar sem imagem dava 500.
        image_path: data.image_path ?? '',
        status: 'ACTIVE',
      },
    });
  }

  async findAll() {
    return this.prisma.leisureActivity.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.leisureActivity.findFirst({
      where: { id, status: 'ACTIVE' },
    });
  }

  async findAnyStatus(id: string) {
    return this.prisma.leisureActivity.findUnique({ where: { id } });
  }

  // Listagem do painel: inclui inativos, filtra e pagina no banco.
  async findAdmin(query: AdminLeisureQueryDto) {
    const where: Prisma.LeisureActivityWhereInput = {
      ...(query.status && { status: query.status }),
      ...(query.type && { type: query.type }),
      ...(query.frequency && { frequency: query.frequency }),
      ...(query.search && {
        name: { contains: query.search, mode: 'insensitive' },
      }),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.leisureActivity.findMany({
        where,
        orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }],
        ...pageArgs(query),
      }),
      this.prisma.leisureActivity.count({ where }),
    ]);
    return { items, total };
  }

  async reactivate(id: string) {
    return this.prisma.leisureActivity.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
  }

  async update(id: string, data: UpdateLeisureDto) {
    return this.prisma.leisureActivity.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.leisureActivity.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });
  }
}

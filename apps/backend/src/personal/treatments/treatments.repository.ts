import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TreatmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: any) {
    return this.prisma.treatment.create({
      data: { ...data, userId, endDate: new Date(data.endDate) },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.treatment.findMany({
      where: { userId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.treatment.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    const payload: any = { ...data };
    if (data.endDate) payload.endDate = new Date(data.endDate);
    return this.prisma.treatment.update({ where: { id }, data: payload });
  }

  async softDelete(id: string) {
    return this.prisma.treatment.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });
  }
}

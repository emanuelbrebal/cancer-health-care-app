import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class LeisureRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.leisureActivity.create({
      data: {
        ...data,
        status: 'ACTIVE'
      }
    });
  }

  async findAll() {
    return this.prisma.leisureActivity.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    return this.prisma.leisureActivity.findFirst({
      where: { id, status: 'ACTIVE' }
    });
  }

  async update(id: string, data: any) {
    return this.prisma.leisureActivity.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return this.prisma.leisureActivity.update({
      where: { id },
      data: { status: 'INACTIVE' }
    });
  }
}
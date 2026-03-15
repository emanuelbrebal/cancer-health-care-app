import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { StatusEnum } from "@prisma/client";

@Injectable()
export class CommunityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.community.create({
      data,
      include: { 
        owner: true, 
        _count: { select: { topics: true } } 
      }
    });
  }

  async findAll() {
    return this.prisma.community.findMany({
      where: { status: StatusEnum.ACTIVE },
      include: { 
        owner: true, 
        _count: { select: { topics: true } } 
      },
      orderBy: { name: 'asc' }
    });
  }

  async findOne(id: string) {
    return this.prisma.community.findUnique({
      where: { id },
      include: { 
        owner: true, 
        _count: { select: { topics: true } } 
      }
    });
  }

  async update(id: string, data: any) {
    return this.prisma.community.update({
      where: { id },
      data,
      include: { 
        owner: true, 
        _count: { select: { topics: true } } 
      }
    });
  }

}
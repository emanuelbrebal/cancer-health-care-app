import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { StatusEnum } from "@prisma/client";

@Injectable()
export class TopicsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.topic.create({
      data,
      include: { 
        author: true, 
        _count: { select: { posts: true } } 
      }
    });
  }

  async findByCommunity(communityId: string) {
    return this.prisma.topic.findMany({
      where: { 
        communityId, 
        status: StatusEnum.ACTIVE 
      },
      include: { 
        author: true, 
        _count: { select: { posts: true } } 
      },
      orderBy: { createdAt: 'desc' } 
    });
  }

  async findOne(id: string) {
    return this.prisma.topic.findFirst({
      where: { id, status: StatusEnum.ACTIVE },
      include: { 
        author: true, 
        _count: { select: { posts: true } } 
      }
    });
  }

  async update(id: string, data: any) {
    return this.prisma.topic.update({
      where: { id },
      data,
      include: { 
        author: true, 
        _count: { select: { posts: true } } 
      }
    });
  }

}
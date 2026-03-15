import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { StatusEnum } from "@prisma/client";

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.post.create({
      data,
      include: { 
        author: true, 
        _count: { select: { comments: true } } 
      }
    });
  }

  async findByTopic(topicId: string) {
    return this.prisma.post.findMany({
      where: { 
        topicId, 
        status: StatusEnum.ACTIVE 
      },
      include: { 
        author: true, 
        _count: { select: { comments: true } } 
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async findOne(id: string) {
    return this.prisma.post.findFirst({
      where: { id, status: StatusEnum.ACTIVE },
      include: { 
        author: true, 
        _count: { select: { comments: true } } 
      }
    });
  }

  async update(id: string, data: any) {
    return this.prisma.post.update({
      where: { id },
      data,
      include: { 
        author: true, 
        _count: { select: { comments: true } } 
      }
    });
  }

}
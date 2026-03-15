import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { StatusEnum } from "@prisma/client";

@Injectable()
export class CommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.comment.create({
      data,
      include: { author: true }
    });
  }

  async findByPost(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId, status: StatusEnum.ACTIVE },
      include: { author: true },
      orderBy: { createdAt: 'asc' }
    });
  }

  async findOne(id: string) {
    return this.prisma.comment.findFirst({
      where: { id, status: StatusEnum.ACTIVE },
      include: { author: true }
    });
  }

  async update(id: string, data: any) {
    return this.prisma.comment.update({
      where: { id },
      data,
      include: { author: true }
    });
  }

  async softDelete(id: string) {
    return this.prisma.comment.update({
      where: { id },
      data: { status: StatusEnum.DELETED }
    });
  }
}
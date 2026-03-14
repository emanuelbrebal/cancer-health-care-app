import { StatusEnum } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

export abstract class BaseMediaRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async delete(id: string) {
    return this.prisma.media.update({
      where: { id },
      data: { status: StatusEnum.INACTIVE },
    });
  }
}
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class DailyLogsRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findExistingByDate(userId: string, date: Date) {
    return this.prisma.dailyLog.findFirst({
      where: { userId, date },
    });
  }

  async findOne(id: string) {
    return this.prisma.dailyLog.findUnique({ where: { id } });
  }

  async createWithAudit(data: any) {
  const { userId, title, content, emotes, date } = data;

  if (!userId) {
    throw new Error('UserId é obrigatório para criar um diário.');
  }

  return this.prisma.$transaction(async (tx) => {
    const log = await tx.dailyLog.create({
      data: {
        title,
        content,
        emotes,
        userId,
        ...(date && { date }),
      },
    });

    await tx.dailyLogAudit.create({
      data: {
        logId: log.id,
        userId: log.userId,
        action: 'CREATE',
      },
    });

    return log;
  });
}

  async updateWithAudit(id: string, userId: string, data: any) {
    return this.prisma.$transaction(async (tx) => {
      const log = await tx.dailyLog.update({
        where: { id },
        data,
      });
      await tx.dailyLogAudit.create({
        data: { logId: id, userId: userId, action: 'UPDATE' },
      });
      return log;
    });
  }

  async hardDeleteWithAudit(id: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.dailyLogAudit.create({
        data: { logId: id, userId, action: 'DELETE' },
      });
      return tx.dailyLog.delete({ where: { id } });
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.dailyLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchLogs(userId: string, filters: any) {
    return this.prisma.dailyLog.findMany({
      where: {
        userId,
        AND: [
          filters.term ? {
            OR: [
              { title: { contains: filters.term, mode: 'insensitive' } },
              { content: { contains: filters.term, mode: 'insensitive' } },
            ]
          } : {},
          filters.date ? {
            createdAt: {
              gte: new Date(new Date(filters.date).setHours(0, 0, 0, 0)),
              lte: new Date(new Date(filters.date).setHours(23, 59, 59, 999)),
            }
          } : {},
          filters.emote ? { emotes: { has: filters.emote } } : {},
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByPeriod(userId: string, start: Date, end: Date) {
    return this.prisma.dailyLog.findMany({
      where: { userId, createdAt: { gte: start, lte: end } },
      select: { createdAt: true, emotes: true, title: true },
      orderBy: { createdAt: 'asc' }
    });
  }
}
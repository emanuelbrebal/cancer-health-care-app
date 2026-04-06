import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { MascotService } from './mascot.service';

@Injectable()
export class AiSchedulerService {
  private readonly logger = new Logger(AiSchedulerService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: MascotService
  ) { }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handlePeriodicUpdate() {
    this.logger.log('Iniciando atualização periódica de registros...');

    const users = await this.prisma.user.findMany({
      include: { logs: { take: 5, orderBy: { date: 'desc' } } }
    });

    for (const user of users) {
      if (user.logs.length === 0) continue;

      const logSummary = user.logs.map(l => l.content).join(' | ');

      const updateMessage = await this.aiService.generateResponse({
        userId: user.id,
        userQuestion: `Com base nos meus últimos registros: "${logSummary}", como você resume meu estado emocional esta semana?`,
        calendarData: {},
        treatmentData: {}
      });

      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastAiAnalysis: new Date() }
      });
    }
  }
}
import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateDailyLogDto } from './dto/create-daily-log.dto';
import { UpdateDailyLogDto } from './dto/update-daily-log.dto';
import { DailyLogsRepository } from './daily-logs.repository';
import { DailyLogResponseDto } from './dto/daily-log-response.dto';
import { DailyLogMapper } from './daily-logs.mapper';

@Injectable()
export class DailyLogsService {
  constructor(private readonly repository: DailyLogsRepository) { }

  async create(userId: string, dto: CreateDailyLogDto) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const exists = await this.repository.findExistingByDate(userId, startOfDay, endOfDay);
    if (exists) {
      throw new BadRequestException('Você já realizou a entrada de hoje. Só é permitida uma por dia.');
    }

    const data = { ...dto, userId: userId };

    return this.repository.createWithAudit(data);
  }

  async findOne(id: string, userId: string): Promise<any> {
    const log = await this.repository.findOne(id);

    if (!log) {
      throw new NotFoundException('Diário não encontrado.');
    }

    const logOwnerId = String(log.userId).trim();
    const currentUserId = String(userId).trim();
    const isOwner = logOwnerId === currentUserId;

    if (!isOwner) {
    throw new ForbiddenException('Acesso negado.');
  }

    return log;
  }

  async findAllByUser(userId: string): Promise<DailyLogResponseDto[]> {
    const logs = await this.repository.findAllByUser(userId);
    return DailyLogMapper.toResponseList(logs);
  }

  async search(userId: string, filters: any): Promise<DailyLogResponseDto[]> {
    const logs = await this.repository.searchLogs(userId, filters);

    return DailyLogMapper.toResponseList(logs);
  }

  async update(id: string, userId: string, dto: UpdateDailyLogDto) {
    const log = await this.repository.findOne(id);
    if (!log) throw new NotFoundException('Diário não encontrado.');

    return this.repository.updateWithAudit(id, userId, dto);
  }

  async remove(id: string, userId: string) {
    const log = await this.repository.findOne(id);
    if (!log) throw new NotFoundException('Diário não encontrado.');
    if (log.userId !== userId) throw new ForbiddenException('Acesso negado.');

    return this.repository.hardDeleteWithAudit(id, userId);
  }

  async getReportData(userId: string, start: Date, end: Date) {
    return this.repository.findByPeriod(userId, start, end);
  }
}
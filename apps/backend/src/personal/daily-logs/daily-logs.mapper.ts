import { DailyLog } from '@prisma/client';
import { DailyLogResponseDto } from './dto/daily-log-response.dto';

export class DailyLogMapper {
  static toResponse(log: DailyLog): DailyLogResponseDto {
    return {
      id: log.id,
      title: log.title,
      emotes: log.emotes,
      date: log.date,
      createdAt: log.createdAt,
    };
  }

  static toResponseList(logs: DailyLog[]): DailyLogResponseDto[] {
    return logs.map(log => this.toResponse(log));
  }
}
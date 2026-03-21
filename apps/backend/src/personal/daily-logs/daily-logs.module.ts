import { Module } from '@nestjs/common';
import { DailyLogsService } from './daily-logs.service';
import { DailyLogsController } from './daily-logs.controller';
import { DailyLogsRepository } from './daily-logs.repository';
import { DailyLogsReportService } from './daily-logs-report.service';

@Module({
  controllers: [DailyLogsController],
  providers: [DailyLogsService, DailyLogsRepository, DailyLogsReportService],
})
export class DailyLogsModule {}

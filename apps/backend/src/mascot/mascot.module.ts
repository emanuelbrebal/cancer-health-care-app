import { Module } from '@nestjs/common';
import { MascotService } from './mascot.service';
import { MascotController } from './mascot.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { AiSchedulerService } from './ai-scheduler.service';

@Module({
  controllers: [MascotController],
  imports: [ScheduleModule.forRoot()],
  providers: [MascotService, AiSchedulerService],
  exports: [MascotService]
})
export class MascotModule {}

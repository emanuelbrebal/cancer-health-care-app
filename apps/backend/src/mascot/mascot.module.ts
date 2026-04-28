import { Module } from '@nestjs/common';
import { MascotService } from './mascot.service';
import { MascotController } from './mascot.controller';

@Module({
  controllers: [MascotController],
  providers: [MascotService],
  exports: [MascotService]
})
export class MascotModule {}
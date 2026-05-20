import { Module } from '@nestjs/common';
import { MascotService } from './mascot.service';
import { MascotController } from './mascot.controller';
import { PromptLoaderService } from './prompt-loader.service';

@Module({
  controllers: [MascotController],
  providers: [MascotService, PromptLoaderService],
  exports: [MascotService],
})
export class MascotModule {}

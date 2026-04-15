import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AskAiDto } from './dto/ask-ai';
import { MascotService } from './mascot.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('ai-support')
export class MascotController {
  constructor(private readonly aiService: MascotService) {}

  // Rate limit
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('ask')
  async ask(@Body() askAiDto: AskAiDto) {
    return this.aiService.generateResponse(askAiDto);
  }
}
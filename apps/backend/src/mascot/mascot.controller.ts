import { Controller, Post, Body } from '@nestjs/common';
import { AskAiDto } from './dto/ask-ai';
import { MascotService } from './mascot.service';

@Controller('ai-support')
export class MascotController {
  constructor(private readonly aiService: MascotService) {}

  @Post('ask')
  async ask(@Body() askAiDto: AskAiDto) {
    return this.aiService.generateResponse(askAiDto);
  }
}
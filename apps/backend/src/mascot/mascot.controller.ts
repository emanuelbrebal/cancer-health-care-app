import { Controller, Post, Get, Body, UseGuards, Request, Req } from '@nestjs/common';
import { AskAiDto } from './dto/ask-ai';
import { MascotService } from './mascot.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('ai-support')
export class MascotController {
  constructor(private readonly aiService: MascotService) {}

  @UseGuards(JwtAuthGuard, ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('ask')
  async ask(@Req() req: any, @Body() askAiDto: AskAiDto) {
    return this.aiService.generateResponse(req.user.userId, askAiDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('context')
  async getContext(@Request() req) {
    return this.aiService.getUserContext(req.user.userId);
  }
}

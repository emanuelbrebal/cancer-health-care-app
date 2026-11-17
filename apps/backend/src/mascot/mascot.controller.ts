import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { AskAiDto } from './dto/ask-ai';
import { MascotService } from './mascot.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ConsentPurpose } from '@prisma/client';
import { ConsentGuard, RequiresConsent } from 'src/consent/consent.guard';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';

@RequiresConsent(ConsentPurpose.AI_MASCOT)
@Controller('ai-support')
export class MascotController {
  constructor(private readonly aiService: MascotService) {}

  @UseGuards(JwtAuthGuard, ConsentGuard, ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('ask')
  async ask(@Req() req: AuthenticatedRequest, @Body() askAiDto: AskAiDto) {
    return this.aiService.generateResponse(req.user.userId, askAiDto);
  }

  @UseGuards(JwtAuthGuard, ConsentGuard, ThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Get('context')
  async getContext(@Request() req: AuthenticatedRequest) {
    return this.aiService.getUserContext(req.user.userId);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConsentPurpose } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConsentService } from './consent.service';
import { SetConsentDto } from './dto/set-consent.dto';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';

// Só o titular lê e altera os próprios consentimentos: não há userId na rota.
@UseGuards(JwtAuthGuard)
@Controller('consents')
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Get()
  getState(@Req() req: AuthenticatedRequest) {
    return this.consentService.getState(req.user.userId);
  }

  @Get('history')
  history(@Req() req: AuthenticatedRequest) {
    return this.consentService.history(req.user.userId);
  }

  @Put(':purpose')
  set(
    @Req() req: AuthenticatedRequest,
    @Param('purpose', new ParseEnumPipe(ConsentPurpose))
    purpose: ConsentPurpose,
    @Body() dto: SetConsentDto,
  ) {
    return this.consentService.set(req.user.userId, purpose, dto.granted);
  }
}

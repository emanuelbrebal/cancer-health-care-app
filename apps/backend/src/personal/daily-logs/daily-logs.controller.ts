import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { DailyLogsService } from './daily-logs.service';
import { CreateDailyLogDto } from './dto/create-daily-log.dto';
import { UpdateDailyLogDto } from './dto/update-daily-log.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DailyLogsReportService } from './daily-logs-report.service';
import type { Response } from 'express';
import { Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@UseGuards(JwtAuthGuard)
@Controller('daily-logs')
export class DailyLogsController {
  constructor(private readonly service: DailyLogsService, private readonly reportService: DailyLogsReportService) { }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateDailyLogDto) {
    const userId = req.user.userId;
    return this.service.create(userId, dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.service.findOne(id, req.user.userId);
  }

  @Get()
  async findAll(@Req() req: any) {
    return this.service.findAllByUser(req.user.userId);
  }

  @Get('search')
  async search(
    @Req() req: any,
    @Query('term') term?: string,
    @Query('date') date?: string,
    @Query('emote') emote?: string,
  ) {
    return this.service.search(req.user.userId, {
      term,
      date: date ? new Date(date) : undefined,
      emote,
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateDailyLogDto) {
    const userId = req.user.userId;
    return this.service.update(id, userId, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.userId;
    await this.service.remove(id, userId);
    return { message: 'Entrada apagada permanentemente. Você pode realizar uma nova entrada hoje.' };
  }

  @Throttle({ default: { limit: 2, ttl: 60000 } })
  @Get('report/pdf')
  async exportPdf(
    @Req() req: any,
    @Query('start') start: string,
    @Query('end') end: string,
    @Res() res: Response
  ) {
    const buffer = await this.reportService.generateEmotionsPdf(
      req.userId,
      new Date(start),
      new Date(end)
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=relatorio-emocional-${req.userId}.pdf`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
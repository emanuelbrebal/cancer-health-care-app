import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { TreatmentsService } from './treatments.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('personal/treatments')
export class TreatmentsController {
  constructor(private readonly service: TreatmentsService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateTreatmentDto) {
    return this.service.create(req.user.userId, dto);
  }

  @Get()
  async findAll(@Req() req: any) {
    return this.service.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.service.findOne(id, req.user.userId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateTreatmentDto) {
    return this.service.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(id, req.user.userId);
  }
}

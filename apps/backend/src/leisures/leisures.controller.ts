import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LeisuresService } from './leisures.service';
import { CreateLeisureDto } from './dto/create-leisure.dto';
import { UpdateLeisureDto } from './dto/update-leisure.dto';

@Controller('leisures')
export class LeisuresController {
  constructor(private readonly leisuresService: LeisuresService) {}

  @Post()
  create(@Body() createLeisureDto: CreateLeisureDto) {
    return this.leisuresService.create(createLeisureDto);
  }

  @Get()
  findAll() {
    return this.leisuresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leisuresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeisureDto: UpdateLeisureDto) {
    return this.leisuresService.update(+id, updateLeisureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leisuresService.remove(+id);
  }
}

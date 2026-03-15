import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { SocialMapper } from '../mappers/social.mapper';

@Controller('topics')
export class TopicsController {
  constructor(private readonly service: TopicsService) { }

  @Post()
  async create(@Body() dto: CreateTopicDto) {
    const topic = await this.service.create(dto);
    return {
      message: 'Tópico criado com sucesso!',
      data: SocialMapper.toTopicDto(topic)
    };
  }


  @Get('community/:communityId')
  async findByCommunity(@Param('communityId') communityId: string) {
    const topics = await this.service.findAllByCommunity(communityId);
    return topics.map(topic => SocialMapper.toTopicDto(topic));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const topic = await this.service.findOne(id);
    return SocialMapper.toTopicDto(topic);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTopicDto) {
    if (!dto || Object.keys(dto).length === 0) throw new BadRequestException('Dados inválidos');
    const updated = await this.service.update(id, dto);
    return SocialMapper.toTopicDto(updated);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Tópico e suas publicações desativados.' };
  }
}
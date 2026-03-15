import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { SocialMapper } from '../mappers/social.mapper';
import { CommunityService } from './communities.service';

@Controller('communities')
export class CommunitiesController {
  constructor(private readonly service: CommunityService) {}

  @Post()
  async create(@Body() dto: CreateCommunityDto) {
    const community = await this.service.create(dto);
    return {
      message: 'Comunidade criada com sucesso!',
      data: SocialMapper.toCommunityDto(community)
    };
  }

  @Get()
  async findAll() {
    const communities = await this.service.findAll();
    return communities.map(community => SocialMapper.toCommunityDto(community));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const community = await this.service.findOne(id);
    return SocialMapper.toCommunityDto(community);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCommunityDto) {
    if (!dto || Object.keys(dto).length === 0) throw new BadRequestException('Dados inválidos');
    const updated = await this.service.update(id, dto);
    return SocialMapper.toCommunityDto(updated);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Comunidade e seus tópicos desativados com sucesso.' };
  }
}
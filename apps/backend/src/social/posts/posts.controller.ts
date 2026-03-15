import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SocialMapper } from '../mappers/social.mapper';

@Controller('posts')
export class PostsController {
  constructor(private readonly service: PostsService) {}

  @Post()
  async create(@Body() dto: CreatePostDto) {
    const post = await this.service.create(dto);
    return {
      message: 'Publicação realizada!',
      data: SocialMapper.toPostDto(post)
    };
  }

  @Get('topic/:topicId')
  async findByTopic(@Param('topicId') topicId: string) {
    const posts = await this.service.findAllByTopic(topicId);
    return posts.map(post => SocialMapper.toPostDto(post));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    const updated = await this.service.update(id, dto);
    return SocialMapper.toPostDto(updated);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Publicação e comentários removidos.' };
  }
}

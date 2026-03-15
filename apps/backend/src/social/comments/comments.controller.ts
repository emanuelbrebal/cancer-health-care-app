import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SocialMapper } from '../mappers/social.mapper';

@Controller('comments')
export class CommentsController {
  constructor(private readonly service: CommentsService) {}

  @Post()
  async create(@Body() dto: CreateCommentDto) {
    const comment = await this.service.create(dto);
    return {
      message: 'Comentário enviado!',
      data: SocialMapper.toCommentDto(comment)
    };
  }

  @Get('post/:postId')
  async findByPost(@Param('postId') postId: string) {
    const comments = await this.service.findAllByPost(postId);
    return comments.map(comment => SocialMapper.toCommentDto(comment));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Comentário removido com sucesso.' };
  }
}

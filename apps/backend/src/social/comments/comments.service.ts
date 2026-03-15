import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly repository: CommentsRepository) {}

  async create(dto: CreateCommentDto) {
    return this.repository.create(dto);
  }

  async findAllByPost(postId: string) {
    return this.repository.findByPost(postId);
  }

  async findOne(id: string) {
    const comment = await this.repository.findOne(id);
    if (!comment) {
      throw new NotFoundException('Comentário não encontrado ou já foi removido.');
    }
    return comment;
  }

  async update(id: string, dto: UpdateCommentDto) {
    await this.findOne(id); 
    return this.repository.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id); 
    return this.repository.softDelete(id);
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CascadeManager } from 'src/shared/utils/cascade-delete.util';

@Injectable()
export class PostsService {
  constructor(
    private readonly repository: PostsRepository,
    private readonly cascadeManager: CascadeManager

  ) {}

  async create(dto: CreatePostDto) {
    return this.repository.create(dto);
  }

  async findAllByCommunity(topicId: string) {
    return this.repository.findByTopic(topicId);
  }

  async findAllByTopic(topicId: string) {
    return this.repository.findByTopic(topicId);
  }

  async findOne(id: string) {
    const post = await this.repository.findOne(id);
    if (!post) {
      throw new NotFoundException('Publicação não encontrada ou desativada.');
    }
    return post;
  }

  async update(id: string, dto: UpdatePostDto) {
    await this.findOne(id);
    return this.repository.update(id, dto);
  }

  async remove(id: string) {
     return this.cascadeManager.softDeleteCascade('community', id, [
      { modelName: 'post', foreignKey: 'communityId' },
      { modelName: 'comment', foreignKey: 'topicId' }
    ]);
  }
}
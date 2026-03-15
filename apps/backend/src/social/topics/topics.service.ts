import { Injectable, NotFoundException } from '@nestjs/common';
import { TopicsRepository } from './topics.repository';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { CascadeManager } from 'src/shared/utils/cascade-delete.util';

@Injectable()
export class TopicsService {
  constructor(
    private readonly repository: TopicsRepository,
    private readonly cascadeManager: CascadeManager
  ) { }

  async create(dto: CreateTopicDto) {
    return this.repository.create(dto);
  }

  async findAllByCommunity(communityId: string) {
    return this.repository.findByCommunity(communityId);
  }

  async findOne(id: string) {
    const topic = await this.repository.findOne(id);
    if (!topic) {
      throw new NotFoundException('Tópico não encontrado ou inativo.');
    }
    return topic;
  }

  async update(id: string, dto: UpdateTopicDto) {
    await this.findOne(id);
    return this.repository.update(id, dto);
  }

  async remove(id: string) {
    return this.cascadeManager.softDeleteCascade('topic', id, [
      { modelName: 'post', foreignKey: 'topicId' }
    ]);
  }
}
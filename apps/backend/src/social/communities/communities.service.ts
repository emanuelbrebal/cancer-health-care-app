import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { StatusEnum } from '@prisma/client';
import { CommunityRepository } from './communities.repository';
import { CascadeManager } from 'src/shared/utils/cascade-delete.util';

@Injectable()
export class CommunityService {
  constructor(
    private readonly repository: CommunityRepository,
    private readonly cascadeManager: CascadeManager
  ) { }

  async create(dto: CreateCommunityDto) {
    return this.repository.create(dto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const community = await this.repository.findOne(id);
    if (!community || community.status !== StatusEnum.ACTIVE) {
      throw new NotFoundException('Comunidade não encontrada ou inativa.');
    }
    return community;
  }

  async update(id: string, dto: UpdateCommunityDto) {
    await this.findOne(id);
    return this.repository.update(id, dto);
  }

  async remove(id: string) {
    return this.cascadeManager.softDeleteCascade('post', id, [
      { modelName: 'comment', foreignKey: 'postId' }
    ]);
  }
}
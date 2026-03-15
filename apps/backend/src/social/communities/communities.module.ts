import { Module } from '@nestjs/common';
import { CommunitiesController } from './communities.controller';
import { CommunityRepository } from './communities.repository';
import { CommunityService } from './communities.service';

@Module({
  controllers: [CommunitiesController],
  providers: [CommunityService, CommunityRepository],
})
export class CommunitiesModule {}

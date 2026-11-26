import { Module } from '@nestjs/common';
import { MediaRulesService } from '../common/media-rules.service';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MoviesRepository } from './movies.repository';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService, MoviesRepository, MediaRulesService],
})
export class MoviesModule {}

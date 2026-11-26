import { Module } from '@nestjs/common';
import { MediaRulesService } from '../common/media-rules.service';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { SeriesRepository } from './series.repository';

@Module({
  controllers: [SeriesController],
  providers: [SeriesService, SeriesRepository, MediaRulesService],
})
export class SeriesModule {}

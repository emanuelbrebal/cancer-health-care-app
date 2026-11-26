import { Module } from '@nestjs/common';
import {
  AdminBooksController,
  AdminMoviesController,
  AdminSeriesController,
} from './admin-media.controllers';
import { AdminMediaService } from './admin-media.service';

@Module({
  controllers: [
    AdminBooksController,
    AdminMoviesController,
    AdminSeriesController,
  ],
  providers: [AdminMediaService],
})
export class AdminMediaModule {}

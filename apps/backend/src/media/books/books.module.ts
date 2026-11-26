import { Module } from '@nestjs/common';
import { MediaRulesService } from '../common/media-rules.service';
import { BooksRepository } from './books.repository';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService, BooksRepository, MediaRulesService],
})
export class BooksModule {}

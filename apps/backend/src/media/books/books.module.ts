import { Module } from '@nestjs/common';
import { BooksRepository } from './books.repository';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService, BooksRepository],
})
export class BooksModule {}

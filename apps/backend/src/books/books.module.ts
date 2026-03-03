import { Module } from '@nestjs/common';
import { BooksRepository } from './books.repository';
import { BooksController } from './books.controller';

@Module({
  controllers: [BooksController],
  providers: [BooksRepository],
})
export class BooksModule {}

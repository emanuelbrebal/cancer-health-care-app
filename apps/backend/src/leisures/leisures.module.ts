import { Module } from '@nestjs/common';
import { LeisuresService } from './leisures.service';
import { LeisuresController } from './leisures.controller';
import { BooksModule } from 'src/media/books/books.module';

@Module({
  imports: [BooksModule],
  controllers: [LeisuresController],
  providers: [LeisuresService],
})
export class LeisuresModule {}

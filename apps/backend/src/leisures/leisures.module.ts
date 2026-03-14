import { Module } from '@nestjs/common';
import { LeisuresService } from './leisures.service';
import { LeisuresController } from './leisures.controller';
import { BooksModule } from 'src/media/books/books.module';
import { LeisureRepository } from './leisures.repository';

@Module({
  imports: [BooksModule],
  controllers: [LeisuresController],
  providers: [LeisuresService, LeisureRepository],
})
export class LeisuresModule {}

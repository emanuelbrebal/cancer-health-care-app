import { Module } from '@nestjs/common';
import { AdminGenresController, GenresController } from './genres.controller';
import { GenresService } from './genres.service';

@Module({
  controllers: [GenresController, AdminGenresController],
  providers: [GenresService],
})
export class GenresModule {}

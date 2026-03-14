import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './user/user.module';
import { BooksModule } from './media/books/books.module';
import { LeisuresModule } from './leisures/leisures.module';
import { MoviesModule } from './media/movies/movies.module';
import { SeriesModule } from './media/series/series.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, BooksModule, MoviesModule, SeriesModule, LeisuresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

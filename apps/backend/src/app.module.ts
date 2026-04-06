import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './user/user.module';
import { BooksModule } from './media/books/books.module';
import { LeisuresModule } from './leisures/leisures.module';
import { MoviesModule } from './media/movies/movies.module';
import { SeriesModule } from './media/series/series.module';
import { CommunitiesModule } from './social/communities/communities.module';
import { TopicsModule } from './social/topics/topics.module';
import { PostsModule } from './social/posts/posts.module';
import { CommentsModule } from './social/comments/comments.module';
import { AppService } from './app.service';
import { DailyLogsModule } from './personal/daily-logs/daily-logs.module';
import { MascotModule } from './mascot/mascot.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    // Social Modules
    CommunitiesModule,
    TopicsModule,
    PostsModule,
    CommentsModule,
    // Media Modules
    BooksModule,
    MoviesModule,
    SeriesModule,
    LeisuresModule,
    //Personal Modules,
    DailyLogsModule,
    MascotModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }

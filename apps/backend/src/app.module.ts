import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './user/user.module';
import { BooksModule } from './media/books/books.module';
import { LeisuresModule } from './leisures/leisures.module';
import { MoviesModule } from './media/movies/movies.module';
import { SeriesModule } from './media/series/series.module';
import { GenresModule } from './media/genres/genres.module';
import { AppService } from './app.service';
import { DailyLogsModule } from './personal/daily-logs/daily-logs.module';
import { TreatmentsModule } from './personal/treatments/treatments.module';
import { MascotModule } from './mascot/mascot.module';
import { ConsentModule } from './consent/consent.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    // Mídia e lazer
    BooksModule,
    MoviesModule,
    SeriesModule,
    GenresModule,
    LeisuresModule,
    // Área pessoal, mascote e consentimento
    DailyLogsModule,
    TreatmentsModule,
    MascotModule,
    ConsentModule,
    // Rate limit global: 120 requisições por minuto
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 120,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

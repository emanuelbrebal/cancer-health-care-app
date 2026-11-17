import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConsentController } from './consent.controller';
import { ConsentGuard } from './consent.guard';
import { ConsentService } from './consent.service';

// Global: o ConsentGuard é usado pelos controllers de diário, tratamentos e mascote.
@Global()
@Module({
  imports: [PrismaModule],
  controllers: [ConsentController],
  providers: [ConsentService, ConsentGuard],
  exports: [ConsentService, ConsentGuard],
})
export class ConsentModule {}

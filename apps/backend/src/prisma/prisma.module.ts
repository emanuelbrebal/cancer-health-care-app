import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CascadeManager } from 'src/shared/utils/cascade-delete.util';

@Global()
@Module({
  providers: [PrismaService, CascadeManager],
  exports: [PrismaService, CascadeManager],
})
export class PrismaModule {}
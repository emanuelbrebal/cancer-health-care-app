import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersRepository } from './user.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [UsersController],
    providers: [UsersRepository, PrismaService],
    exports: [UsersRepository],
})
export class UsersModule { }
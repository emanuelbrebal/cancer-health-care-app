import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersRepository } from './user.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from './user.service';

@Module({
    imports: [AuthModule],
    controllers: [UsersController],
    providers: [UsersRepository, PrismaService, UsersService],
    exports: [UsersRepository],
})
export class UsersModule { }
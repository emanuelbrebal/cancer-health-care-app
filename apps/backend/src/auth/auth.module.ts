import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    MailerModule,
    JwtModule.registerAsync({
      useFactory: async () => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error('JWT_SECRET não definido. Configure a variável de ambiente antes de iniciar o servidor.');
        }
        return { secret, signOptions: { expiresIn: '7d' } };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
import { Module } from '@nestjs/common';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailerModule } from '../mailer/mailer.module';
import { SessionService } from './session.service';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    MailerModule,
    JwtModule.registerAsync({
      useFactory: async () => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error(
            'JWT_SECRET não definido. Configure a variável de ambiente antes de iniciar o servidor.',
          );
        }
        // Access token curto: a sessão longa é mantida pelo refresh token (SessionService).
        const expiresIn = (process.env.JWT_ACCESS_TTL ??
          '15m') as JwtSignOptions['expiresIn'];
        return { secret, signOptions: { expiresIn } };
      },
    }),
  ],
  providers: [AuthService, SessionService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, SessionService],
})
export class AuthModule {}

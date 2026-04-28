import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) { }

  async register(registerDto: RegisterDto) {
    const { email, password, role, name } = registerDto;
    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) throw new ConflictException('E-mail já cadastrado');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.prisma.user.create({
      data: { email, password: hashedPassword, role, ...(name && { name }) },
    });
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    if (!email) {
      throw new BadRequestException('E-mail é obrigatório para o login');
    }

    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) throw new UnauthorizedException('Senha atual incorreta');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    return { message: 'Senha alterada com sucesso' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    // Resposta genérica — não revelar se o e-mail existe ou não
    if (!user) {
      return { message: 'Se o e-mail estiver cadastrado, você receberá as instruções em breve.' };
    }

    const token = this.jwtService.sign(
      { sub: user.id, purpose: 'reset-password' },
      { expiresIn: '15m' },
    );

    await this.mailerService.sendResetPasswordEmail(user.email, token);

    return {
      message: 'Se o e-mail estiver cadastrado, você receberá as instruções em breve.',
      // token exposto apenas em ambiente de desenvolvimento para facilitar testes
      ...(process.env.NODE_ENV !== 'production' && { debug_token: token }),
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    let payload: any;
    try {
      payload = this.jwtService.verify(dto.token);
    } catch {
      throw new BadRequestException('Token inválido ou expirado.');
    }

    if (payload.purpose !== 'reset-password') {
      throw new BadRequestException('Token inválido.');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { password: hashed },
    });

    return { message: 'Senha redefinida com sucesso.' };
  }
}
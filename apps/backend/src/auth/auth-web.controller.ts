import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { CookieOptions, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AdminWebClientGuard } from './guards/admin-web-client.guard';
import { UserMapper } from 'src/user/user.mapper';

export const ADMIN_REFRESH_COOKIE = 'oncomente_admin_rt';
const ADMIN_COOKIE_PATH = '/auth/web';
const DAY_MS = 24 * 60 * 60 * 1000;

// Sessão do painel web (PRD 01): o refresh token vai em cookie HttpOnly e nunca no corpo.
// As rotas /auth/{login,refresh,logout} do app móvel seguem inalteradas.
@Controller('auth/web')
@UseGuards(AdminWebClientGuard)
export class AuthWebController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.loginAdmin(dto);
    res.cookie(ADMIN_REFRESH_COOKIE, result.refresh_token, cookieOptions());
    return {
      access_token: result.access_token,
      user: UserMapper.toDto(result.user),
    };
  }

  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = readRefreshCookie(req);
    if (!token) {
      throw new UnauthorizedException('Sessão expirada. Entre novamente.');
    }
    try {
      const session = await this.authService.refreshAdmin(token);
      res.cookie(ADMIN_REFRESH_COOKIE, session.refresh_token, cookieOptions());
      return {
        access_token: session.access_token,
        user: UserMapper.toDto(session.user),
      };
    } catch (error) {
      res.clearCookie(ADMIN_REFRESH_COOKIE, clearOptions());
      throw error;
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = readRefreshCookie(req);
    if (token) await this.authService.logout(token);
    res.clearCookie(ADMIN_REFRESH_COOKIE, clearOptions());
    return { message: 'Sessão encerrada.' };
  }
}

function readRefreshCookie(req: Request): string | undefined {
  const cookies = req.cookies as Record<string, unknown> | undefined;
  const value = cookies?.[ADMIN_REFRESH_COOKIE];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// Secure por padrão (navegadores aceitam Secure em http://localhost). COOKIE_SECURE=false
// só para acessar o painel em dev por IP da rede, que não é contexto seguro.
function clearOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE !== 'false',
    sameSite: 'strict',
    path: ADMIN_COOKIE_PATH,
  };
}

function cookieOptions(): CookieOptions {
  const days = Number(process.env.REFRESH_TTL_DAYS);
  return {
    ...clearOptions(),
    maxAge: (Number.isFinite(days) && days > 0 ? days : 7) * DAY_MS,
  };
}

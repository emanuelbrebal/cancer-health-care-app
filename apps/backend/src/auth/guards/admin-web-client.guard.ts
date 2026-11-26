import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';

export const ADMIN_WEB_HEADER = 'x-requested-with';
export const ADMIN_WEB_HEADER_VALUE = 'oncomente-admin';

// Defesa CSRF das rotas de sessão por cookie: além do SameSite=Strict, exige um header
// customizado que um formulário ou link de outro site não consegue enviar sem preflight de CORS.
@Injectable()
export class AdminWebClientGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (request.headers[ADMIN_WEB_HEADER] !== ADMIN_WEB_HEADER_VALUE) {
      throw new ForbiddenException('Cliente não autorizado.');
    }
    return true;
  }
}

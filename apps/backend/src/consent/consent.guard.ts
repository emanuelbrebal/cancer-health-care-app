import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConsentPurpose } from '@prisma/client';
import { ConsentService } from './consent.service';

export const CONSENT_KEY = 'consent_purpose';
export const RequiresConsent = (purpose: ConsentPurpose) =>
  SetMetadata(CONSENT_KEY, purpose);

// Deve vir depois do JwtAuthGuard. Sem consentimento ativo para a finalidade da rota,
// responde 403 com code CONSENT_REQUIRED para o app saber o que pedir ao usuário.
@Injectable()
export class ConsentGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly consentService: ConsentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const purpose = this.reflector.getAllAndOverride<ConsentPurpose>(
      CONSENT_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!purpose) return true;

    const { user } = context.switchToHttp().getRequest();
    if (user && (await this.consentService.isGranted(user.userId, purpose))) {
      return true;
    }
    throw new ForbiddenException({
      message: 'Esta funcionalidade precisa do seu consentimento.',
      code: 'CONSENT_REQUIRED',
      purpose,
    });
  }
}

import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { RolesGuard } from './roles.guard';

const contextFor = (user?: { role: UserRole }) =>
  ({
    getHandler: () => undefined,
    getClass: () => undefined,
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  }) as unknown as ExecutionContext;

const guardRequiring = (roles?: UserRole[]) => {
  const reflector = new Reflector();
  jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(roles);
  return new RolesGuard(reflector);
};

describe('RolesGuard', () => {
  it('libera rota sem @Roles', () => {
    expect(guardRequiring().canActivate(contextFor())).toBe(true);
  });

  it('libera quem tem a role exigida', () => {
    const guard = guardRequiring([UserRole.ADMIN]);
    expect(guard.canActivate(contextFor({ role: UserRole.ADMIN }))).toBe(true);
  });

  it('bloqueia paciente em rota de ADMIN', () => {
    const guard = guardRequiring([UserRole.ADMIN]);
    expect(() =>
      guard.canActivate(contextFor({ role: UserRole.PATIENT })),
    ).toThrow(ForbiddenException);
  });

  it('bloqueia requisição sem usuário', () => {
    const guard = guardRequiring([UserRole.ADMIN]);
    expect(() => guard.canActivate(contextFor())).toThrow(ForbiddenException);
  });
});

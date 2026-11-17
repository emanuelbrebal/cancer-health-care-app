import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConsentPurpose } from '@prisma/client';
import { ConsentGuard } from './consent.guard';
import { ConsentService } from './consent.service';

type Row = {
  userId: string;
  purpose: ConsentPurpose;
  granted: boolean;
  termVersion: string;
  createdAt: Date;
};

function fakePrisma() {
  const rows: Row[] = [];
  let tick = 0;
  return {
    rows,
    consentRecord: {
      create: jest.fn(({ data }) => {
        rows.push({ ...data, createdAt: new Date(++tick) });
        return Promise.resolve();
      }),
      findFirst: jest.fn(({ where }) =>
        Promise.resolve(
          rows
            .filter(
              (r) => r.userId === where.userId && r.purpose === where.purpose,
            )
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0] ??
            null,
        ),
      ),
    },
  };
}

const contextFor = (userId?: string) =>
  ({
    getHandler: () => undefined,
    getClass: () => undefined,
    switchToHttp: () => ({
      getRequest: () => ({ user: userId ? { userId } : undefined }),
    }),
  }) as unknown as ExecutionContext;

describe('Consentimento', () => {
  let prisma: ReturnType<typeof fakePrisma>;
  let service: ConsentService;

  beforeEach(() => {
    delete process.env.CONSENT_TERM_VERSION;
    prisma = fakePrisma();
    service = new ConsentService(prisma as any);
  });

  describe('ConsentService', () => {
    it('usuário novo tem as três finalidades negadas', async () => {
      const state = await service.getState('user-1');

      expect(state.map((s) => s.purpose).sort()).toEqual([
        'AI_MASCOT',
        'HEALTH_DATA',
        'NOTIFICATIONS',
      ]);
      expect(state.every((s) => s.granted === false)).toBe(true);
    });

    it('conceder uma finalidade não concede as outras', async () => {
      await service.set('user-1', ConsentPurpose.HEALTH_DATA, true);

      expect(await service.isGranted('user-1', 'HEALTH_DATA')).toBe(true);
      expect(await service.isGranted('user-1', 'AI_MASCOT')).toBe(false);
      expect(await service.isGranted('user-2', 'HEALTH_DATA')).toBe(false);
    });

    it('revogar grava nova linha e preserva o histórico', async () => {
      await service.set('user-1', ConsentPurpose.AI_MASCOT, true);
      await service.set('user-1', ConsentPurpose.AI_MASCOT, false);

      expect(await service.isGranted('user-1', 'AI_MASCOT')).toBe(false);
      expect(prisma.rows.map((r) => r.granted)).toEqual([true, false]);
    });

    it('não duplica registro quando o estado não muda', async () => {
      await service.set('user-1', ConsentPurpose.NOTIFICATIONS, false);
      await service.set('user-1', ConsentPurpose.NOTIFICATIONS, true);
      await service.set('user-1', ConsentPurpose.NOTIFICATIONS, true);

      expect(prisma.rows).toHaveLength(1);
    });

    it('nova versão do termo invalida o aceite anterior', async () => {
      await service.set('user-1', ConsentPurpose.HEALTH_DATA, true);
      process.env.CONSENT_TERM_VERSION = '2.0';

      expect(await service.isGranted('user-1', 'HEALTH_DATA')).toBe(false);
    });
  });

  describe('ConsentGuard', () => {
    const guardFor = (purpose?: ConsentPurpose) => {
      const reflector = new Reflector();
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(purpose);
      return new ConsentGuard(reflector, service);
    };

    it('bloqueia com CONSENT_REQUIRED e a finalidade', async () => {
      const guard = guardFor(ConsentPurpose.HEALTH_DATA);

      const error = await guard
        .canActivate(contextFor('user-1'))
        .catch((e) => e);

      expect(error).toBeInstanceOf(ForbiddenException);
      expect(error.getResponse()).toMatchObject({
        code: 'CONSENT_REQUIRED',
        purpose: 'HEALTH_DATA',
      });
    });

    it('libera após conceder e volta a bloquear após revogar', async () => {
      const guard = guardFor(ConsentPurpose.AI_MASCOT);

      await service.set('user-1', ConsentPurpose.AI_MASCOT, true);
      await expect(guard.canActivate(contextFor('user-1'))).resolves.toBe(true);

      await service.set('user-1', ConsentPurpose.AI_MASCOT, false);
      await expect(guard.canActivate(contextFor('user-1'))).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('rota sem finalidade declarada não é afetada', async () => {
      await expect(guardFor().canActivate(contextFor('user-1'))).resolves.toBe(
        true,
      );
    });
  });
});

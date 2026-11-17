import { UnauthorizedException } from '@nestjs/common';
import { SessionService } from './session.service';

type Row = {
  id: string;
  userId: string;
  familyId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
};

const matches = (row: Row, where: Partial<Row>) =>
  Object.entries(where).every(([key, value]) => row[key] === value);

function fakePrisma() {
  const rows: Row[] = [];
  return {
    rows,
    refreshToken: {
      create: jest.fn(({ data }) => {
        const row = { id: `id-${rows.length}`, revokedAt: null, ...data };
        rows.push(row);
        return Promise.resolve(row);
      }),
      findUnique: jest.fn(({ where }) =>
        Promise.resolve(
          rows.find((r) => r.tokenHash === where.tokenHash) ?? null,
        ),
      ),
      updateMany: jest.fn(({ where, data }) => {
        const hit = rows.filter((r) => matches(r, where));
        hit.forEach((r) => Object.assign(r, data));
        return Promise.resolve({ count: hit.length });
      }),
    },
  };
}

describe('SessionService', () => {
  let prisma: ReturnType<typeof fakePrisma>;
  let service: SessionService;

  beforeEach(() => {
    delete process.env.REFRESH_TTL_DAYS;
    prisma = fakePrisma();
    service = new SessionService(prisma as any);
  });

  it('guarda só o hash e expira em 7 dias por padrão', async () => {
    const token = await service.issue('user-1');
    const [row] = prisma.rows;

    expect(row.tokenHash).not.toContain(token);
    const days = (row.expiresAt.getTime() - Date.now()) / 86_400_000;
    expect(days).toBeGreaterThan(6.99);
    expect(days).toBeLessThanOrEqual(7);
  });

  it('rotaciona: revoga o token usado e emite outro na mesma família', async () => {
    const first = await service.issue('user-1');
    const { userId, refreshToken } = await service.rotate(first);

    expect(userId).toBe('user-1');
    expect(refreshToken).not.toBe(first);
    expect(prisma.rows).toHaveLength(2);
    expect(prisma.rows[0].revokedAt).toBeInstanceOf(Date);
    expect(prisma.rows[1].revokedAt).toBeNull();
    expect(prisma.rows[1].familyId).toBe(prisma.rows[0].familyId);
  });

  it('janela deslizante: cada rotação renova a validade', async () => {
    const first = await service.issue('user-1');
    prisma.rows[0].expiresAt = new Date(Date.now() + 60_000);

    await service.rotate(first);

    expect(prisma.rows[1].expiresAt.getTime()).toBeGreaterThan(
      Date.now() + 6 * 86_400_000,
    );
  });

  it('reuso de token já rotacionado revoga a família inteira', async () => {
    const first = await service.issue('user-1');
    const { refreshToken: second } = await service.rotate(first);

    await expect(service.rotate(first)).rejects.toThrow(UnauthorizedException);
    await expect(service.rotate(second)).rejects.toThrow(UnauthorizedException);
    expect(prisma.rows.every((r) => r.revokedAt)).toBe(true);
  });

  it('recusa token expirado e token desconhecido', async () => {
    const token = await service.issue('user-1');
    prisma.rows[0].expiresAt = new Date(Date.now() - 1);

    await expect(service.rotate(token)).rejects.toThrow(UnauthorizedException);
    await expect(service.rotate('inexistente')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('logout invalida o refresh token', async () => {
    const token = await service.issue('user-1');
    await service.revoke(token);

    await expect(service.rotate(token)).rejects.toThrow(UnauthorizedException);
  });

  it('revokeAllForUser encerra todas as sessões só daquele usuário', async () => {
    const mine = await service.issue('user-1');
    const other = await service.issue('user-2');

    await service.revokeAllForUser('user-1');

    await expect(service.rotate(mine)).rejects.toThrow(UnauthorizedException);
    await expect(service.rotate(other)).resolves.toMatchObject({
      userId: 'user-2',
    });
  });
});

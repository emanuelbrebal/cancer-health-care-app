import { UsersService } from './user.service';
import { pseudonymize } from '../shared/utils/pseudonym.util';

describe('UsersService — ciclo de vida da conta', () => {
  const user = {
    id: 'user-1',
    email: 'ana@exemplo.com',
    name: 'Ana Souza',
    role: 'PATIENT',
  };

  let prisma: any;
  let sessions: { revokeAllForUser: jest.Mock };
  let service: UsersService;

  beforeEach(() => {
    process.env.PSEUDONYM_KEY = 'chave-de-teste';
    prisma = {
      $transaction: jest.fn((ops) => Promise.all(ops)),
      user: {
        update: jest.fn().mockResolvedValue(user),
        delete: jest.fn().mockResolvedValue(user),
      },
      patientSupportLog: { deleteMany: jest.fn().mockResolvedValue({}) },
      dailyLogAudit: { updateMany: jest.fn().mockResolvedValue({}) },
      userDeletionLog: { create: jest.fn().mockResolvedValue({}) },
    };
    sessions = { revokeAllForUser: jest.fn().mockResolvedValue(undefined) };
    const repository = { findById: jest.fn().mockResolvedValue(user) };
    service = new UsersService(repository as any, prisma, sessions as any);
  });

  it('pseudônimo é estável, não contém o id e depende da chave', () => {
    const ref = pseudonymize('user-1');

    expect(ref).toBe(pseudonymize('user-1'));
    expect(ref).not.toContain('user-1');
    process.env.PSEUDONYM_KEY = 'outra-chave';
    expect(pseudonymize('user-1')).not.toBe(ref);
  });

  it('suspender marca INACTIVE, encerra as sessões e não apaga nada', async () => {
    await service.suspend('user-1');

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { status: 'INACTIVE', suspendedAt: expect.any(Date) },
    });
    expect(sessions.revokeAllForUser).toHaveBeenCalledWith('user-1');
    expect(prisma.user.delete).not.toHaveBeenCalled();
    expect(prisma.patientSupportLog.deleteMany).not.toHaveBeenCalled();
  });

  it('excluir apaga a conta e as conversas do mascote em uma transação', async () => {
    await service.remove('user-1');
    const userRef = pseudonymize('user-1');

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.patientSupportLog.deleteMany).toHaveBeenCalledWith({
      where: { userId: { in: ['user-1', userRef] } },
    });
    expect(prisma.dailyLogAudit.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      data: { userId: userRef },
    });
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'user-1' } });
  });

  it('registro de exclusão não guarda e-mail, nome nem o id em claro', async () => {
    await service.remove('user-1', 'pedido do titular');

    const { data } = prisma.userDeletionLog.create.mock.calls[0][0];
    expect(data).toEqual({
      userRef: pseudonymize('user-1'),
      role: 'PATIENT',
      reason: 'pedido do titular',
    });
    expect(JSON.stringify(data)).not.toMatch(/ana@exemplo\.com|Ana Souza|user-1/);
  });
});

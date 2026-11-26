import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import {
  api,
  closeApp,
  createApp,
  createUser,
  login,
  resetDatabase,
} from './helpers';

// PRD 04 W04-7 (tasks/backend-admin-fixes.md): o ADMIN não exclui a própria conta pelo
// DELETE /users/:id e o sistema nunca fica sem conta ADMIN ativa.
describe('Exclusão de contas pelo admin (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let token: string;
  let adminId: string;
  let otherAdminId: string;
  let patientId: string;

  const auth = () => ({ Authorization: `Bearer ${token}` });

  beforeAll(async () => {
    ({ app, prisma } = await createApp());
    await resetDatabase(prisma);
    ({ id: adminId } = await createUser(prisma, 'admin@e2e.test'));
    ({ id: otherAdminId } = await createUser(prisma, 'admin2@e2e.test'));
    ({ id: patientId } = await createUser(prisma, 'paciente@e2e.test'));
    await prisma.user.updateMany({
      where: { id: { in: [adminId, otherAdminId] } },
      data: { role: 'ADMIN' },
    });
    ({ access_token: token } = await login(app, 'admin@e2e.test'));
  });

  afterAll(async () => {
    await closeApp(app, prisma);
  });

  it('ADMIN excluindo a si mesmo → 403 SELF_DELETE_FORBIDDEN', async () => {
    const res = await api(app)
      .delete(`/users/${adminId}`)
      .set(auth())
      .expect(403);

    expect(res.body.code).toBe('SELF_DELETE_FORBIDDEN');
    expect(res.body.message).toMatch(/própria conta/);
    expect(await prisma.user.count({ where: { id: adminId } })).toBe(1);
  });

  it('excluir a última conta ADMIN ativa → 409 LAST_ADMIN', async () => {
    // Quem chama ficou suspenso com o token ainda válido: o outro ADMIN é o último ativo.
    await prisma.user.update({
      where: { id: adminId },
      data: { status: 'INACTIVE' },
    });
    try {
      const res = await api(app)
        .delete(`/users/${otherAdminId}`)
        .set(auth())
        .expect(409);

      expect(res.body.code).toBe('LAST_ADMIN');
      expect(await prisma.user.count({ where: { id: otherAdminId } })).toBe(1);
    } finally {
      await prisma.user.update({
        where: { id: adminId },
        data: { status: 'ACTIVE' },
      });
    }
  });

  it('excluir PATIENT continua respondendo 200', async () => {
    await api(app).delete(`/users/${patientId}`).set(auth()).expect(200);

    expect(await prisma.user.count({ where: { id: patientId } })).toBe(0);
  });

  it('excluir outro ADMIN é permitido enquanto restar um ADMIN ativo', async () => {
    await api(app).delete(`/users/${otherAdminId}`).set(auth()).expect(200);

    expect(await prisma.user.count({ where: { id: otherAdminId } })).toBe(0);
  });
});

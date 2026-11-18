import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import { pseudonymize } from '../src/shared/utils/pseudonym.util';
import {
  api,
  closeApp,
  createApp,
  createUser,
  grantConsent,
  login,
  PASSWORD,
  resetDatabase,
} from './helpers';

// Aceite 13 do release-final: excluir a conta apaga todos os dados ligados ao titular e o
// registro de exclusão não guarda e-mail nem nome.
describe('Exclusão de conta (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let token: string;
  let userId: string;

  const EMAIL = 'exclusao@e2e.test';
  const auth = () => ({ Authorization: `Bearer ${token}` });

  beforeAll(async () => {
    ({ app, prisma } = await createApp());
    await resetDatabase(prisma);
    ({ id: userId } = await createUser(prisma, EMAIL));
    ({ access_token: token } = await login(app, EMAIL));

    await grantConsent(app, token, 'HEALTH_DATA');
    await grantConsent(app, token, 'AI_MASCOT');
    await api(app)
      .post('/daily-logs')
      .set(auth())
      .send({ title: 'Dia', content: 'Registro do dia' })
      .expect(201);
    await api(app)
      .post('/personal/treatments')
      .set(auth())
      .send({
        name: 'Quimioterapia',
        frequency: 'Semanal',
        startTime: '08:00',
        endDate: '2027-06-30T00:00:00.000Z',
      })
      .expect(201);
    // Conversa do mascote gravada direto: o endpoint chamaria a Groq.
    await prisma.patientSupportLog.create({
      data: {
        userId: pseudonymize(userId),
        prompt: 'Oi',
        response: 'Olá',
        context: {},
      },
    });
  });

  afterAll(async () => {
    await closeApp(app, prisma);
  });

  async function countUserRows() {
    const ref = pseudonymize(userId);
    return {
      user: await prisma.user.count({ where: { id: userId } }),
      dailyLogs: await prisma.dailyLog.count({ where: { userId } }),
      treatments: await prisma.treatment.count({ where: { userId } }),
      consents: await prisma.consentRecord.count({ where: { userId } }),
      refreshTokens: await prisma.refreshToken.count({ where: { userId } }),
      mascotLogs: await prisma.patientSupportLog.count({
        where: { userId: { in: [userId, ref] } },
      }),
      auditWithRawId: await prisma.dailyLogAudit.count({ where: { userId } }),
    };
  }

  it('o cenário tem dados em todas as tabelas antes da exclusão', async () => {
    const rows = await countUserRows();
    expect(rows).toMatchObject({
      user: 1,
      dailyLogs: 1,
      treatments: 1,
      mascotLogs: 1,
    });
    expect(rows.consents).toBeGreaterThan(0);
    expect(rows.refreshTokens).toBeGreaterThan(0);
  });

  it('senha errada responde 403 INVALID_PASSWORD e não apaga nada', async () => {
    const res = await api(app)
      .delete('/users/me')
      .set(auth())
      .send({ password: 'senha-errada' })
      .expect(403);
    expect(res.body).toMatchObject({ code: 'INVALID_PASSWORD' });
    expect((await countUserRows()).user).toBe(1);
  });

  it('com a senha correta responde 200 e não sobra linha ligada ao userId', async () => {
    await api(app)
      .delete('/users/me')
      .set(auth())
      .send({ password: PASSWORD })
      .expect(200);

    expect(await countUserRows()).toEqual({
      user: 0,
      dailyLogs: 0,
      treatments: 0,
      consents: 0,
      refreshTokens: 0,
      mascotLogs: 0,
      auditWithRawId: 0,
    });
  });

  it('o registro de exclusão é pseudonimizado, sem e-mail nem nome', async () => {
    const logs = await prisma.userDeletionLog.findMany();
    expect(logs).toHaveLength(1);
    expect(logs[0].userRef).toBe(pseudonymize(userId));
    expect(logs[0]).not.toHaveProperty('email');
    expect(logs[0]).not.toHaveProperty('name');
    const raw = JSON.stringify(logs[0]);
    expect(raw).not.toContain(EMAIL);
    expect(raw).not.toContain(userId);
  });
});

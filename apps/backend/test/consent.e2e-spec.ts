import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import {
  api,
  closeApp,
  createApp,
  createUser,
  grantConsent,
  login,
  resetDatabase,
} from './helpers';

// Aceites 4, 5 e 6 do release-final: consentimento negado por padrão, bloqueio por finalidade
// e revogação que bloqueia na requisição seguinte preservando o histórico.
describe('Consentimento LGPD (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let token: string;

  const auth = () => ({ Authorization: `Bearer ${token}` });
  const dailyLog = {
    title: 'Dia',
    content: 'Registro do dia',
    emotes: ['feliz'],
  };

  beforeAll(async () => {
    ({ app, prisma } = await createApp());
    await resetDatabase(prisma);
    await createUser(prisma, 'consent@e2e.test');
    ({ access_token: token } = await login(app, 'consent@e2e.test'));
  });

  afterAll(async () => {
    await closeApp(app, prisma);
  });

  it('conta nova começa com as 3 finalidades negadas', async () => {
    const res = await api(app).get('/consents').set(auth()).expect(200);
    const state = res.body as { purpose: string; granted: boolean }[];
    expect(state.map((c) => c.purpose).sort()).toEqual([
      'AI_MASCOT',
      'HEALTH_DATA',
      'NOTIFICATIONS',
    ]);
    expect(state.every((c) => c.granted === false)).toBe(true);
  });

  it.each([
    ['GET', '/daily-logs'],
    ['POST', '/daily-logs'],
    ['GET', '/personal/treatments'],
    ['POST', '/personal/treatments'],
  ])(
    'sem HEALTH_DATA, %s %s responde 403 CONSENT_REQUIRED',
    async (method, path) => {
      const req =
        method === 'GET' ? api(app).get(path) : api(app).post(path).send({});
      const res = await req.set(auth()).expect(403);
      expect(res.body).toMatchObject({
        code: 'CONSENT_REQUIRED',
        purpose: 'HEALTH_DATA',
      });
    },
  );

  it('sem AI_MASCOT, POST /ai-support/ask responde 403 CONSENT_REQUIRED', async () => {
    const res = await api(app)
      .post('/ai-support/ask')
      .set(auth())
      .send({ userQuestion: 'Oi' })
      .expect(403);
    expect(res.body).toMatchObject({
      code: 'CONSENT_REQUIRED',
      purpose: 'AI_MASCOT',
    });
  });

  it('com HEALTH_DATA concedido, o diário responde 2xx', async () => {
    await grantConsent(app, token, 'HEALTH_DATA');
    await api(app).post('/daily-logs').set(auth()).send(dailyLog).expect(201);
    await api(app).get('/daily-logs').set(auth()).expect(200);
  });

  it('revogar bloqueia a requisição seguinte e preserva histórico e dados', async () => {
    await api(app)
      .put('/consents/HEALTH_DATA')
      .set(auth())
      .send({ granted: false })
      .expect(200);

    const res = await api(app).get('/daily-logs').set(auth()).expect(403);
    expect(res.body).toMatchObject({
      code: 'CONSENT_REQUIRED',
      purpose: 'HEALTH_DATA',
    });

    const history = await prisma.consentRecord.findMany({
      where: { purpose: 'HEALTH_DATA' },
      orderBy: { createdAt: 'asc' },
    });
    expect(history.map((r) => r.granted)).toEqual([true, false]);
    // Q1: revogar só bloqueia; os dados ficam guardados até a exclusão da conta.
    expect(await prisma.dailyLog.count()).toBe(1);
  });
});

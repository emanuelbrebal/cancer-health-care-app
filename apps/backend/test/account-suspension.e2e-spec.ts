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
  PASSWORD,
  resetDatabase,
} from './helpers';

// Aceite 14 do release-final: conta suspensa não entra, perde as sessões e mantém os dados;
// reativar com credenciais válidas devolve o acesso com tudo intacto.
// Usa 3 chamadas a /auth/login (limite de 5 por minuto por instância).
describe('Suspensão de conta (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let token: string;
  let refreshToken: string;
  let userId: string;

  const EMAIL = 'suspensao@e2e.test';

  beforeAll(async () => {
    ({ app, prisma } = await createApp());
    await resetDatabase(prisma);
    ({ id: userId } = await createUser(prisma, EMAIL));
    ({ access_token: token, refresh_token: refreshToken } = await login(
      app,
      EMAIL,
    ));

    await grantConsent(app, token, 'HEALTH_DATA');
    await api(app)
      .post('/daily-logs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Antes da suspensão', content: 'Registro preservado' })
      .expect(201);
  });

  afterAll(async () => {
    await closeApp(app, prisma);
  });

  it('suspender responde 200 e revoga todos os refresh tokens', async () => {
    await api(app)
      .post('/users/me/suspend')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    expect(user.status).toBe('INACTIVE');
    expect(user.suspendedAt).not.toBeNull();
    expect(
      await prisma.refreshToken.count({ where: { userId, revokedAt: null } }),
    ).toBe(0);

    await api(app)
      .post('/auth/refresh')
      .send({ refresh_token: refreshToken })
      .expect(401);
  });

  it('login sem reativar responde 403 ACCOUNT_SUSPENDED', async () => {
    const res = await api(app)
      .post('/auth/login')
      .send({ email: EMAIL, password: PASSWORD })
      .expect(403);
    expect(res.body).toMatchObject({ code: 'ACCOUNT_SUSPENDED' });
  });

  it('os dados continuam no banco durante a suspensão', async () => {
    expect(await prisma.dailyLog.count({ where: { userId } })).toBe(1);
    expect(
      await prisma.consentRecord.count({ where: { userId } }),
    ).toBeGreaterThan(0);
  });

  it('login com reactivate devolve o acesso e os dados intactos', async () => {
    const res = await api(app)
      .post('/auth/login')
      .send({ email: EMAIL, password: PASSWORD, reactivate: true })
      .expect(200);
    const body = res.body as {
      access_token: string;
      user: Record<string, unknown>;
    };
    expect(body.user).not.toHaveProperty('password');

    const logs = await api(app)
      .get('/daily-logs')
      .set('Authorization', `Bearer ${body.access_token}`)
      .expect(200);
    expect(JSON.stringify(logs.body)).toContain('Antes da suspensão');

    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    expect(user.status).toBe('ACTIVE');
    expect(user.suspendedAt).toBeNull();
  });
});

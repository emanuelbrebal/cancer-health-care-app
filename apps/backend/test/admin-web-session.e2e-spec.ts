import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import {
  api,
  closeApp,
  createApp,
  createUser,
  PASSWORD,
  resetDatabase,
} from './helpers';

// Sessão do painel web (PRD 01, plano tasks/gerenciador-web.md): refresh em cookie HttpOnly
// em /auth/web/*, só ADMIN, e as rotas do app móvel (/auth/*) com o contrato de sempre.
// Usa 4 chamadas a /auth/web/login (limite 5/min) e 1 a /auth/login (limite 5/min).
describe('Sessão web do admin (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  const ADMIN = 'admin@e2e.test';
  const PATIENT = 'paciente@e2e.test';
  const HEADER = { 'X-Requested-With': 'oncomente-admin' };

  function refreshCookie(setCookie: string[] | string | undefined) {
    const list = Array.isArray(setCookie)
      ? setCookie
      : setCookie
        ? [setCookie]
        : [];
    return list.find((c) => c.startsWith('oncomente_admin_rt='));
  }

  function cookiePair(cookie: string) {
    return cookie.split(';')[0];
  }

  function webLogin(email: string) {
    return api(app)
      .post('/auth/web/login')
      .set(HEADER)
      .send({ email, password: PASSWORD });
  }

  beforeAll(async () => {
    ({ app, prisma } = await createApp());
    await resetDatabase(prisma);
    const admin = await createUser(prisma, ADMIN);
    await prisma.user.update({
      where: { id: admin.id },
      data: { role: 'ADMIN' },
    });
    await createUser(prisma, PATIENT);
  });

  afterAll(async () => {
    await closeApp(app, prisma);
  });

  it('login ADMIN grava o refresh em cookie HttpOnly e não devolve no corpo', async () => {
    const res = await webLogin(ADMIN).expect(200);

    expect(res.body.access_token).toEqual(expect.any(String));
    expect(res.body.user).toMatchObject({ email: ADMIN, role: 'ADMIN' });
    expect(res.body).not.toHaveProperty('refresh_token');

    const cookie = refreshCookie(res.headers['set-cookie']);
    expect(cookie).toBeDefined();
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/Secure/i);
    expect(cookie).toMatch(/SameSite=Strict/i);
    expect(cookie).toMatch(/Path=\/auth\/web/i);
    expect(cookie).toMatch(/Max-Age=604800/i);
  });

  it('sem o header do painel responde 403', () =>
    api(app)
      .post('/auth/web/login')
      .send({ email: ADMIN, password: PASSWORD })
      .expect(403));

  it('PATIENT com senha correta é recusado e a sessão emitida é revogada', async () => {
    const res = await webLogin(PATIENT).expect(403);
    expect(res.body).toMatchObject({ code: 'ADMIN_ONLY' });
    expect(refreshCookie(res.headers['set-cookie'])).toBeUndefined();

    const patient = await prisma.user.findUniqueOrThrow({
      where: { email: PATIENT },
    });
    expect(
      await prisma.refreshToken.count({
        where: { userId: patient.id, revokedAt: null },
      }),
    ).toBe(0);
  });

  it('refresh pelo cookie rotaciona e devolve access_token e user', async () => {
    const login = await webLogin(ADMIN).expect(200);
    const first = cookiePair(refreshCookie(login.headers['set-cookie'])!);

    const res = await api(app)
      .post('/auth/web/refresh')
      .set(HEADER)
      .set('Cookie', first)
      .expect(200);
    expect(res.body.access_token).toEqual(expect.any(String));
    expect(res.body.user).toMatchObject({ email: ADMIN });
    expect(res.body).not.toHaveProperty('refresh_token');

    const second = cookiePair(refreshCookie(res.headers['set-cookie'])!);
    expect(second).not.toBe(first);

    // Reusar o cookie já trocado derruba a família inteira (detecção de cópia).
    await api(app)
      .post('/auth/web/refresh')
      .set(HEADER)
      .set('Cookie', first)
      .expect(401);
    await api(app)
      .post('/auth/web/refresh')
      .set(HEADER)
      .set('Cookie', second)
      .expect(401);
  });

  it('refresh sem cookie responde 401', () =>
    api(app).post('/auth/web/refresh').set(HEADER).expect(401));

  it('após sair, o refresh antigo devolve 401', async () => {
    const login = await webLogin(ADMIN).expect(200);
    const cookie = cookiePair(refreshCookie(login.headers['set-cookie'])!);

    const out = await api(app)
      .post('/auth/web/logout')
      .set(HEADER)
      .set('Cookie', cookie)
      .expect(200);
    expect(refreshCookie(out.headers['set-cookie'])).toMatch(
      /oncomente_admin_rt=;/,
    );

    await api(app)
      .post('/auth/web/refresh')
      .set(HEADER)
      .set('Cookie', cookie)
      .expect(401);
  });

  it('rotas do app móvel seguem com refresh_token no corpo e sem cookie', async () => {
    const login = await api(app)
      .post('/auth/login')
      .send({ email: PATIENT, password: PASSWORD })
      .expect(200);
    expect(login.body).toMatchObject({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
      user: expect.objectContaining({ email: PATIENT }),
    });
    expect(refreshCookie(login.headers['set-cookie'])).toBeUndefined();

    const refreshed = await api(app)
      .post('/auth/refresh')
      .send({ refresh_token: login.body.refresh_token })
      .expect(200);
    expect(Object.keys(refreshed.body).sort()).toEqual([
      'access_token',
      'refresh_token',
    ]);

    await api(app)
      .post('/auth/logout')
      .send({ refresh_token: refreshed.body.refresh_token })
      .expect(200);
    await api(app)
      .post('/auth/refresh')
      .send({ refresh_token: refreshed.body.refresh_token })
      .expect(401);
  });
});

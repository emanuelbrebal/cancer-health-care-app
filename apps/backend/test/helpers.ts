import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/bootstrap/configure-app';
import { PrismaService } from '../src/prisma/prisma.service';

export const PASSWORD = 'senha-e2e-123';

// Uma instância por suíte: o throttler é em memória, então os limites zeram a cada suíte.
export async function createApp() {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleRef.createNestApplication<INestApplication<App>>();
  configureApp(app, false);
  await app.init();
  return { app, prisma: app.get(PrismaService) };
}

// O PrismaService não desconecta no shutdown; sem isso o pool do pg segura o Jest aberto.
export async function closeApp(
  app: INestApplication<App>,
  prisma: PrismaService,
) {
  await app.close();
  await prisma.$disconnect();
}

// Limpa todas as tabelas (menos o controle de migrations) entre suítes.
export async function resetDatabase(prisma: PrismaService) {
  const tables = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename::text AS tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'`;
  if (!tables.length) return;
  const list = tables.map((t) => `"public"."${t.tablename}"`).join(', ');
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${list} CASCADE`);
}

// Usuário criado direto no banco: o /auth/register tem limite de 3 por minuto.
export async function createUser(prisma: PrismaService, email: string) {
  return prisma.user.create({
    data: {
      email,
      name: 'Pessoa E2E',
      phone_number: '11999990000',
      password: await bcrypt.hash(PASSWORD, 4),
    },
  });
}

export function api(app: INestApplication<App>) {
  return request(app.getHttpServer());
}

export async function login(app: INestApplication<App>, email: string) {
  const res = await api(app)
    .post('/auth/login')
    .send({ email, password: PASSWORD })
    .expect(200);
  return res.body as { access_token: string; refresh_token: string };
}

export async function grantConsent(
  app: INestApplication<App>,
  token: string,
  purpose: 'HEALTH_DATA' | 'AI_MASCOT' | 'NOTIFICATIONS',
) {
  await api(app)
    .put(`/consents/${purpose}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ granted: true })
    .expect(200);
}

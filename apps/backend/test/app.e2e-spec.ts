import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import { api, closeApp, createApp, resetDatabase } from './helpers';

// Fumaça da infraestrutura: app sobe com a configuração de produção e fala com o banco de teste.
describe('Infraestrutura e2e', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    ({ app, prisma } = await createApp());
    await resetDatabase(prisma);
  });

  afterAll(async () => {
    await closeApp(app, prisma);
  });

  it('GET / responde', () => api(app).get('/').expect(200));

  it('banco de teste está migrado e vazio', async () => {
    expect(await prisma.user.count()).toBe(0);
  });

  it('ValidationPipe global está ativo', () =>
    api(app).post('/auth/login').send({}).expect(400));
});

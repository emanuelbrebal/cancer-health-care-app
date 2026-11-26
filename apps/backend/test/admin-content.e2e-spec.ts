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

// Conteúdo pelo painel (tasks/backend-admin-fixes.md): nome/título repetido vira 409 com a
// mensagem do PRD (W02-7, W03-4), POST /movies fala de filme e o PATCH de séries devolve o
// item mapeado, como livros e filmes.
describe('Conteúdo do painel admin (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let token: string;
  // Gênero precisa ser do mesmo tipo da mídia (tasks/admin-catalogo.md).
  const genre = { BOOK: '', MOVIE: '', SERIES: '' };

  const auth = () => ({ Authorization: `Bearer ${token}` });

  const leisure = (name: string) => ({
    name,
    type: 'PHYSICAL',
    frequency: 'WEEKLY',
    image_path: '',
  });
  const media = (title: string, type: keyof typeof genre) => ({
    title,
    genreId: genre[type],
    isFree: true,
  });
  const book = (title: string) => ({
    ...media(title, 'BOOK'),
    author: 'Autora E2E',
  });
  const movie = (title: string) => ({
    ...media(title, 'MOVIE'),
    director: 'Direção E2E',
    duration: '1h30',
  });
  const series = (title: string) => ({ ...media(title, 'SERIES'), seasons: 2 });

  beforeAll(async () => {
    ({ app, prisma } = await createApp());
    await resetDatabase(prisma);
    const admin = await createUser(prisma, 'admin@e2e.test');
    await prisma.user.update({
      where: { id: admin.id },
      data: { role: 'ADMIN' },
    });
    ({ access_token: token } = await login(app, 'admin@e2e.test'));
    for (const type of ['BOOK', 'MOVIE', 'SERIES'] as const) {
      ({ id: genre[type] } = await prisma.genre.create({
        data: { name: 'Gênero E2E', type },
      }));
    }
  });

  afterAll(async () => {
    await closeApp(app, prisma);
  });

  describe('lazer', () => {
    let secondId: string;

    beforeAll(async () => {
      await api(app)
        .post('/leisures')
        .set(auth())
        .send(leisure('Caminhada'))
        .expect(201);
      const res = await api(app)
        .post('/leisures')
        .set(auth())
        .send(leisure('Yoga'))
        .expect(201);
      secondId = res.body.data.id;
    });

    it('criar com nome repetido → 409 com a mensagem do PRD', async () => {
      const res = await api(app)
        .post('/leisures')
        .set(auth())
        .send(leisure('Caminhada'))
        .expect(409);

      expect(res.body.message).toBe('Já existe uma atividade com este nome.');
      expect(res.body.code).toBe('DUPLICATE');
    });

    it('editar para um nome existente → 409', async () => {
      const res = await api(app)
        .patch(`/leisures/${secondId}`)
        .set(auth())
        .send({ name: 'Caminhada' })
        .expect(409);

      expect(res.body.message).toBe('Já existe uma atividade com este nome.');
    });
  });

  describe('livros', () => {
    let secondId: string;

    beforeAll(async () => {
      await api(app)
        .post('/books')
        .set(auth())
        .send(book('Livro A'))
        .expect(201);
      const res = await api(app)
        .post('/books')
        .set(auth())
        .send(book('Livro B'))
        .expect(201);
      secondId = res.body.data.id;
    });

    it('criar com título repetido → 409 com a mensagem do PRD', async () => {
      const res = await api(app)
        .post('/books')
        .set(auth())
        .send(book('Livro A'))
        .expect(409);

      expect(res.body.message).toBe(
        'Já existe um livro com este título e autor.',
      );
      expect(res.body.code).toBe('DUPLICATE');
    });

    it('editar para um título existente → 409', async () => {
      const res = await api(app)
        .patch(`/books/${secondId}`)
        .set(auth())
        .send({ title: 'Livro A' })
        .expect(409);

      expect(res.body.message).toBe(
        'Já existe um livro com este título e autor.',
      );
    });

    it('o mesmo título em outro tipo de mídia é aceito', async () => {
      await api(app)
        .post('/movies')
        .set(auth())
        .send(movie('Livro A'))
        .expect(201);
    });
  });

  describe('filmes', () => {
    it('POST responde com mensagem de filme', async () => {
      const res = await api(app)
        .post('/movies')
        .set(auth())
        .send(movie('Filme A'))
        .expect(201);

      expect(res.body.message).toBe('Filme criado com sucesso!');
      expect(res.body.data.title).toBe('Filme A');
    });

    it('criar com título repetido → 409', async () => {
      const res = await api(app)
        .post('/movies')
        .set(auth())
        .send(movie('Filme A'))
        .expect(409);

      expect(res.body.message).toBe(
        'Já existe um filme com este título e ano.',
      );
    });
  });

  describe('séries', () => {
    let seriesId: string;

    beforeAll(async () => {
      const res = await api(app)
        .post('/series')
        .set(auth())
        .send(series('Série A'))
        .expect(201);
      expect(res.body.message).toBe('Série criada com sucesso!');
      seriesId = res.body.data.id;
      await api(app)
        .post('/series')
        .set(auth())
        .send(series('Série B'))
        .expect(201);
    });

    it('PATCH devolve o item mapeado, no mesmo formato de livros e filmes', async () => {
      const res = await api(app)
        .patch(`/series/${seriesId}`)
        .set(auth())
        .send({ seasons: 3 })
        .expect(200);

      expect(res.body).not.toHaveProperty('message');
      expect(res.body).not.toHaveProperty('data');
      expect(res.body).toMatchObject({
        id: seriesId,
        title: 'Série A',
        type: 'SERIES',
        seasons: 3,
        imagePath: '',
        genre: 'Gênero E2E',
      });
      expect(res.body).not.toHaveProperty('image_path');
      expect(res.body).not.toHaveProperty('seriesDetails');
    });

    it('editar para um título existente → 409', async () => {
      const res = await api(app)
        .patch(`/series/${seriesId}`)
        .set(auth())
        .send({ title: 'Série B' })
        .expect(409);

      expect(res.body.message).toBe(
        'Já existe uma série com este título e ano.',
      );
    });
  });
});

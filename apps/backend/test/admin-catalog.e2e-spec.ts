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

// Catálogo do painel (tasks/admin-catalogo.md): gêneros por tipo, regras de mídia (gênero do mesmo
// tipo, unicidade título+autor / título+ano), listagem admin com inativos, reativar e acesso.
describe('Catálogo do painel admin (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let admin: string;
  let patient: string;

  const as = (token: string) => ({ Authorization: `Bearer ${token}` });

  beforeAll(async () => {
    ({ app, prisma } = await createApp());
    await resetDatabase(prisma);
    const a = await createUser(prisma, 'admin@catalog.test');
    await prisma.user.update({ where: { id: a.id }, data: { role: 'ADMIN' } });
    await createUser(prisma, 'patient@catalog.test');
    ({ access_token: admin } = await login(app, 'admin@catalog.test'));
    ({ access_token: patient } = await login(app, 'patient@catalog.test'));
  });

  afterAll(async () => {
    await closeApp(app, prisma);
  });

  const createGenre = async (name: string, type: string) =>
    (
      await api(app)
        .post('/genres')
        .set(as(admin))
        .send({ name, type })
        .expect(201)
    ).body as { id: string; name: string; type: string; status: string };

  describe('gêneros', () => {
    let drama: string;

    beforeAll(async () => {
      ({ id: drama } = await createGenre('Drama', 'MOVIE'));
    });

    it('o mesmo nome em outro tipo é aceito; no mesmo tipo → 409', async () => {
      await createGenre('Drama', 'SERIES');
      const res = await api(app)
        .post('/genres')
        .set(as(admin))
        .send({ name: 'Drama', type: 'MOVIE' })
        .expect(409);
      expect(res.body).toMatchObject({
        code: 'DUPLICATE',
        message: 'Já existe um gênero com este nome para este tipo.',
      });
    });

    it('renomear', async () => {
      const g = await createGenre('Comedia', 'MOVIE');
      const res = await api(app)
        .patch(`/genres/${g.id}`)
        .set(as(admin))
        .send({ name: '  Comédia  ' })
        .expect(200);
      expect(res.body.name).toBe('Comédia');
    });

    it('inativar com item ativo → 409 GENRE_IN_USE; sem itens → ok e some do público', async () => {
      await api(app)
        .post('/movies')
        .set(as(admin))
        .send({
          title: 'Filme no Drama',
          genreId: drama,
          isFree: false,
          director: 'D',
          duration: '1h',
        })
        .expect(201);

      const blocked = await api(app)
        .delete(`/genres/${drama}`)
        .set(as(admin))
        .expect(409);
      expect(blocked.body.code).toBe('GENRE_IN_USE');
      expect(blocked.body.message).toContain('1 item ativo');

      const empty = await createGenre('Vazio', 'MOVIE');
      await api(app).delete(`/genres/${empty.id}`).set(as(admin)).expect(200);

      const pub = await api(app).get('/genres?type=MOVIE').expect(200);
      const names = (pub.body as { name: string }[]).map((g) => g.name);
      expect(names).toContain('Drama');
      expect(names).not.toContain('Vazio');
      expect(pub.body[0]).not.toHaveProperty('status');

      const adminList = await api(app)
        .get('/admin/genres?type=MOVIE')
        .set(as(admin))
        .expect(200);
      const vazio = (
        adminList.body as {
          name: string;
          status: string;
          activeItems: number;
        }[]
      ).find((g) => g.name === 'Vazio');
      expect(vazio).toMatchObject({ status: 'INACTIVE', activeItems: 0 });
      const dramaRow = (
        adminList.body as { id: string; activeItems: number }[]
      ).find((g) => g.id === drama);
      expect(dramaRow?.activeItems).toBe(1);

      const back = await api(app)
        .patch(`/admin/genres/${empty.id}/reactivate`)
        .set(as(admin))
        .expect(200);
      expect(back.body.status).toBe('ACTIVE');
    });

    it('escrita e leitura admin: 401 sem token, 403 para paciente', async () => {
      await api(app)
        .post('/genres')
        .send({ name: 'X', type: 'BOOK' })
        .expect(401);
      await api(app)
        .post('/genres')
        .set(as(patient))
        .send({ name: 'X', type: 'BOOK' })
        .expect(403);
      await api(app).get('/admin/genres').set(as(patient)).expect(403);
    });
  });

  describe('regras de mídia', () => {
    let bookGenre: string;
    let movieGenre: string;

    beforeAll(async () => {
      ({ id: bookGenre } = await createGenre('Autoajuda', 'BOOK'));
      ({ id: movieGenre } = await createGenre('Biografia', 'MOVIE'));
    });

    const book = (title: string, author: string) => ({
      title,
      author,
      genreId: bookGenre,
      isFree: true,
    });

    it('gênero de outro tipo ou inativo → 400 INVALID_GENRE', async () => {
      const res = await api(app)
        .post('/books')
        .set(as(admin))
        .send({ ...book('Livro X', 'Ana'), genreId: movieGenre })
        .expect(400);
      expect(res.body).toMatchObject({
        code: 'INVALID_GENRE',
        message: 'Escolha um gênero ativo de livro.',
      });

      const off = await createGenre('Desligado', 'BOOK');
      await api(app).delete(`/genres/${off.id}`).set(as(admin)).expect(200);
      await api(app)
        .post('/books')
        .set(as(admin))
        .send({ ...book('Livro Y', 'Ana'), genreId: off.id })
        .expect(400);
    });

    it('livro: mesmo título com outro autor é aceito; título+autor repetido → 409', async () => {
      await api(app)
        .post('/books')
        .set(as(admin))
        .send(book('Esperança', 'Ana'))
        .expect(201);
      await api(app)
        .post('/books')
        .set(as(admin))
        .send(book('Esperança', 'Bruno'))
        .expect(201);

      const res = await api(app)
        .post('/books')
        .set(as(admin))
        .send(book(' esperança ', 'ANA'))
        .expect(409);
      expect(res.body).toMatchObject({
        code: 'DUPLICATE',
        message: 'Já existe um livro com este título e autor.',
      });
    });

    it('filme: mesmo título com outro ano é aceito; título+ano repetido → 409', async () => {
      const movie = (releaseYear?: number) => ({
        title: 'Remake',
        genreId: movieGenre,
        isFree: false,
        director: 'D',
        duration: '2h',
        ...(releaseYear && { releaseYear }),
      });
      await api(app)
        .post('/movies')
        .set(as(admin))
        .send(movie(1990))
        .expect(201);
      await api(app)
        .post('/movies')
        .set(as(admin))
        .send(movie(2020))
        .expect(201);
      await api(app).post('/movies').set(as(admin)).send(movie()).expect(201);

      const res = await api(app)
        .post('/movies')
        .set(as(admin))
        .send(movie(2020))
        .expect(409);
      expect(res.body.message).toBe(
        'Já existe um filme com este título e ano.',
      );
      await api(app).post('/movies').set(as(admin)).send(movie()).expect(409);
    });

    it('sinopse é aceita e aparece na rota pública', async () => {
      const res = await api(app)
        .post('/books')
        .set(as(admin))
        .send({ ...book('Com Sinopse', 'Carla'), synopsis: 'Uma história.' })
        .expect(201);
      expect(res.body.data.synopsis).toBe('Uma história.');

      const leisure = await api(app)
        .post('/leisures')
        .set(as(admin))
        .send({
          name: 'Leitura',
          type: 'CULTURAL',
          frequency: 'WEEKLY',
          synopsis: 'Ler junto.',
        })
        .expect(201);
      expect(leisure.body.data.synopsis).toBe('Ler junto.');
    });
  });

  describe('listagem admin, inativos e reativar', () => {
    let genreId: string;
    const ids: string[] = [];

    beforeAll(async () => {
      ({ id: genreId } = await createGenre('Romance', 'SERIES'));
      for (let i = 1; i <= 25; i++) {
        const res = await api(app)
          .post('/series')
          .set(as(admin))
          .send({
            title: `Série ${String(i).padStart(2, '0')}`,
            genreId,
            isFree: i % 2 === 0,
          })
          .expect(201);
        ids.push(res.body.data.id);
      }
      await api(app).delete(`/series/${ids[0]}`).set(as(admin)).expect(200);
    });

    it('pagina no servidor e inclui inativos', async () => {
      const p1 = await api(app)
        .get('/admin/series?limit=10')
        .set(as(admin))
        .expect(200);
      expect(p1.body).toMatchObject({ total: 25, page: 1, limit: 10 });
      expect(p1.body.items).toHaveLength(10);

      const p3 = await api(app)
        .get('/admin/series?limit=10&page=3')
        .set(as(admin))
        .expect(200);
      expect(p3.body.items).toHaveLength(5);

      const item = p1.body.items[0];
      expect(item).toHaveProperty('genreId', genreId);
      expect(item).toHaveProperty('updatedAt');
      expect(item).toHaveProperty('createdAt');
      expect(item).toHaveProperty('status');
    });

    it('filtra por status, busca, gênero e gratuito', async () => {
      const inactive = await api(app)
        .get('/admin/series?status=INACTIVE')
        .set(as(admin))
        .expect(200);
      expect(inactive.body.total).toBe(1);
      expect(inactive.body.items[0].id).toBe(ids[0]);

      const search = await api(app)
        .get('/admin/series?search=série 1')
        .set(as(admin))
        .expect(200);
      expect(search.body.total).toBe(10); // 10..19

      const free = await api(app)
        .get(`/admin/series?isFree=true&genreId=${genreId}`)
        .set(as(admin))
        .expect(200);
      expect(free.body.total).toBe(12);

      await api(app).get('/admin/series?limit=500').set(as(admin)).expect(400);
      await api(app)
        .get('/admin/series?isFree=talvez')
        .set(as(admin))
        .expect(400);
    });

    it('rota pública segue só com ativos e sem campos do painel', async () => {
      const pub = await api(app).get('/series').expect(200);
      expect(pub.body).toHaveLength(24);
      expect(pub.body[0]).not.toHaveProperty('genreId');
      expect(pub.body[0]).not.toHaveProperty('updatedAt');
      await api(app).get(`/series/${ids[0]}`).expect(404);
    });

    it('detalhe admin encontra inativo; edição vale para inativo; reativar volta ao público', async () => {
      await api(app).get(`/admin/series/${ids[0]}`).set(as(admin)).expect(200);
      await api(app)
        .patch(`/series/${ids[0]}`)
        .set(as(admin))
        .send({ seasons: 4 })
        .expect(200);

      const res = await api(app)
        .patch(`/admin/series/${ids[0]}/reactivate`)
        .set(as(admin))
        .expect(200);
      expect(res.body).toMatchObject({ status: 'ACTIVE', seasons: 4 });
      await api(app).get(`/series/${ids[0]}`).expect(200);

      await api(app).get(`/admin/books/${ids[1]}`).set(as(admin)).expect(404);
    });

    it('lazer: listagem admin com filtros, inativo e reativar', async () => {
      const a = await api(app)
        .post('/leisures')
        .set(as(admin))
        .send({ name: 'Natação', type: 'PHYSICAL', frequency: 'WEEKLY' })
        .expect(201);
      await api(app)
        .delete(`/leisures/${a.body.data.id}`)
        .set(as(admin))
        .expect(200);

      const list = await api(app)
        .get('/admin/leisures?status=INACTIVE&type=PHYSICAL')
        .set(as(admin))
        .expect(200);
      expect(list.body.total).toBe(1);
      expect(list.body.items[0]).toMatchObject({
        name: 'Natação',
        status: 'INACTIVE',
      });
      expect(list.body.items[0]).toHaveProperty('updatedAt');

      await api(app)
        .patch(`/leisures/${a.body.data.id}`)
        .set(as(admin))
        .send({ frequency: 'DAILY' })
        .expect(200);
      await api(app)
        .patch(`/admin/leisures/${a.body.data.id}/reactivate`)
        .set(as(admin))
        .expect(200);
      const pub = await api(app).get('/leisures').expect(200);
      expect((pub.body as { name: string }[]).map((l) => l.name)).toContain(
        'Natação',
      );
    });

    it('rotas admin: 401 sem token e 403 para paciente', async () => {
      await api(app).get('/admin/books').expect(401);
      await api(app).get('/admin/leisures').set(as(patient)).expect(403);
      await api(app)
        .patch(`/admin/series/${ids[1]}/reactivate`)
        .set(as(patient))
        .expect(403);
    });
  });
});

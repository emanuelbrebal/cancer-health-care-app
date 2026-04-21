import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, StatusEnum, MediaType, LeisureType, FrequencyType, UserRole, PronounEnum } from '@prisma/client';
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seeding do OncoMente...');

  // ─── 1. USUÁRIOS DE TESTE ─────────────────────────────────────────────────
  const SENHA_TESTE = 'onco123';
  const hash = await bcrypt.hash(SENHA_TESTE, 10);

  const testUsers = [
    { email: 'paciente@oncomente.com', role: UserRole.PATIENT,   name: 'Ana Paciente',   pronoun: PronounEnum.SRA },
    { email: 'cuidador@oncomente.com', role: UserRole.CAREGIVER, name: 'Carlos Cuidador', pronoun: PronounEnum.SR },
    { email: 'admin@oncomente.com',    role: UserRole.ADMIN,      name: 'Admin OncoMente', pronoun: PronounEnum.NOT_INFORMED },
  ];

  console.log('Populando usuários de teste (senha: onco123)...');
  for (const u of testUsers) {
    await prisma.user.upsert({
      where:  { email: u.email },
      update: { name: u.name },
      create: { email: u.email, password: hash, role: u.role, name: u.name, pronoun: u.pronoun },
    });
  }

  // ─── 2. GÊNEROS ───────────────────────────────────────────────────────────
  const genres = [
    // BOOK
    { name: 'Saúde e Bem-estar',  type: 'BOOK'   as MediaType },
    { name: 'Autoajuda',          type: 'BOOK'   as MediaType },
    { name: 'Biografia',          type: 'BOOK'   as MediaType },
    { name: 'Informativo',        type: 'BOOK'   as MediaType },
    // MOVIE
    { name: 'Drama',              type: 'MOVIE'  as MediaType },
    { name: 'Comédia',            type: 'MOVIE'  as MediaType },
    { name: 'Documentário',       type: 'MOVIE'  as MediaType },
    { name: 'Superação',          type: 'MOVIE'  as MediaType },
    // SERIES
    { name: 'Minissérie',         type: 'SERIES' as MediaType },
    { name: 'Sitcom',             type: 'SERIES' as MediaType },
    { name: 'Bem-estar',          type: 'SERIES' as MediaType },
  ];

  console.log('Populando gêneros...');
  for (const g of genres) {
    await prisma.genre.upsert({
      where:  { name: g.name },
      update: { type: g.type },
      create: { name: g.name, type: g.type, status: StatusEnum.ACTIVE },
    });
  }

  const genreBook   = await prisma.genre.findFirst({ where: { name: 'Saúde e Bem-estar' } });
  const genreMovie  = await prisma.genre.findFirst({ where: { name: 'Drama' } });
  const genreSeries = await prisma.genre.findFirst({ where: { name: 'Minissérie' } });

  // ─── 3. LIVROS ────────────────────────────────────────────────────────────
  const books = [
    { title: 'Além da Cura',                                              author: 'A definir', image: 'books/alem_da_cura.jpg' },
    { title: 'O Guia para Enfrentar o Câncer',                            author: 'A definir', image: 'books/guia_enfrentar.jpg' },
    { title: 'Ressignificando a Vida através do Câncer',                  author: 'A definir', image: 'books/ressignificando_vida.jpg' },
    { title: 'A Cura do Câncer: Mergulhando no Passado e Ressignificando',author: 'A definir', image: 'books/mergulhando_passado.jpg' },
    { title: 'Sobrevivi: Uma História Real',                               author: 'A definir', image: 'books/sobrevivi.jpg' },
    { title: 'Um Novo Amanhecer na Luta contra o Câncer',                 author: 'A definir', image: 'books/novo_amanhecer.jpg' },
    { title: 'A Cura Definitiva do Câncer',                               author: 'A definir', image: 'books/cura_definitiva.jpg' },
    { title: '208 Dias: Superando o Câncer',                              author: 'A definir', image: 'books/208_dias.jpg' },
  ];

  console.log('Populando livros...');
  for (const b of books) {
    await prisma.media.upsert({
      where:  { title_type: { title: b.title, type: 'BOOK' } },
      update: { image_path: b.image },
      create: {
        title: b.title, type: 'BOOK', isFree: true,
        status: StatusEnum.ACTIVE, genreId: genreBook!.id,
        image_path: b.image, whereToFind: ['Consultar Professora'],
        bookDetails: { create: { author: b.author, page_count: 0, visitCount: 0 } },
      },
    });
  }

  // ─── 4. FILMES ────────────────────────────────────────────────────────────
  const movies = [
    { title: 'Love Story - Uma História de Amor',  year: 1970, director: 'Arthur Hiller',     image: 'movies/love_story.png' },
    { title: 'Laços de Ternura',                   year: 1983, director: 'James L. Brooks',   image: 'movies/lacos_ternura.jpg' },
    { title: 'Tudo por Amor',                      year: 1991, director: 'Garry Marshall',    image: 'movies/tudo_por_amor.jpg' },
    { title: 'Um Golpe do Destino',                year: 1991, director: 'Randa Haines',      image: 'movies/golpe_destino.jpg' },
    { title: 'Lado a Lado',                        year: 1998, director: 'Chris Columbus',    image: 'movies/lado_a_lado.jpg' },
    { title: 'Patch Adams',                         year: 1998, director: 'Tom Shadyac',       image: 'movies/patch_adams.jpg' },
    { title: 'Um Amor Verdadeiro',                 year: 1998, director: 'Jon Avnet',         image: 'movies/amor_verdadeiro.jpg' },
    { title: 'Um Amor para Recordar',              year: 2002, director: 'Adam Shankman',     image: 'movies/amor_recordar.jpg' },
    { title: 'Antes de Partir',                    year: 2007, director: 'Rob Reiner',        image: 'movies/antes_de_partir.jpg' },
    { title: 'Uma Chance Para Viver',              year: 2008, director: 'A definir',         image: 'movies/chance_viver.jpg' },
    { title: 'Uma Prova de Amor',                  year: 2009, director: 'Nick Cassavetes',   image: 'movies/prova_amor.jpg' },
    { title: 'Biutiful',                           year: 2010, director: 'Alejandro González', image: 'movies/biutiful.jpg' },
    { title: 'Cartas para Deus',                   year: 2010, director: 'David Nixon',       image: 'movies/cartas_deus.jpg' },
  ];

  // Remove títulos antigos antes do upsert (renomeações que quebrariam o unique)
  await prisma.media.deleteMany({ where: { title: 'Patch Adams - O Amor é Contagioso', type: 'MOVIE' } });
  await prisma.media.deleteMany({ where: { title: 'The Big C - Aquela Doença com C',   type: 'SERIES' } });

  console.log('Populando filmes...');
  for (const m of movies) {
    await prisma.media.upsert({
      where:  { title_type: { title: m.title, type: 'MOVIE' } },
      update: { image_path: m.image, releaseYear: m.year },
      create: {
        title: m.title, type: 'MOVIE', isFree: false,
        releaseYear: m.year, status: StatusEnum.ACTIVE,
        genreId: genreMovie!.id, image_path: m.image,
        whereToFind: ['A definir'],
        movieDetails: { create: { director: m.director, duration: 'A definir' } },
      },
    });
  }

  // ─── 5. SÉRIES ────────────────────────────────────────────────────────────
  const series = [
    { title: 'Alexa e Katie',                              seasons: 4, showrunner: 'Heather Wordham',   image: 'series/alexa_katie.jpg',         link: 'https://www.netflix.com' },
    { title: 'The Big C / Aquela Doença com C',            seasons: 4, showrunner: 'Darlene Hunt',      image: 'series/the_big_c.jpg',           link: '' },
    { title: 'Recomeço',                                   seasons: 1, showrunner: 'A definir',         image: 'series/recomeco.jpg',            link: 'https://www.netflix.com' },
    { title: 'Graça e Coragem',                            seasons: 1, showrunner: 'A definir',         image: 'series/graca_coragem.jpg',       link: 'https://www.netflix.com' },
    { title: 'Playlist: LIVES - Histórias Reais',          seasons: 1, showrunner: 'Patricia Figueiredo', image: 'series/patricia_figueiredo.png', link: 'https://www.youtube.com' },
    { title: 'Hospital de Amor (Barretos)',                 seasons: 1, showrunner: 'Hospital de Amor', image: 'series/hospital_amor.png',       link: 'https://www.youtube.com' },
  ];

  console.log('Populando séries...');
  for (const s of series) {
    await prisma.media.upsert({
      where:  { title_type: { title: s.title, type: 'SERIES' } },
      update: { image_path: s.image },
      create: {
        title: s.title, type: 'SERIES', isFree: true,
        status: StatusEnum.ACTIVE, genreId: genreSeries!.id,
        image_path: s.image, whereToFind: [s.link].filter(Boolean),
        seriesDetails: { create: { showrunner: s.showrunner, seasons: s.seasons, externalLink: s.link } },
      },
    });
  }

  // ─── 6. ATIVIDADES DE LAZER ───────────────────────────────────────────────
  const activities = [
    { name: 'Yoga Leve',            type: LeisureType.THERAPY,      frequency: FrequencyType.DAILY,      image: 'activities/yoga.jpg' },
    { name: 'Jardinagem',           type: LeisureType.RECREATIONAL, frequency: FrequencyType.WEEKLY,     image: 'activities/jardinagem.jpg' },
    { name: 'Pintura',              type: LeisureType.CULTURAL,     frequency: FrequencyType.WEEKLY,     image: 'activities/pintura.jpg' },
    { name: 'Diário de Gratidão',   type: LeisureType.THERAPY,      frequency: FrequencyType.DAILY,      image: 'activities/diario.jpg' },
    { name: 'Meditação Guiada',     type: LeisureType.THERAPY,      frequency: FrequencyType.DAILY,      image: 'activities/meditacao-guiada.jpg' },
    { name: 'Caminhada Leve',       type: LeisureType.PHYSICAL,     frequency: FrequencyType.DAILY,      image: 'activities/caminhada.jpg' },
    { name: 'Clube de Artes',       type: LeisureType.RECREATIONAL, frequency: FrequencyType.WEEKLY,     image: 'activities/clube_artes.jpg' },
    { name: 'Reunião de Apoio',     type: LeisureType.SOCIAL,       frequency: FrequencyType.FORTWEEKLY, image: 'activities/reuniao_apoio.jpg' },
  ];

  console.log('Populando atividades de lazer...');
  for (const a of activities) {
    await prisma.leisureActivity.upsert({
      where:  { name: a.name },
      update: { type: a.type, frequency: a.frequency, image_path: a.image },
      create: { name: a.name, type: a.type, frequency: a.frequency, image_path: a.image, status: StatusEnum.ACTIVE },
    });
  }

  console.log('✅ Seed finalizada com sucesso!');
  console.log('');
  console.log('👤 Usuários de teste criados:');
  console.log('   paciente@oncomente.com  | senha: onco123 | role: PATIENT');
  console.log('   cuidador@oncomente.com  | senha: onco123 | role: CAREGIVER');
  console.log('   admin@oncomente.com     | senha: onco123 | role: ADMIN');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

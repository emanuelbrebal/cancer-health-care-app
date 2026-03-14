import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, StatusEnum, MediaType } from '@prisma/client';
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seeding do OncoMente...');

  // 1. SEED DE GÊNEROS
  const genres = [
    // LIVROS
    { name: 'Informativo', type: 'BOOK' },
    { name: 'Nutrição', type: 'BOOK' },
    { name: 'Autoajuda', type: 'BOOK' },
    { name: 'Biografia', type: 'BOOK' },
    { name: 'Ficção', type: 'BOOK' },
    { name: 'Saúde e Bem-estar', type: 'BOOK' },

    // FILMES
    { name: 'Documentário', type: 'MOVIE' },
    { name: 'Comédia', type: 'MOVIE' },
    { name: 'Drama', type: 'MOVIE' },
    { name: 'Animação', type: 'MOVIE' },
    { name: 'Superação', type: 'MOVIE' },

    // SÉRIES
    { name: 'Minissérie', type: 'SERIES' },
    { name: 'Bem-estar', type: 'SERIES' },
    { name: 'Sitcom', type: 'SERIES' },
  ];

  console.log('Populando gêneros...');
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { name: genre.name },
      update: { type: genre.type as MediaType },
      create: {
        name: genre.name,
        type: genre.type as MediaType,
        status: StatusEnum.ACTIVE,
      },
    });
  }

  // Pegando IDs de gêneros padrão para os itens da professora
  const defaultBookGenre = await prisma.genre.findFirst({ where: { name: 'Saúde e Bem-estar' } });
  const defaultMovieGenre = await prisma.genre.findFirst({ where: { name: 'Drama' } });

  // 2. SEED DE LIVROS (Dados da Professora Mousinho)
  const professorBooks = [
    "Além da Cura",
    "O guia para enfrentar o câncer",
    "Ressignificando a vida através do câncer",
    "A cura do cancer- mergulhando no passado e ressignificando",
    "Sobrevivi- uma história real",
    "Um novo amanhecer na luta contra o câncer",
    "A cura definitiva do cancer: as terapias mais rápidas, simples",
    "208 dias: superando o cancer"
  ];

  console.log('Populando livros da curadoria...');
  for (const title of professorBooks) {
    await prisma.media.upsert({
      where: { title_type: { title, type: 'BOOK' } }, 
      update: {},
      create: {
        title,
        type: 'BOOK',
        isFree: true,
        status: StatusEnum.ACTIVE,
        genreId: defaultBookGenre!.id,
        image_path: '',
        whereToFind: ['Consultar Professora'],
        bookDetails: {
          create: {
            author: 'A definir',
            page_count: 0,
            visitCount: 0
          }
        }
      }
    });
  }

  // 3. SEED DE FILMES (Dados da Professora Mousinho)
  const professorMovies = [
    "A culpa é das estrelas",
    "Antes de partir",
    "50/50",
    "Laços de ternura",
    "Graça e Coragem",
    "Milagre do Destino",
    "Uma prova de amor",
    "Uma chance para viver",
    "Caramelo",
    "Deixe-me viver",
    "Tudo por amor",
    "Um golpe do destino",
    "Path Adams- o amor é contagioso",
    "Um verdadeiro Amor",
    "Biutiful",
    "Cartas para Deus"
  ];

  console.log('Populando filmes da curadoria...');
  for (const title of professorMovies) {
    await prisma.media.upsert({
      where: { title_type: { title, type: 'MOVIE' } },
      update: {},
      create: {
        title,
        type: 'MOVIE',
        isFree: false,
        status: StatusEnum.ACTIVE,
        genreId: defaultMovieGenre!.id,
        image_path: '',
        whereToFind: ['A definir'],
        movieDetails: {
          create: {
            director: 'A definir',
            duration: '0min',
            externalLink: ''
          }
        }
      }
    });
  }

  console.log('✅ Seed finalizada com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, StatusEnum, MediaType, LeisureType, FrequencyType } from '@prisma/client';
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seeding do OncoMente...');

  // 1. SEED DE GÊNEROS
  const genres = [
    { name: 'Informativo', type: 'BOOK' },
    { name: 'Nutrição', type: 'BOOK' },
    { name: 'Autoajuda', type: 'BOOK' },
    { name: 'Biografia', type: 'BOOK' },
    { name: 'Ficção', type: 'BOOK' },
    { name: 'Saúde e Bem-estar', type: 'BOOK' },
    { name: 'Documentário', type: 'MOVIE' },
    { name: 'Comédia', type: 'MOVIE' },
    { name: 'Drama', type: 'MOVIE' },
    { name: 'Animação', type: 'MOVIE' },
    { name: 'Superação', type: 'MOVIE' },
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

  const defaultBookGenre = await prisma.genre.findFirst({ where: { name: 'Saúde e Bem-estar' } });
  const defaultMovieGenre = await prisma.genre.findFirst({ where: { name: 'Drama' } });

  // 2. SEED DE ATIVIDADES DE LAZER (Leisure Activities)
  const leisureActivities = [
  { name: 'Caminhada Leve', type: LeisureType.PHYSICAL, frequency: FrequencyType.DAILY, image_path: 'https://images.unsplash.com/photo-1502129194164-7c6ce308417c' },
  { name: 'Meditação Guiada', type: LeisureType.THERAPY, frequency: FrequencyType.DAILY, image_path: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773' },
  { name: 'Clube de Artes', type: LeisureType.RECREATIONAL, frequency: FrequencyType.WEEKLY, image_path: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b' },
  { name: 'Reunião de Apoio', type: LeisureType.SOCIAL, frequency: FrequencyType.FORTWEEKLY, image_path: 'https://images.unsplash.com/photo-1529148482759-b35b28c9075a' },
];

  console.log('Populando atividades de lazer...');
  for (const activity of leisureActivities) {
  await prisma.leisureActivity.upsert({
    where: { name: activity.name }, 
    
    create: {
      name: activity.name,
      type: activity.type,
      frequency: activity.frequency,
      image_path: activity.image_path,
      status: 'ACTIVE',
    },
    
    update: {
      type: activity.type,
      frequency: activity.frequency,
      image_path: activity.image_path,
    },
  });
}

  // 3. SEED DE LIVROS (Curadoria Professora Mousinho)
  const professorBooks = [
    "Além da Cura", "O guia para enfrentar o câncer", "Ressignificando a vida através do câncer",
    "A cura do cancer- mergulhando no passado e ressignificando", "Sobrevivi- uma história real",
    "Um novo amanhecer na luta contra o câncer", "A cura definitiva do cancer: as terapias mais rápidas, simples",
    "208 dias: superando o cancer"
  ];

  console.log('Populando livros...');
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

  // 4. SEED DE FILMES (Curadoria Professora Mousinho)
  const professorMovies = [
    "A culpa é das estrelas", "Antes de partir", "50/50", "Laços de ternura", "Graça e Coragem",
    "Milagre do Destino", "Uma prova de amor", "Uma chance para viver", "Caramelo", "Deixe-me viver",
    "Tudo por amor", "Um golpe do destino", "Path Adams- o amor é contagioso", "Um verdadeiro Amor",
    "Biutiful", "Cartas para Deus"
  ];

  console.log('Populando filmes...');
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
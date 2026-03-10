import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, StatusEnum, MediaType } from '@prisma/client';
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const genres = [
    // LIVROS
    { name: 'Informativo', type: 'BOOK' },
    { name: 'Nutrição', type: 'BOOK' },
    { name: 'Autoajuda', type: 'BOOK' },
    { name: 'Biografia', type: 'BOOK' },
    { name: 'Ficção', type: 'BOOK' },
    
    // FILMES
    { name: 'Documentário', type: 'MOVIE' },
    { name: 'Comédia', type: 'MOVIE' },
    { name: 'Drama', type: 'MOVIE' },
    { name: 'Animação', type: 'MOVIE' },
    
    // SÉRIES
    { name: 'Minissérie', type: 'SERIES' },
    { name: 'Bem-estar', type: 'SERIES' },
    { name: 'Sitcom', type: 'SERIES' },
  ];

  console.log('Populando gêneros no OncoMente...');

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

  console.log('Gêneros cadastrados com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
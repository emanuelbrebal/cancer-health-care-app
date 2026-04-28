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

  // ─── 0. LIMPEZA COMPLETA ──────────────────────────────────────────────────
  console.log('🧹 Limpando banco de dados...');
  await prisma.patientSupportLog.deleteMany({});
  await prisma.treatment.deleteMany({});
  await prisma.dailyLog.deleteMany({});
  await prisma.bookDetail.deleteMany({});
  await prisma.movieDetail.deleteMany({});
  await prisma.seriesDetail.deleteMany({});
  await prisma.media.deleteMany({});
  await prisma.genre.deleteMany({});
  await prisma.leisureActivity.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✔ Banco limpo.');

  // ─── 1. USUÁRIOS DE TESTE ─────────────────────────────────────────────────
  const SENHA_TESTE = 'onco123';
  const hash = await bcrypt.hash(SENHA_TESTE, 10);

  const testUsers = [
    { email: 'paciente@oncomente.com', role: UserRole.PATIENT,   name: 'Ana Paciente',    pronoun: PronounEnum.SRA },
    { email: 'cuidador@oncomente.com', role: UserRole.CAREGIVER, name: 'Carlos Cuidador', pronoun: PronounEnum.SR },
    { email: 'admin@oncomente.com',    role: UserRole.ADMIN,      name: 'Admin OncoMente', pronoun: PronounEnum.NOT_INFORMED },
  ];

  console.log('Populando usuários de teste (senha: onco123)...');
  for (const u of testUsers) {
    await prisma.user.create({
      data: { email: u.email, password: hash, role: u.role, name: u.name, pronoun: u.pronoun },
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
    await prisma.genre.create({
      data: { name: g.name, type: g.type, status: StatusEnum.ACTIVE },
    });
  }

  const genreBook   = await prisma.genre.findFirst({ where: { name: 'Saúde e Bem-estar' } });
  const genreMovie  = await prisma.genre.findFirst({ where: { name: 'Drama' } });
  const genreSeries = await prisma.genre.findFirst({ where: { name: 'Minissérie' } });

  // ─── 4. LIVROS ────────────────────────────────────────────────────────────
  const books = [
    {
      title: 'Além da Cura',
      author: 'Milena Patricia da Silva',
      image: 'books/alem_da_cura.jpg',
      pageCount: 213,
      isFree: false,
      whereToFind: ['Amazon Brasil', 'Google Play Livros', 'Apple Books', 'Kobo', 'Editora Appris'],
      synopsis: 'Com apenas 29 anos e um diagnóstico de câncer de mama em estágio avançado, Milena Patricia da Silva relata sua jornada de transformação interior durante o tratamento oncológico. A obra questiona o que realmente significa "curar", indo além da perspectiva física para explorar a cura espiritual e emocional. Um relato visceral que inspira pacientes a viverem plenamente mesmo diante da finitude.',
    },
    {
      title: 'O Guia para Enfrentar o Câncer',
      author: 'A verificar',
      image: 'books/guia_enfrentar.jpg',
      pageCount: 0,
      isFree: false,
      whereToFind: ['Amazon Brasil', 'Livraria Cultura', 'Saraiva'],
      synopsis: 'Uma obra que oferece orientações práticas e emocionais para auxiliar pacientes oncológicos e seus familiares a navegarem pelos desafios do diagnóstico e do tratamento. O conteúdo aborda aspectos físicos, emocionais e espirituais da jornada contra o câncer, com linguagem acessível e acolhedora.',
    },
    {
      title: 'Ressignificando a Vida através do Câncer',
      author: 'Stephanie Valente Balreira',
      image: 'books/ressignificando_vida.jpg',
      pageCount: 148,
      isFree: false,
      whereToFind: ['Amazon Brasil', 'Magazine Luiza', 'Um Livro'],
      synopsis: 'Stephanie Valente Balreira narra as experiências positivas e os aprendizados da convivência com alguém em tratamento oncológico. A autora não foca no tratamento em si, mas usa episódios vividos para ressaltar o que de bom pode acontecer — a união com quem se ama e o crescimento pessoal. Uma obra que convida a enxergar o câncer sob outro ponto de vista.',
    },
    {
      title: 'A Cura do Câncer: Mergulhando no Passado e Ressignificando',
      author: 'Selma C. Morars',
      image: 'books/mergulhando_passado.jpg',
      pageCount: 69,
      isFree: false,
      whereToFind: ['Clube de Autores', 'Amazon Brasil'],
      synopsis: 'Selma C. Morars, terapeuta holística em tratamento oncológico por carcinoma de mama, compartilha suas experiências, aprendizados e conhecimentos em práticas terapêuticas. A obra busca ajudar pessoas que passaram ou passam por processos dolorosos, doenças físicas e emocionais, incluindo o câncer. Uma narrativa que descreve o uso de diversas técnicas terapêuticas durante a própria jornada de cura.',
    },
    {
      title: 'Sobrevivi: Uma História Real',
      author: 'A verificar',
      image: 'books/sobrevivi.jpg',
      pageCount: 0,
      isFree: false,
      whereToFind: ['Amazon Brasil', 'Livraria Cultura', 'Saraiva'],
      synopsis: 'Um relato emocionante de superação que narra a batalha de uma sobrevivente do câncer, desde o diagnóstico até a remissão. A obra aborda os desafios físicos e emocionais do tratamento, compartilhando esperança e determinação para outros pacientes que enfrentam a mesma jornada.',
    },
    {
      title: 'Um Novo Amanhecer na Luta contra o Câncer',
      author: 'Antonia Braz',
      image: 'books/novo_amanhecer.jpg',
      pageCount: 168,
      isFree: false,
      whereToFind: ['Literare Books', 'Amazon Brasil'],
      synopsis: 'A autora Antonia Braz reúne momentos extraídos do diário pessoal de Cidinha Mendonça durante quase 16 anos de batalha implacável contra o câncer. A obra traz inspiração, fé e determinação para pacientes oncológicos e seus cuidadores, mostrando que é possível lutar sem desanimar mesmo diante de um diagnóstico severo. Um livro de esperança para quem enfrenta o câncer ou acompanha alguém nessa jornada.',
    },
    {
      title: 'A Cura Definitiva do Câncer',
      author: 'Luis de Oliveira',
      image: 'books/cura_definitiva.jpg',
      pageCount: 0,
      isFree: false,
      whereToFind: ['Amazon Brasil (Kindle e físico)'],
      synopsis: 'Luis de Oliveira apresenta um conjunto de terapias naturais e alternativas com foco no enfrentamento do câncer. O livro busca oferecer perspectivas diferentes sobre o processo de cura, reunindo conhecimentos de anos de pesquisa do autor. As abordagens apresentadas são complementares e não substituem o tratamento médico convencional.',
    },
    {
      title: '208 Dias: Superando o Câncer',
      author: 'Ligia Pinheiro',
      image: 'books/208_dias.jpg',
      pageCount: 0,
      isFree: false,
      whereToFind: ['Amazon Brasil'],
      synopsis: 'Ligia Pinheiro reúne quatro histórias reais de pessoas que sobreviveram ao câncer, mostrando a perspectiva que a vida oferece após uma experiência tão intensa. Por meio dos relatos, o leitor acompanha a transformação interior de quem venceu a doença e descobre um novo significado para a existência. Uma obra de esperança e superação que celebra a vida.',
    },
  ];

  console.log('Populando livros...');
  for (const b of books) {
    await prisma.media.create({
      data: {
        title: b.title, type: 'BOOK', isFree: b.isFree,
        status: StatusEnum.ACTIVE, genreId: genreBook!.id,
        image_path: b.image, whereToFind: b.whereToFind,
        synopsis: b.synopsis,
        bookDetails: { create: { author: b.author, page_count: b.pageCount, visitCount: 0 } },
      },
    });
  }

  // ─── 5. FILMES ────────────────────────────────────────────────────────────
  const movies = [
    {
      title: 'Love Story - Uma História de Amor',
      year: 1970,
      director: 'Arthur Hiller',
      image: 'movies/love_story.png',
      duration: '1h40min',
      isFree: false,
      whereToFind: ['Amazon Prime Video', 'Apple TV', 'Google Play Filmes'],
      synopsis: 'Oliver, um jovem da elite de Harvard, apaixona-se por Jenny, uma estudante de música de família humilde. Após contrair matrimônio e superar os preconceitos familiares, o casal descobre que Jenny está com leucemia. Um dos maiores romances da história do cinema, que aborda o amor incondicional diante da perda.',
    },
    {
      title: 'Laços de Ternura',
      year: 1983,
      director: 'James L. Brooks',
      image: 'movies/lacos_ternura.jpg',
      duration: '2h12min',
      isFree: false,
      whereToFind: ['Amazon Prime Video', 'Apple TV', 'Google Play Filmes'],
      synopsis: 'A história de Aurora e sua filha Emma, que se amam e brigam ao longo dos anos enquanto formam suas próprias famílias. Quando Emma descobre que está com câncer, mãe e filha são forçadas a revisitar sua relação e encontrar a paz. Um drama que conquistou 5 Oscar, incluindo Melhor Filme e Melhor Diretor.',
    },
    {
      title: 'Tudo por Amor',
      year: 1991,
      director: 'Garry Marshall',
      image: 'movies/tudo_por_amor.jpg',
      duration: '1h51min',
      isFree: false,
      whereToFind: ['Amazon Prime Video', 'Google Play Filmes', 'Apple TV'],
      synopsis: 'Uma jovem enfermeira aceita cuidar de um homem rico com leucemia que decidiu abandonar o tratamento. Enquanto cuida dele, os dois se apaixonam e ela tenta convencer Victor a lutar pela vida. Um filme que explora amor, esperança e a recusa em aceitar o destino.',
    },
    {
      title: 'Um Golpe do Destino',
      year: 1991,
      director: 'Randa Haines',
      image: 'movies/golpe_destino.jpg',
      duration: '2h3min',
      isFree: false,
      whereToFind: ['Amazon Prime Video', 'Google Play Filmes'],
      synopsis: 'Dr. Jack McKee é um cirurgião bem-sucedido e arrogante que, ao receber um diagnóstico de câncer de laringe, é forçado a experimentar o sistema de saúde como paciente. A jornada o transforma profundamente, tornando-o mais empático com seus próprios pacientes. Um drama que questiona a relação entre médicos e pacientes.',
    },
    {
      title: 'Lado a Lado',
      year: 1998,
      director: 'Chris Columbus',
      image: 'movies/lado_a_lado.jpg',
      duration: '2h4min',
      isFree: false,
      whereToFind: ['Netflix', 'Amazon Prime Video', 'Google Play Filmes'],
      synopsis: 'Isabel é a nova namorada do pai de dois filhos, cuja ex-esposa Jackie está com câncer em estágio terminal. A relação tensa entre as duas mulheres evolui para uma parceria de amor e respeito, unidas pelo bem das crianças. Um filme emocionante sobre família, maternidade e o amor que transcende o tempo.',
    },
    {
      title: 'Patch Adams',
      year: 1998,
      director: 'Tom Shadyac',
      image: 'movies/patch_adams.jpg',
      duration: '1h55min',
      isFree: false,
      whereToFind: ['Netflix', 'Amazon Prime Video', 'Google Play Filmes'],
      synopsis: 'Baseado em fatos reais, o filme conta a história de Hunter "Patch" Adams, um estudante de medicina que acredita que o humor e a compaixão são a melhor medicina. Contrariando os métodos tradicionais, ele usa o riso para tratar pacientes terminais e humanizar a medicina. Um filme inspirador protagonizado por Robin Williams.',
    },
    {
      title: 'Um Amor Verdadeiro',
      year: 1998,
      director: 'Jon Avnet',
      image: 'movies/amor_verdadeiro.jpg',
      duration: 'A verificar',
      isFree: false,
      whereToFind: ['Amazon Prime Video', 'Google Play Filmes', 'Apple TV'],
      synopsis: 'Um casal enfrenta juntos o diagnóstico de câncer, testando os limites do amor e do comprometimento. O filme retrata com sensibilidade os desafios emocionais e físicos do tratamento oncológico, celebrando a força dos laços que nos unem nos momentos mais difíceis.',
    },
    {
      title: 'Um Amor para Recordar',
      year: 2002,
      director: 'Adam Shankman',
      image: 'movies/amor_recordar.jpg',
      duration: '1h42min',
      isFree: false,
      whereToFind: ['Netflix', 'Amazon Prime Video', 'Google Play Filmes'],
      synopsis: 'Landon Carter, um jovem rebelde, é obrigado a participar de atividades extracurriculares onde conhece Jamie Sullivan, filha de um pastor. Ao se apaixonar, ele descobre que Jamie carrega um segredo: ela tem leucemia. Uma história de amor que inspira e emociona gerações.',
    },
    {
      title: 'Antes de Partir',
      year: 2007,
      director: 'Rob Reiner',
      image: 'movies/antes_de_partir.jpg',
      duration: '1h37min',
      isFree: false,
      whereToFind: ['Amazon Prime Video', 'Max', 'Google Play Filmes'],
      synopsis: 'Edward e Carter, dois homens com doenças terminais, fogem do hospital e partem em uma aventura pelo mundo com uma lista de coisas a fazer antes de morrer. A jornada transforma ambos, revelando as coisas mais importantes da vida. Uma comédia dramática com Jack Nicholson e Morgan Freeman.',
    },
    {
      title: 'Uma Chance Para Viver',
      year: 2008,
      director: 'A verificar',
      image: 'movies/chance_viver.jpg',
      duration: 'A verificar',
      isFree: false,
      whereToFind: ['Amazon Prime Video', 'Google Play Filmes'],
      synopsis: 'Um drama emocionante sobre a luta pela vida e pela esperança diante de um diagnóstico grave. O filme acompanha personagens que encontram força uns nos outros para enfrentar os desafios do tratamento oncológico e redescobrir o valor de cada momento.',
    },
    {
      title: 'Uma Prova de Amor',
      year: 2009,
      director: 'Nick Cassavetes',
      image: 'movies/prova_amor.jpg',
      duration: '1h49min',
      isFree: false,
      whereToFind: ['Netflix', 'Amazon Prime Video', 'Google Play Filmes'],
      synopsis: 'Anna Fitzgerald, de 11 anos, processa seus pais alegando emancipação médica após uma vida inteira sendo doadora de células para sua irmã Kate, que tem leucemia. O filme explora as complexas questões éticas da doação de órgãos e o amor familiar incondicional. Baseado no best-seller de Jodi Picoult.',
    },
    {
      title: 'Biutiful',
      year: 2010,
      director: 'Alejandro González Iñárritu',
      image: 'movies/biutiful.jpg',
      duration: '2h28min',
      isFree: false,
      whereToFind: ['Amazon Prime Video', 'Google Play Filmes', 'Apple TV'],
      synopsis: 'Uxbal é um pai solteiro em Barcelona que descobre ter câncer de próstata em estágio terminal. Com pouco tempo de vida, ele tenta assegurar o futuro de seus dois filhos enquanto lida com escolhas morais difíceis. Um retrato poderoso da paternidade, morte e redenção dirigido por Alejandro González Iñárritu.',
    },
    {
      title: 'Cartas para Deus',
      year: 2010,
      director: 'David Nixon',
      image: 'movies/cartas_deus.jpg',
      duration: '1h53min',
      isFree: false,
      whereToFind: ['YouTube', 'Amazon Prime Video', 'Google Play Filmes'],
      synopsis: 'Tyler Doherty é uma criança com um tumor cerebral inoperável que passa seus dias escrevendo cartas para Deus. Seus bilhetes chegam às mãos de um carteiro que passa por seus próprios desafios, e as duas histórias se entrelaçam de forma emocionante. Uma história de fé, esperança e o poder transformador de palavras simples.',
    },
  ];

  console.log('Populando filmes...');
  for (const m of movies) {
    await prisma.media.create({
      data: {
        title: m.title, type: 'MOVIE', isFree: m.isFree,
        releaseYear: m.year, status: StatusEnum.ACTIVE,
        genreId: genreMovie!.id, image_path: m.image,
        whereToFind: m.whereToFind,
        synopsis: m.synopsis,
        movieDetails: { create: { director: m.director, duration: m.duration } },
      },
    });
  }

  // ─── 6. SÉRIES ────────────────────────────────────────────────────────────
  const series = [
    {
      title: 'Alexa e Katie',
      seasons: 4,
      showrunner: 'Heather Wordham',
      image: 'series/alexa_katie.jpg',
      link: 'https://www.netflix.com',
      isFree: false,
      whereToFind: ['Netflix'],
      synopsis: 'Alexa, uma adolescente diagnosticada com câncer, e sua melhor amiga Katie decidem entrar juntas no ensino médio sem esconder a doença — inclusive raspando os cabelos no primeiro dia de aula. A série acompanha as duas amigas navegando pelos altos e baixos da adolescência enquanto enfrentam o câncer com humor e amor. Uma série do Netflix para toda a família sobre amizade, coragem e superação.',
    },
    {
      title: 'The Big C / Aquela Doença com C',
      seasons: 4,
      showrunner: 'Darlene Hunt',
      image: 'series/the_big_c.jpg',
      link: 'https://www.amazon.com.br/primevideo',
      isFree: false,
      whereToFind: ['Amazon Prime Video', 'Apple TV'],
      synopsis: 'Cathy Jamison, uma professora organizada e bem-sucedida, descobre que tem melanoma em estágio 4 e decide parar de viver para os outros e começar a viver para si mesma. A série mistura comédia e drama para explorar como um diagnóstico terminal pode mudar radicalmente as prioridades de alguém. Com Laura Linney no papel principal, é uma reflexão profunda sobre viver com consciência da morte.',
    },
    {
      title: 'Recomeço',
      seasons: 1,
      showrunner: 'A verificar',
      image: 'series/recomeco.jpg',
      link: 'https://www.netflix.com',
      isFree: false,
      whereToFind: ['Netflix'],
      synopsis: 'Uma série do Netflix que narra a jornada de personagens que, após enfrentarem adversidades como o câncer, encontram novos começos e reconfiguram suas vidas e relacionamentos. A trama aborda com sensibilidade os desafios emocionais e familiares durante e após o tratamento oncológico.',
    },
    {
      title: 'Graça e Coragem',
      seasons: 1,
      showrunner: 'A verificar',
      image: 'series/graca_coragem.jpg',
      link: 'https://www.netflix.com',
      isFree: false,
      whereToFind: ['Netflix'],
      synopsis: 'Baseado em uma história real, a série acompanha um casal enquanto a protagonista enfrenta um diagnóstico de câncer de mama. Enquanto o companheiro cuida dela, ambos embarcam em uma jornada espiritual e emocional profunda. Uma série que explora amor, espiritualidade e a força necessária para enfrentar a doença.',
    },
    {
      title: 'Playlist: LIVES - Histórias Reais',
      seasons: 1,
      showrunner: 'Patricia Figueiredo',
      image: 'series/patricia_figueiredo.png',
      link: 'https://www.youtube.com/@PatriciaFigueiredo',
      isFree: true,
      whereToFind: ['YouTube (gratuito)'],
      synopsis: 'Série documental do YouTube apresentada por Patricia Figueiredo com histórias reais de sobreviventes do câncer. Cada episódio traz um relato diferente de pessoas que enfrentaram a doença e encontraram forças para recomeçar. Um conteúdo gratuito e inspirador para pacientes oncológicos e seus familiares.',
    },
    {
      title: 'Hospital de Amor (Barretos)',
      seasons: 1,
      showrunner: 'Hospital de Amor',
      image: 'series/hospital_amor.png',
      link: 'https://www.youtube.com/@HospitaldeAmorBarretos',
      isFree: true,
      whereToFind: ['YouTube (gratuito)'],
      synopsis: 'Série documental sobre o Hospital de Câncer de Barretos, uma das maiores instituições de referência em oncologia do Brasil, que oferece tratamento gratuito a pacientes de todo o país. O conteúdo mostra o cotidiano do hospital, os pacientes e as equipes médicas que lutam pela vida de cada pessoa. Disponível gratuitamente no YouTube.',
    },
  ];

  console.log('Populando séries...');
  for (const s of series) {
    await prisma.media.create({
      data: {
        title: s.title, type: 'SERIES', isFree: s.isFree,
        status: StatusEnum.ACTIVE, genreId: genreSeries!.id,
        image_path: s.image, whereToFind: s.whereToFind,
        synopsis: s.synopsis,
        seriesDetails: { create: { showrunner: s.showrunner, seasons: s.seasons, externalLink: s.link } },
      },
    });
  }

  // ─── 7. ATIVIDADES DE LAZER ───────────────────────────────────────────────
  const activities = [
    {
      name: 'Yoga Leve',
      type: LeisureType.THERAPY,
      frequency: FrequencyType.DAILY,
      image: 'activities/yoga.jpg',
      synopsis: 'Prática adaptada de yoga com movimentos suaves e respiração consciente, indicada para pacientes em tratamento oncológico. Ajuda a aliviar tensões musculares, reduzir a ansiedade e melhorar a qualidade do sono, respeitando os limites do corpo durante a recuperação.',
    },
    {
      name: 'Jardinagem',
      type: LeisureType.RECREATIONAL,
      frequency: FrequencyType.WEEKLY,
      image: 'activities/jardinagem.jpg',
      synopsis: 'Cuidar de plantas e flores em casa como atividade terapêutica que conecta o praticante com a natureza e o ciclo de vida. A jardinagem promove relaxamento, melhora o humor e oferece uma sensação de propósito e conquista no dia a dia durante o tratamento.',
    },
    {
      name: 'Pintura',
      type: LeisureType.CULTURAL,
      frequency: FrequencyType.WEEKLY,
      image: 'activities/pintura.jpg',
      synopsis: 'A arte da pintura como terapia expressiva que permite ao paciente externalizar emoções e sentimentos difíceis de verbalizar durante o tratamento oncológico. Além de estimular a criatividade, a atividade promove foco, relaxamento e uma sensação de realização pessoal.',
    },
    {
      name: 'Diário de Gratidão',
      type: LeisureType.THERAPY,
      frequency: FrequencyType.DAILY,
      image: 'activities/diario.jpg',
      synopsis: 'Prática diária de registrar por escrito situações, pessoas e momentos pelos quais se é grato, cultivando uma perspectiva positiva diante dos desafios do tratamento. Estudos mostram que a gratidão reduz o estresse, melhora o bem-estar emocional e fortalece a resiliência.',
    },
    {
      name: 'Meditação Guiada',
      type: LeisureType.THERAPY,
      frequency: FrequencyType.DAILY,
      image: 'activities/meditacao-guiada.jpg',
      synopsis: 'Sessões de meditação conduzidas por áudio ou vídeo que guiam o praticante por técnicas de relaxamento, visualização e atenção plena. Especialmente indicada para pacientes oncológicos, ajuda a controlar a ansiedade, aliviar a dor e promover um estado de calma e equilíbrio emocional.',
    },
  ];

  console.log('Populando atividades de lazer...');
  for (const a of activities) {
    await prisma.leisureActivity.create({
      data: {
        name: a.name, type: a.type, frequency: a.frequency,
        image_path: a.image, status: StatusEnum.ACTIVE,
        synopsis: a.synopsis,
      },
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

import { Href } from "expo-router";
import { ImageSourcePropType } from "react-native";
import { MediaItem } from "./mockDataOncologyMedias";

export type RecomendationType = {
  id: number;
  title: string;
  description?: string;
  image?: ImageSourcePropType;
  route?: Href
};

export const meditationData: MediaItem[] = [
  {
    id: 1,
    title: "Meditação para acalmar a mente e o coração.",
    url: "https://www.youtube.com/watch?v=jQ8fn7Th2ok"
  },
  {
    id: 2,
    title: "Mindfulness: Meditação Guiada",
    url: "https://www.youtube.com/watch?v=OeEJP4ij2Jo"
  },
  {
    id: 3,
    title: "Meditação Guiada | ENTREGA e CONFIANÇA",
    url: "https://www.youtube.com/watch?v=F-82J7DNOCQ"
  },
  {
    id: 4,
    title: "Meditação Guiada Clássica - 10 MINUTOS | Mindfulness, paz, conexão!",
    url: "https://www.youtube.com/watch?v=LEpFS8KdVQ8"
  },
  {
    id: 5,
    title: "Meditação Guiada 5 minutos! | Direta e profunda | Mindfulness",
    url: "https://www.youtube.com/watch?v=mTJ56qy2Flg"
  }
];

export const booksData: RecomendationType[] = [
  {
    id: 1,
    title: "Além da Cura",
    description: "Uma obra que explora a vida para além do diagnóstico, focando no bem-estar emocional e na redescoberta de propósitos pessoais.",
    image: require('@assets/images/Books/alem_da_cura.jpg'),
  },
  {
    id: 2,
    title: "O Guia para Enfrentar o Câncer",
    description: "Um companheiro prático e acolhedor que oferece orientações para navegar pela jornada com mais serenidade e informação.",
    image: require('@assets/images/Books/guia_enfrentar.jpg'),
  },
  {
    id: 3,
    title: "Ressignificando a Vida através do Câncer",
    description: "Um convite à reflexão sobre como transformar desafios em oportunidades de autoconhecimento e valorização de cada momento.",
    image: require('@assets/images/Books/ressignificando_vida.jpg'),
  },
  {
    id: 4,
    title: "A Cura do Câncer: Mergulhando no Passado e Ressignificando",
    description: "Uma abordagem sensível sobre como o cuidado com as nossas histórias pessoais pode auxiliar no processo de bem-estar atual.",
    image: require('@assets/images/Books/mergulhando_passado.jpg'),
  },
  {
    id: 5,
    title: "Sobrevivi: Uma História Real",
    description: "Um relato inspirador de resiliência e força, celebrando a vida e a superação através de uma narrativa de coragem.",
    image: require('@assets/images/Books/sobrevivi.jpg'),
  },
  {
    id: 6,
    title: "Um Novo Amanhecer na Luta contra o Câncer",
    description: "Traz uma perspectiva de renovação e esperança, focando nas novas possibilidades e na luz de cada novo dia.",
    image: require('@assets/images/Books/novo_amanhecer.jpg'),
  },
  {
    id: 7,
    title: "A Cura Definitiva do Câncer",
    description: "Explora o universo das terapias integrativas e abordagens que buscam a agilidade e simplicidade no cuidado com a saúde.",
    image: require('@assets/images/Books/cura_definitiva.jpg'),
  },
  {
    id: 8,
    title: "208 Dias: Superando o Câncer",
    description: "Um diário de vitória que narra a contagem regressiva para a superação, focando na determinação e no apoio familiar.",
    image: require('@assets/images/Books/208_dias.jpg'),
  }
];

export const moviesData: RecomendationType[] = [
  {
    id: 1,
    title: "Love Story - Uma História de Amor (1970)",
    description: "Um clássico romance universitário que retrata a força do amor diante de um diagnóstico inesperado. Venceu o Oscar de Melhor Trilha Sonora.",
    image: require('@assets/images/Movies/love_story.png'),
  },
  {
    id: 2,
    title: "Laços de Ternura (1983)",
    description: "Uma exploração profunda e emocional das relações entre mãe e filha, mostrando como o carinho familiar se intensifica diante dos desafios da saúde.",
    image: require('@assets/images/Movies/lacos_ternura.jpg'),
  },
  {
    id: 3,
    title: "Tudo por Amor (1991)",
    description: "Protagonizado por Julia Roberts, o filme narra a história de uma cuidadora que encontra um amor profundo enquanto acompanha a jornada de tratamento de um jovem.",
    image: require('@assets/images/Movies/tudo_por_amor.jpg'),
  },
  {
    id: 4,
    title: "Um Golpe do Destino (1991)",
    description: "A história de um médico que, ao se tornar paciente, redescobre a importância da humanização e da empatia no cuidado com o próximo.",
    image: require('@assets/images/Movies/golpe_destino.jpg'),
  },
  {
    id: 5,
    title: "Lado a Lado (1998)",
    description: "Um sensível retrato familiar sobre como o respeito e a união podem superar diferenças, abrindo espaço para a reconciliação e o afeto mútuo.",
    image: require('@assets/images/Movies/lado_a_lado.jpg'),
  },
  {
    id: 6,
    title: "Patch Adams - O Amor é Contagioso (1998)",
    description: "Baseado em fatos reais, mostra como o humor e o carinho podem ser aliados poderosos na busca por qualidade de vida e bem-estar emocional.",
    image: require('@assets/images/Movies/patch_adams.jpg'),
  },
  {
    id: 7,
    title: "Um Amor Verdadeiro (1998)",
    description: "Com Meryl Streep, o longa destaca a identidade da pessoa além do diagnóstico, focando nos laços familiares e na redescoberta do convívio doméstico.",
    image: require('@assets/images/Movies/amor_verdadeiro.jpg'),
  },
  {
    id: 8,
    title: "Um Amor para Recordar (2002)",
    description: "Uma história comovente que desmistifica a doença ao mostrar que, mesmo em tempos difíceis, sempre há espaço para sonhos, aprendizado e o primeiro amor.",
    image: require('@assets/images/Movies/amor_recordar.jpg'),
  },
  {
    id: 9,
    title: "Antes de Partir (2007)",
    description: "Jack Nicholson e Morgan Freeman estrelam esta jornada inspiradora sobre amizade e a realização de sonhos, celebrando o amor à vida em cada quilômetro.",
    image: require('@assets/images/Movies/antes_de_partir.jpg'),
  },
  {
    id: 10,
    title: "Uma Chance Para Viver (2008)",
    description: "Um olhar inspirador sobre a inovação científica e a persistência médica, trazendo esperança através da descoberta de novos tratamentos e caminhos.",
    image: require('@assets/images/Movies/chance_viver.jpg'),
  },
  {
    id: 11,
    title: "Uma Prova de Amor (2009)",
    description: "Um drama familiar que aborda dilemas éticos e a complexidade emocional, focando na importância da autonomia e do diálogo dentro do núcleo familiar.",
    image: require('@assets/images/Movies/prova_amor.jpg'),
  },
  {
    id: 12,
    title: "Biutiful (2010)",
    description: "Uma obra reflexiva sobre a vida, onde o protagonista busca resolver pendências pessoais e fortalecer o vínculo com seus filhos através do amor e da redenção.",
    image: require('@assets/images/Movies/biutiful.jpg'),
  },
  {
    id: 13,
    title: "Cartas para Deus (2010)",
    description: "A história de um menino que encontra na espiritualidade e na escrita uma forma de tocar vidas ao seu redor, inspirando esperança e um novo sentido para o próximo.",
    image: require('@assets/images/Movies/cartas_deus.jpg'),
  }
];

export const seriesData: RecomendationType[] = [
  {
    id: 1,
    title: "Alexa e Katie (Netflix)",
    description: "Uma sitcom leve sobre uma adolescente que busca manter sua rotina normal com o apoio fundamental de sua melhor amiga.",
    image: require('@assets/images/Series/alexa_katie.jpg'),
    route: "/recommendations/series/1"
  },
  {
    id: 2,
    title: "The Big C / Aquela Doença com C",
    description: "Acompanha uma jornada de redescoberta pessoal, focada em viver a vida de uma nova forma, com momentos de humor e emoção.",
    image: require('@assets/images/Series/the_big_c.jpg'),
    route: "/recommendations/series/2"
  },
  {
    id: 3,
    title: "Recomeço (Netflix)",
    description: "Aborda a importância da comunicação clara entre família e médicos, focando no acolhimento e na perspectiva do cuidado afetivo.",
    image: require('@assets/images/Series/recomeco.jpg'),
    route: "/recommendations/series/3"
  },
  {
    id: 4,
    title: "Graça e Coragem (Netflix)",
    description: "Uma história centrada na união de um casal que encontra no amor a força necessária para seguir em frente com serenidade.",
    image: require('@assets/images/Series/graca_coragem.jpg'),
    route: "/recommendations/series/4"
  },
  {
    id: 5,
    title: "Playlist: LIVES - Histórias Reais (Patricia Figueiredo)",
    description: "Depoimentos reais focados na resiliência e na leveza de quem compartilha suas trajetórias de superação.",
    image: require('@assets/images/Series/patricia_figueiredo.png'),
    route: "/recommendations/video/5"
  },
  {
    id: 6,
    title: "Hospital de Amor (Barretos)",
    description: "Canal oficial com histórias inspiradoras, como a da 'Nina, a pequena valente', focando no acolhimento familiar e amoroso.",
    image: require('@assets/images/Series/hospital_amor.png'),
    route: "/recommendations/video/6"
  },
];

export const homeActivitiesData: RecomendationType[] = [
  { id: 1, title: 'Yoga Leve', description: 'Alongamentos para relaxar o corpo.', image: require('@assets/images/Placeholders/Mocks/yoga.jpg') },
  { id: 2, title: 'Jardinagem', description: 'Cuidar de plantas em vasos pequenos.', image: require('@assets/images/Placeholders/Mocks/jardinagem.jpg') }, 
  { id: 3, title: 'Pintura', description: 'Expressão criativa com aquarela.', image: require('@assets/images/Placeholders/Mocks/pintura.jpg') },
  { id: 4, title: 'Diário de Gratidão', description: 'Escrever 3 coisas boas do dia.', image: require('@assets/images/Placeholders/Mocks/diario.jpg') }, 
  { id: 5, title: 'Meditação Guiada', description: '5 minutos de respiração consciente.', image: require('@assets/images/Placeholders/Mocks/meditacao-guiada.jpg') },
];
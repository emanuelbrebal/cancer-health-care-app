import { Href } from "expo-router";
import { ImageSourcePropType } from "react-native";

export type RecomendationType = {
    id: number;
    title: string;
    description?: string;
    image?: ImageSourcePropType;
    route?: Href
};

export const mockTopicsData: RecomendationType[] = [
    { id: 1, title: 'Mindfulness Diário', description: 'Técnicas práticas para reduzir a ansiedade no dia a dia.', route: "/SocialArea/Forum/Posts" },
    { id: 2, title: 'Nutrição e Energia', description: 'Alimentos que melhoram sua disposição e foco no trabalho.' },
    { id: 3, title: 'Minimalismo Digital', description: 'Como usar a tecnologia de forma mais consciente e focada.' },
    { id: 4, title: 'Rotina Matinal', description: 'Hábitos simples para começar o dia com mais produtividade.' },
    { id: 5, title: 'Gestão de Emoções', description: 'Aprendendo a identificar e lidar com sentimentos difíceis.' },
];

export const mockCommunitiesData: RecomendationType[] = [
    { id: 1, title: 'Clube do Livro', description: 'Debates mensais sobre literatura e desenvolvimento pessoal.' },
    { id: 2, title: 'Ioga para Iniciantes', description: 'Compartilhamento de aulas, dicas de postura e respiração.' },
    { id: 3, title: 'Desafio 30 Dias', description: 'Grupo de motivação mútua para criar novos hábitos saudáveis.' },
    { id: 4, title: 'Meditação em Grupo', description: 'Encontros virtuais semanais para práticas guiadas.' },
    { id: 5, title: 'Tech Detox', description: 'Dicas e relatos para desconectar e aproveitar o mundo offline.' },
];

export const mockPostsData: RecomendationType[] = [
    { id: 1, title: 'Mariana Silva no Clube do Livro', description: '"Hábitos Atômicos" mudou minha percepção sobre rotina. Alguém quer discutir o capítulo 3?' },
    { id: 2, title: 'Lucas Oliveira no Tech Detox', description: 'Primeiro final de semana sem redes sociais concluído. Sensação de liberdade indescritível!' },
    { id: 3, title: 'Ana Beatriz no Ioga para Iniciantes', description: 'Dica: Seus calcanhares não precisam tocar o chão no cachorro olhando para baixo. Foque na coluna!'},
    { id: 4, title: 'Ricardo Santos no Desafio 30 Dias', description: 'Dia 15/30: A constância vence o talento. 3 litros de água batidos hoje! 💧' },
    { id: 5, title: 'Carla Dias no Meditação em Grupo', description: 'Lembrete: Nossa meditação guiada começa em 15 minutos. Preparem o ambiente.' },
];

export const meditationData: RecomendationType[] = [
    { id: 1, title: 'Vídeo meditação 1', description: 'Um clássico sobre a simplicidade e o amor.' },
    { id: 2, title: 'Vídeo meditação 2', description: 'Aceitando a própria vulnerabilidade.' },
    { id: 3, title: 'Vídeo meditação 3', description: 'Uma história sobre recomeços e esperança.' },
    { id: 4, title: 'Vídeo meditação 4', description: 'A disciplina busca por menos.' },
    { id: 5, title: 'Vídeo meditação 5', description: 'A nova psicologia do sucesso.' },
];

export const booksData: RecomendationType[] = [
    { id: 1, title: 'O Pequeno Príncipe', description: 'Um clássico sobre a simplicidade e o amor.' },
    { id: 2, title: 'A Coragem de Ser Imperfeito', description: 'Aceitando a própria vulnerabilidade.' },
    { id: 3, title: 'O Lado Bom da Vida', description: 'Uma história sobre recomeços e esperança.' },
    { id: 4, title: 'Essencialismo', description: 'A disciplina busca por menos.' },
    { id: 5, title: 'Mindset', description: 'A nova psicologia do sucesso.' },
];

export const moviesData: RecomendationType[] = [
    { id: 1, title: 'Extraordinário', description: 'Uma lição de gentileza e superação.' },
    { id: 2, title: 'Divertida Mente', description: 'Entendendo nossas emoções de forma leve.' },
    { id: 3, title: 'À Procura da Felicidade', description: 'Persistência em tempos difíceis.' },
    { id: 4, title: 'Comer, Rezar, Amar', description: 'Uma jornada de autodescoberta.' },
    { id: 5, title: 'Soul', description: 'O que faz a vida valer a pena?' },
];

export const seriesData: RecomendationType[] = [
    { id: 1, title: 'Ted Lasso', description: 'Otimismo radical e gentileza.' },
    { id: 2, title: 'The Good Place', description: 'Filosofia e humor leve.' },
    { id: 3, title: 'Anne with an E', description: 'A beleza da imaginação.' },
    { id: 4, title: 'Modern Family', description: 'Humor sobre o cotidiano familiar.' },
];

export const homeActivitiesData: RecomendationType[] = [
    { id: 1, title: 'Yoga Leve', description: 'Alongamentos para relaxar o corpo.', image: require('@assets/images/Placeholders/Mocks/yoga.jpg') },
    { id: 2, title: 'Jardinagem', description: 'Cuidar de plantas em vasos pequenos.' },
    { id: 3, title: 'Pintura', description: 'Expressão criativa com aquarela.' },
    { id: 4, title: 'Diário de Gratidão', description: 'Escrever 3 coisas boas do dia.' },
    { id: 5, title: 'Meditação Guiada', description: '5 minutos de respiração consciente.' },
];
import { ImageSourcePropType } from "react-native";

export type RecomendationType = {
    id: number;
    title: string;
    description?: string;
    image?: ImageSourcePropType
};

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
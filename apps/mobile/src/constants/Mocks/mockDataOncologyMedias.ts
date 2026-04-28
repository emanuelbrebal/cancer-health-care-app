export interface MediaItem {
    id: string | number;
    title: string;
    url: string | number;
    description?: string;
    series?: number;
    reps?: string;
}

export const sleepMusicMock: MediaItem[] = [
    {
        id: 1,
        title: 'Música para Sono (Busca Original - 435Hz+)',
        url: 'https://www.youtube.com/watch?v=rZMyAeVVrbg'
    },
    {
        id: 2,
        title: 'Música de Cura Profunda para o Corpo e Alma (432Hz)',
        url: 'https://www.youtube.com/watch?v=7GDCmwCNLqU'
    },
    {
        id: 3,
        title: 'Relaxamento e Acalmar a Mente para Sono REM (432Hz)',
        url: 'https://www.youtube.com/watch?v=ZTxEYxWdX_4'
    },
    {
        id: 4,
        title: 'Regeneração do Corpo e Reparo do DNA (528Hz)',
        url: 'https://www.youtube.com/watch?v=OS6RmdqvQPk'
    },
    {
        id: 5,
        title: 'Cura e Harmonização Frequência Solfeggio (963Hz)',
        url: 'https://www.youtube.com/watch?v=198zyhAKA90'
    }
];


export const warmingUpMockData: MediaItem[] = [
    {
        id: 1,
        title: "Alongamento de Tríceps",
        url: require('@assets/videos/warmups/warmup-003.mp4'),
        description: "Eleve o braço acima da cabeça e dobre o cotovelo, puxando suavemente com a outra mão.",
        series: 2,
        reps: "30s cada lado",
    },
    {
        id: 2,
        title: "Elevação de Joelhos (Marcha)",
        url: require('@assets/videos/warmups/warmup-006.mp4'),
        description: "Marche no lugar elevando os joelhos até a altura do quadril alternadamente.",
        series: 2,
        reps: "20 repetições",
    },
    {
        id: 3,
        title: "Alongamento de Ombro (Direito)",
        url: require('@assets/videos/warmups/warmup-002.mp4'),
        description: "Puxe o braço estendido horizontalmente em frente ao peito com o auxílio do outro braço.",
        series: 2,
        reps: "30s cada lado",
    },
    {
        id: 4,
        title: "Alongamento de Ombro (Esquerdo)",
        url: require('@assets/videos/warmups/warmup-007.mp4'),
        description: "Puxe o braço estendido horizontalmente em frente ao peito com o auxílio do outro braço.",
        series: 2,
        reps: "30s cada lado",
    },
    {
        id: 5,
        title: "Alongamento de Peitoral",
        url: require('@assets/videos/warmups/warmup-004.mp4'),
        description: "Entrelace os dedos atrás das costas e abra o peito elevando levemente os braços.",
        series: 2,
        reps: "30s",
    },
    {
        id: 6,
        title: "Alongamento de Quadríceps (Esquerdo)",
        url: require('@assets/videos/warmups/warmup-015.mp4'),
        description: "Em pé, segure o tornozelo esquerdo e puxe o calcanhar em direção ao glúteo. Apoie-se se necessário.",
        series: 2,
        reps: "30s cada lado",
    },
    {
        id: 7,
        title: "Alongamento de Quadríceps (Direito)",
        url: require('@assets/videos/warmups/warmup-010.mp4'),
        description: "Em pé, segure o tornozelo direito e puxe o calcanhar em direção ao glúteo. Apoie-se se necessário.",
        series: 2,
        reps: "30s cada lado",
    },
    {
        id: 8,
        title: "Alongamento das Costas",
        url: require('@assets/videos/warmups/warmup-004.mp4'),
        description: "Entrelace os dedos em frente ao peitoral e abra as costas mantendo os braços na horizontal.",
        series: 2,
        reps: "30s",
    },
    {
        id: 9,
        title: "Rotação e Extensão de Ombro",
        url: require('@assets/videos/warmups/warmup-006.mp4'),
        description: "Gire os ombros lentamente para frente e para trás, depois faça extensões suaves.",
        series: 2,
        reps: "10 rotações",
    },
    {
        id: 10,
        title: "Alongamento Posterior (Pés Afastados)",
        url: require('@assets/videos/warmups/warmup-007.mp4'),
        description: "Com os pés afastados na largura dos ombros, incline o tronco à frente mantendo as costas retas.",
        series: 2,
        reps: "30s",
    },
    {
        id: 11,
        title: "Alongamento Peitoral (Esquerdo)",
        url: require('@assets/videos/warmups/warmup-007.mp4'),
        description: "Apoie o braço esquerdo em uma parede. Mantenha-o firme e, com os pés alinhados, gire o corpo no sentido a abrir o peitoral.",
        series: 2,
        reps: "30s",
    },
    {
        id: 12,
        title: "Alongamento Peitoral (Direito)",
        url: require('@assets/videos/warmups/warmup-007.mp4'),
        description: "Apoie o braço direito em uma parede. Mantenha-o firme e, com os pés alinhados, gire o corpo no sentido a abrir o peitoral.",
        series: 2,
        reps: "30s",
    },
    {
        id: 13,
        title: "Alongamento Posterior (Pernas Cruzadas)",
        url: require('@assets/videos/warmups/warmup-012.mp4'),
        description: "Cruze uma perna na frente da outra e incline o tronco suavemente para sentir o alongamento posterior.",
        series: 2,
        reps: "30s cada lado",
    },
    {
        id: 14,
        title: "Agachamento Isométrico na Parede",
        url: require('@assets/videos/warmups/warmup-011.mp4'),
        description: "Apoie as costas na parede e desça até 90° nos joelhos. Mantenha a posição.",
        series: 3,
        reps: "30s",
    },
    {
        id: 15,
        title: "Flexão Plantar (Panturrilha)",
        url: require('@assets/videos/warmups/warmup-014.mp4'),
        description: "Em pé, eleve-se nas pontas dos pés lentamente e desça com controle.",
        series: 3,
        reps: "15 repetições",
    },
    {
        id: 16,
        title: "Bicicleta",
        url: require('@assets/videos/exercises/exercise-029.mp4'),
        description: "Mantenha uma posição confortável e ergonômica. Controle a velocidade e a sua respiração.",
        series: 1,
        reps: "10 minutos para aquecer",
    },
    {
        id: 17,
        title: "Caminhada leve",
        url: require('@assets/videos/exercises/exercise-030.mp4'),
        description: "Caminhada leve em ambiente plano. Controle a velocidade e a sua respiração.",
        series: 1,
        reps: "10 minutos para aquecer",
    },
    {
        id: 18,
        title: "Subida em escadas",
        url: require('@assets/videos/exercises/exercise-034.mp4'),
        description: "Caminhada leve em escada. Controle a velocidade e a sua respiração.",
        series: 1,
        reps: "5 minutos para aquecer",
    },
];


export const strengthExercisesData: MediaItem[] = [
    {
        id: 1,
        title: "Elevação de Perna Sentada",
        url: require('@assets/videos/exercises/exercise-008.mp4'),
        description: "Sentado, estenda uma perna e eleve-a lentamente até a altura do quadril. Controle a descida.",
        series: 3,
        reps: "12 repetições cada lado",
    },
    {
        id: 2,
        title: "Flexão de Joelho em Pé (Posterior)",
        url: require('@assets/videos/warmups/warmup-002.mp4'),
        description: "Em pé, dobre o joelho trazendo o calcanhar em direção ao glúteo. Controle o movimento.",
        series: 3,
        reps: "12 repetições cada lado",
    },
    {
        id: 3,
        title: "Remada Unilateral com Halter",
        url: require('@assets/videos/exercises/exercise-001.mp4'),
        description: "Apoie um joelho e uma mão no banco. Com o outro braço, puxe o halter em direção ao quadril.",
        series: 3,
        reps: "12 repetições cada lado",
    },
    {
        id: 4,
        title: "Ponte Pélvica (Elevação de Quadril)",
        url: require('@assets/videos/exercises/exercise-002.mp4'),
        description: "Deitado de costas, pés apoiados no chão. Eleve o quadril contraindo o glúteo e segure por 2s.",
        series: 3,
        reps: "15 repetições",
    },
    {
        id: 5,
        title: "Ponte Unilateral",
        url: require('@assets/videos/exercises/exercise-018.mp4'),
        description: "Igual à ponte pélvica, mas com uma perna estendida para o ar durante a elevação.",
        series: 3,
        reps: "10 repetições cada lado",
    },
    {
        id: 6,
        title: "Supino Reto com Halteres",
        url: require('@assets/videos/exercises/exercise-003.mp4'),
        description: "Deitado, segure os halteres na altura do peito e empurre para cima até estender os braços.",
        series: 3,
        reps: "12 repetições",
    },
    {
        id: 7,
        title: "Elevação Frontal com Halteres",
        url: require('@assets/videos/exercises/exercise-018.mp4'),
        description: "Em pé, eleve os braços estendidos à frente até a altura dos ombros e desça com controle.",
        series: 2,
        reps: "10 repetições",
    },
    {
        id: 8,
        title: "Elevação Lateral com Halteres",
        url: require('@assets/videos/exercises/exercise-007.mp4'),
        description: "Eleve os braços lateralmente até a altura dos ombros, mantendo o cotovelo levemente dobrado.",
        series: 3,
        reps: "12 repetições",
    },
    {
        id: 9,
        title: "Extensão de Perna Sentada (Alternada)",
        url: require('@assets/videos/exercises/exercise-009.mp4'),
        description: "Sentado na cadeira, estenda uma perna por vez e segure por 2 segundos antes de descer.",
        series: 3,
        reps: "12 repetições cada lado",
    },
    {
        id: 10,
        title: "Rosca Direta",
        url: require('@assets/videos/exercises/exercise-009.mp4'),
        description: "Mantendo a posição isométrica, contraia os bíceps dos dois braços puxando os alteres para cima ao mesmo tempo. Controle a descida.",
        series: 3,
        reps: "12 repetições",
    },
    {
        id: 11,
        title: "Abdominal supra",
        url: require('@assets/videos/exercises/exercise-028.mp4'),
        description: "Deitado de costas com joelhos dobrados, eleve o tronco em direção aos joelhos contraindo o abdômen. Controle a descida.",
        series: 3,
        reps: "12 repetições",
    },
    {
        id: 12,
        title: "Desenvolvimento com halteres",
        url: require('@assets/videos/exercises/exercise-019.mp4'),
        description: "Sentado ou em pé, segure os halteres na altura dos ombros e empurre para cima até estender os braços. Controle a descida.",
        series: 3,
        reps: "12 repetições",
    },
    {
        id: 13,
        title: "Passada",
        url: require('@assets/videos/exercises/exercise-023.mp4'),
        description: "Dê um passo à frente e desça o joelho traseiro em direção ao chão. Retorne à posição inicial e alterne os lados.",
        series: 3,
        reps: "12 repetições",
    },
    {
        id: 14,
        title: "Agachamento em cadeira",
        url: require('@assets/videos/exercises/exercise-017.mp4'),
        description: "Posicione-se à frente de uma cadeira, desça lentamente até quase sentar e retorne à posição em pé controlando o movimento.",
        series: 3,
        reps: "12 repetições",
    },
    
];

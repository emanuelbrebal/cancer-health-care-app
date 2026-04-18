export interface MediaItem {
    id: string | number ;
    title: string;
    url: string;
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


export const warmingUpMockData = [
    {
        id: 1,
        title: "Alongamento de Tríceps",
        description: "Alongamento do braço atrás da cabeça com auxílio do braço oposto.",
        isExpanded: false,
        onToggle: () => { },
        actionText: "Ver Vídeo",
        url: "WhatsApp Video 2026-04-09 at 15.00.42 (4).mp4",
        onAction: () => { }
    },
    {
        id: 2,
        title: "Elevação de Joelhos (Marcha)",
        description: "Movimento dinâmico de elevar os joelhos alternadamente em posição ortostática.",
        isExpanded: false,
        onToggle: () => { },
        actionText: "Ver Vídeo",
        url: "WhatsApp Video 2026-04-09 at 15.00.42.mp4",
        onAction: () => { }
    },
    {
        id: 3,
        title: "Alongamento de Ombro",
        description: "Extensão do braço à frente do corpo para alongamento da região deltoide.",
        isExpanded: false,
        onToggle: () => { },
        actionText: "Ver Vídeo",
        url: "WhatsApp Video 2026-04-09 at 15.00.43 (3).mp4",
        onAction: () => { }
    },
    {
        id: 4,
        title: "Alongamento de Peitoral",
        description: "Uso de batente ou parede para abertura da cintura escapular e peitoral.",
        isExpanded: false,
        onToggle: () => { },
        actionText: "Ver Vídeo",
        url: "WhatsApp Video 2026-04-09 at 15.00.43 (5).mp4",
        onAction: () => { }
    },
    {
        id: 5,
        title: "Alongamento de Quadríceps (Direito)",
        description: "Flexão de joelho com apoio manual no pé e suporte na parede para equilíbrio.",
        isExpanded: false,
        onToggle: () => { },
        actionText: "Ver Vídeo",
        url: "WhatsApp Video 2026-04-09 at 15.00.44 (7).mp4",
        onAction: () => { }
    },
    {
        id: 6,
        title: "Rotação e Extensão de Ombro",
        description: "Movimento de rotação lateral do tronco com apoio fixo na parede.",
        isExpanded: false,
        onToggle: () => { },
        actionText: "Ver Vídeo",
        url: "WhatsApp Video 2026-04-09 at 15.00.43 (4).mp4",
        onAction: () => { }
    },
    {
        id: 7,
        title: "Alongamento Posterior (Pés Afastados)",
        description: "Flexão de tronco à frente com pernas em abdução visando o solo.",
        isExpanded: false,
        onToggle: () => { },
        actionText: "Ver Vídeo",
        url: "WhatsApp Video 2026-04-09 at 15.00.45 (1).mp4",
        onAction: () => { }
    },
    {
        id: 8,
        title: "Alongamento Posterior (Pernas Cruzadas)",
        description: "Flexão de tronco à frente com cruzamento de pernas para alongamento de cadeia posterior.",
        isExpanded: false,
        onToggle: () => { },
        actionText: "Ver Vídeo",
        url: "WhatsApp Video 2026-04-09 at 15.00.45 (4).mp4",
        onAction: () => { }
    },
    {
        id: 9,
        title: "Agachamento Isométrico na Parede",
        description: "Manutenção de posição de agachamento com as costas totalmente apoiadas na parede.",
        isExpanded: false,
        onToggle: () => { },
        actionText: "Ver Vídeo",
        url: "WhatsApp Video 2026-04-09 at 15.00.45 (5).mp4",
        onAction: () => { }
    },
    {
        id: 10,
        title: "Flexão Plantar (Panturrilha)",
        description: "Elevação rítmica dos calcanhares com apoio frontal das mãos.",
        isExpanded: false,
        onToggle: () => { },
        actionText: "Ver Vídeo",
        url: "WhatsApp Video 2026-04-09 at 15.00.45 (6).mp4",
        onAction: () => { }
    },
    {
        id: 11,
        title: "Alongamento de Quadríceps (Esquerdo)",
        description: "Flexão de joelho com apoio lateral na parede e tração manual do pé.",
        isExpanded: false,
        onToggle: () => { },
        actionText: "Ver Vídeo",
        url: "WhatsApp Video 2026-04-09 at 15.00.45.mp4",
        onAction: () => { }
    }
];


export const strengthExercisesData = [
  {
    id: 1,
    title: "Elevação de Perna Sentada",
    description: "Exercício para fortalecimento de quadríceps e flexores de quadril, mantendo o tronco apoiado.",
    isExpanded: false,
    onToggle: () => {},
    actionText: "Ver Exercício",
    url: "WhatsApp Video 2026-04-09 at 15.00.39 (4).mp4",
    onAction: () => {}
  },
  {
    id: 2,
    title: "Flexão de Joelho em Pé (Posterior)",
    description: "Trabalho de isquiotibiais utilizando a parede como apoio para estabilidade do tronco.",
    isExpanded: false,
    onToggle: () => {},
    actionText: "Ver Exercício",
    url: "WhatsApp Video 2026-04-09 at 15.00.19 (1).mp4",
    onAction: () => {}
  },
  {
    id: 3,
    title: "Remada Unilateral com Halter",
    description: "Fortalecimento de costas e braços com apoio na parede para correção postural.",
    isExpanded: false,
    onToggle: () => {},
    actionText: "Ver Exercício",
    url: "WhatsApp Video 2026-04-09 at 15.00.38 (1).mp4",
    onAction: () => {}
  },
  {
    id: 4,
    title: "Ponte Pélvica (Elevação de Quadril)",
    description: "Fortalecimento de glúteos e região lombar com os pés apoiados no solo.",
    isExpanded: false,
    onToggle: () => {},
    actionText: "Ver Exercício",
    url: "WhatsApp Video 2026-04-09 at 15.00.38 (2).mp4",
    onAction: () => {}
  },
  {
    id: 5,
    title: "Ponte Unilateral",
    description: "Variação avançada da ponte pélvica para fortalecimento assimétrico de glúteos.",
    isExpanded: false,
    onToggle: () => {},
    actionText: "Ver Exercício",
    url: "WhatsApp Video 2026-04-09 at 15.00.38 (4).mp4",
    onAction: () => {}
  },
  {
    id: 6,
    title: "Supino Reto com Halteres",
    description: "Fortalecimento de peitoral e tríceps realizado em decúbito dorsal (deitado).",
    isExpanded: false,
    onToggle: () => {},
    actionText: "Ver Exercício",
    url: "WhatsApp Video 2026-04-09 at 15.00.38 (3).mp4",
    onAction: () => {}
  },
  {
    id: 7,
    title: "Elevação Frontal com Halteres",
    description: "Exercício focado na porção anterior dos ombros (deltoide).",
    isExpanded: false,
    onToggle: () => {},
    actionText: "Ver Exercício",
    url: "WhatsApp Video 2026-04-09 at 15.00.39 (1).mp4",
    onAction: () => {}
  },
  {
    id: 8,
    title: "Elevação Lateral com Halteres",
    description: "Trabalho para a porção medial dos ombros, melhorando a estabilidade escapular.",
    isExpanded: false,
    onToggle: () => {},
    actionText: "Ver Exercício",
    url: "WhatsApp Video 2026-04-09 at 15.00.39 (2).mp4",
    onAction: () => {}
  },
  {
    id: 9,
    title: "Extensão de Perna Sentada (Alternada)",
    description: "Exercício de mobilidade e força para membros inferiores em posição sentada.",
    isExpanded: false,
    onToggle: () => {},
    actionText: "Ver Exercício",
    url: "WhatsApp Video 2026-04-09 at 15.00.39 (3).mp4",
    onAction: () => {}
  }
];
// Finalidades de tratamento de dados (LGPD). Os textos são rascunho técnico e precisam de
// revisão jurídica antes da distribuição. As chaves espelham o enum ConsentPurpose do backend.
export type ConsentPurpose = 'HEALTH_DATA' | 'AI_MASCOT' | 'NOTIFICATIONS';

export interface ConsentInfo {
  purpose: ConsentPurpose;
  title: string;
  unlocks: string;
  what: string;
  why: string;
  sharedWith: string;
  ifDenied: string;
}

export const CONSENTS: ConsentInfo[] = [
  {
    purpose: 'HEALTH_DATA',
    title: 'Dados de saúde',
    unlocks: 'Diário, tratamentos e calendário',
    what: 'O que você escreve no diário, seus registros de humor e os tratamentos que cadastrar (medicamento, horários, médico e hospital).',
    why: 'Guardar seus registros e mostrar seus lembretes e seu histórico só para você.',
    sharedWith: 'Ninguém. Ficam nos servidores do OncoMente.',
    ifDenied: 'O diário, os tratamentos e o calendário ficam indisponíveis. O que você já registrou continua guardado e só é apagado se você excluir a conta.',
  },
  {
    purpose: 'AI_MASCOT',
    title: 'Mascote com inteligência artificial',
    unlocks: 'Conversa com o mascote',
    what: 'As mensagens que você envia ao mascote e, se o consentimento de dados de saúde estiver ativo, um resumo dos seus tratamentos e do seu humor recente.',
    why: 'Gerar respostas de acolhimento. O mascote é uma IA: não é profissional de saúde, não dá diagnóstico e não substitui sua equipe médica.',
    sharedWith: 'Groq, empresa que processa as mensagens em servidores fora do Brasil.',
    ifDenied: 'A conversa com o mascote fica indisponível.',
  },
  {
    purpose: 'NOTIFICATIONS',
    title: 'Notificações',
    unlocks: 'Lembretes de tratamento e mensagens de apoio',
    what: 'Os horários dos seus tratamentos e seu histórico de notificações, guardados no aparelho.',
    why: 'Avisar você na hora dos medicamentos e enviar mensagens de apoio.',
    sharedWith: 'Ninguém. As notificações são geradas no próprio aparelho.',
    ifDenied: 'Você não recebe lembretes nem mensagens do app.',
  },
];

export const consentInfo = (purpose: ConsentPurpose) =>
  CONSENTS.find((c) => c.purpose === purpose)!;

export interface EmoteData {
  id: string;
  emoji: string;
  icon: string;
  color: string;
  label: string;
}

export const EMOTES: EmoteData[] = [
  { id: 'very_happy', emoji: '🤩', icon: 'emoticon-excited-outline', color: '#D1FFBD', label: 'Incrível' },
  { id: 'happy',      emoji: '😊', icon: 'emoticon-happy-outline',   color: '#BDE3FF', label: 'Bem' },
  { id: 'neutral',    emoji: '😐', icon: 'emoticon-neutral-outline', color: '#FFFDB7', label: 'Normal' },
  { id: 'sad',        emoji: '😢', icon: 'emoticon-sad-outline',     color: '#FFD1BD', label: 'Baixo' },
  { id: 'bad',        emoji: '😖', icon: 'emoticon-confused-outline',color: '#BDBFFF', label: 'Ruim' },
];

export const EMOTE_BY_ID = Object.fromEntries(EMOTES.map(e => [e.id, e])) as Record<string, EmoteData>;

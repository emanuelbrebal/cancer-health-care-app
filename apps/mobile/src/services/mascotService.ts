import api from './api';

export interface MascotProfile {
  name: string | null;
  pronoun: string | null;
  role: string;
  age: number | null;
}

export interface MascotContext {
  profile: MascotProfile | null;
  treatments: {
    name: string;
    frequency: string;
    startTime: string;
    endDate: string;
  }[];
  emotionSummary: {
    date: string;
    emotes: string[];
  }[];
}

const mascotService = {
  getContext: (): Promise<MascotContext> =>
    api.get('/ai-support/context').then(r => r.data),
};

export default mascotService;

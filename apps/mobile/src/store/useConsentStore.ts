import { create } from 'zustand';
import api from '../services/api';
import type { ConsentPurpose } from '../constants/consents';

interface ConsentRow {
  purpose: ConsentPurpose;
  granted: boolean;
}

type Status = 'idle' | 'loading' | 'ready' | 'error';

interface ConsentState {
  ownerId: string | null;
  status: Status;
  granted: Record<ConsentPurpose, boolean>;
  load: (userId: string, force?: boolean) => Promise<void>;
  setConsent: (purpose: ConsentPurpose, granted: boolean) => Promise<void>;
}

// Negado por padrão: o estado só vira true com a resposta do servidor.
const DENIED: Record<ConsentPurpose, boolean> = {
  HEALTH_DATA: false,
  AI_MASCOT: false,
  NOTIFICATIONS: false,
};

const toMap = (rows: ConsentRow[]) =>
  rows.reduce((acc, row) => ({ ...acc, [row.purpose]: row.granted }), { ...DENIED });

// Não persistido: o servidor é a fonte da verdade e o estado é recarregado por usuário.
export const useConsentStore = create<ConsentState>((set, get) => ({
  ownerId: null,
  status: 'idle',
  granted: { ...DENIED },

  load: async (userId, force = false) => {
    const { ownerId, status } = get();
    if (!force && ownerId === userId && (status === 'ready' || status === 'loading')) return;

    set({ ownerId: userId, status: 'loading', granted: { ...DENIED } });
    try {
      const { data } = await api.get<ConsentRow[]>('/consents');
      if (get().ownerId === userId) set({ status: 'ready', granted: toMap(data) });
    } catch {
      if (get().ownerId === userId) set({ status: 'error' });
    }
  },

  setConsent: async (purpose, granted) => {
    const { data } = await api.put<ConsentRow[]>(`/consents/${purpose}`, { granted });
    set({ status: 'ready', granted: toMap(data) });
  },
}));

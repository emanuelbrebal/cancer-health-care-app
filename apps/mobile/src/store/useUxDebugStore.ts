import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ForcedState = 'auto' | 'loading' | 'success' | 'error' | 'empty';

interface UxDebugState {
  /** Mostra o painel discreto de simulação de estados (para gravação/demonstração). */
  panelVisible: boolean;
  /** Estado forçado em todas as telas que buscam dados. 'auto' = comportamento real. */
  forced: ForcedState;
  setPanelVisible: (visible: boolean) => void;
  setForced: (forced: ForcedState) => void;
}

export const useUxDebugStore = create<UxDebugState>()(
  persist(
    (set) => ({
      panelVisible: process.env.EXPO_PUBLIC_UX_DEBUG === '1',
      forced: 'auto',
      setPanelVisible: (panelVisible) => set({ panelVisible }),
      setForced: (forced) => set({ forced }),
    }),
    { name: 'oncomente:ux-debug', storage: createJSONStorage(() => AsyncStorage) },
  ),
);

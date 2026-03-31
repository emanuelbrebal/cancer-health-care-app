import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';
import { createAuthStore } from '../../../../packages/shared/store/useAuthStore'

export const useAuthStore = createAuthStore(
    createJSONStorage(() => AsyncStorage) as any
);
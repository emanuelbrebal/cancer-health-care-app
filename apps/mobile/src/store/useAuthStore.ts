import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';
import { createAuthStore } from '../../../../packages/shared/store/useAuthStore'
import { revokeSession } from '../services/session';

const LOCAL_DATA_KEYS = [
  'oncomente-treatments',
  'oncomente:notification-history',
  'oncomente:notifications:consent',
  'oncomente-treatment-local-ids',
  'oncomente:chat-history',
];

export const useAuthStore = createAuthStore(
    createJSONStorage(() => AsyncStorage) as any,
    async () => {
        await Promise.all([AsyncStorage.multiRemove(LOCAL_DATA_KEYS), revokeSession()]);
    },
);
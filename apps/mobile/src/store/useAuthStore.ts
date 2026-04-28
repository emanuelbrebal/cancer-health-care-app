import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';
import { createAuthStore } from '../../../../packages/shared/store/useAuthStore'

const LOCAL_DATA_KEYS = [
  'oncomente-treatments',
  'oncomente:notification-history',
  'oncomente:notifications:consent',
  'oncomente-treatment-local-ids',
];

export const useAuthStore = createAuthStore(
    createJSONStorage(() => AsyncStorage) as any,
    () => AsyncStorage.multiRemove(LOCAL_DATA_KEYS),
);
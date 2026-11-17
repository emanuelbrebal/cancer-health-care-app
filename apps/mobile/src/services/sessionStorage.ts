import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Refresh token fica no cofre do sistema (Keychain/Keystore). No Expo Web não há cofre:
// cai para AsyncStorage (localStorage).
const KEY = 'oncomente.refresh-token';
const isWeb = Platform.OS === 'web';

export const sessionStorage = {
  get(): Promise<string | null> {
    return isWeb ? AsyncStorage.getItem(KEY) : SecureStore.getItemAsync(KEY);
  },

  async set(token: string): Promise<void> {
    if (isWeb) await AsyncStorage.setItem(KEY, token);
    else await SecureStore.setItemAsync(KEY, token);
  },

  async clear(): Promise<void> {
    if (isWeb) await AsyncStorage.removeItem(KEY);
    else await SecureStore.deleteItemAsync(KEY);
  },
};

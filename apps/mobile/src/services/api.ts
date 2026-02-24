import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Lembre-se: no Android Emulator, localhost é 10.0.2.2
// No iPhone/Dispositivo físico, use o IP da sua máquina
const api = axios.create({
  baseURL: 'http://192.168.0.10:3000', 
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('user_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
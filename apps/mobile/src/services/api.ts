import axios from 'axios';
import { router } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';

// Lembre-se: no Android Emulator, localhost é 10.0.2.2
// No iPhone/Dispositivo físico, use o IP da sua máquina
const api = axios.create({
  baseURL: 'http://192.168.0.5:3000',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      router.replace('/(auth)/LoginScreen');
    }
    return Promise.reject(error);
  }
);

export default api;

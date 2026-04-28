import axios from 'axios';
import { router } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000',
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
      const { token } = useAuthStore.getState();
      if (token) {
        useAuthStore.getState().logout();
        router.replace('/(auth)/LoginScreen');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

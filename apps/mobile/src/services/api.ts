import axios, { AxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';
import { resolveApiBaseUrl } from './resolveApiBaseUrl';
import { refreshSession } from './session';

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetriableConfig = AxiosRequestConfig & { _retried?: boolean };

function endSession() {
  useAuthStore.getState().logout();
  router.replace('/(auth)/LoginScreen');
}

// 401 com sessão aberta: renova o access token uma vez e repete a requisição.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as RetriableConfig | undefined;
    const isAuthRoute = config?.url?.startsWith('/auth/');
    const hasSession = !!useAuthStore.getState().token;

    if (error.response?.status !== 401 || !config || isAuthRoute || !hasSession) {
      return Promise.reject(error);
    }
    if (config._retried) {
      endSession();
      return Promise.reject(error);
    }

    const result = await refreshSession();
    if (result.status === 'offline') return Promise.reject(error);
    if (result.status === 'expired') {
      endSession();
      return Promise.reject(error);
    }

    useAuthStore.getState().setToken(result.accessToken);
    config._retried = true;
    return api(config);
  }
);

export default api;
